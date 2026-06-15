import { spawn } from "node:child_process";
import { createServer } from "node:net";

const PLAYWRIGHT_TIMEOUT_MS = 120_000;

function spawnCommand(command, args, options = {}) {
  return spawn(command, args, {
    stdio: "inherit",
    shell: process.platform !== "win32",
    ...options,
  });
}

function terminateProcess(child) {
  if (!child || child.killed) {
    return Promise.resolve();
  }

  if (process.platform === "win32") {
    const killer = spawn("taskkill", ["/PID", String(child.pid), "/T", "/F"], {
      stdio: "ignore",
    });

    return new Promise((resolve) => {
      killer.on("exit", resolve);
      killer.on("error", resolve);
    });
  }

  child.kill("SIGTERM");
  return Promise.resolve();
}

async function runChildProcess(command, args, env) {
  return await new Promise((resolve, reject) => {
    const child = spawnCommand(command, args, { env });
    const timer = setTimeout(async () => {
      await terminateProcess(child);
      reject(
        new Error(
          `Command timed out after ${PLAYWRIGHT_TIMEOUT_MS / 1000} seconds: ${command} ${args.join(" ")}`,
        ),
      );
    }, PLAYWRIGHT_TIMEOUT_MS);

    child.on("exit", (code) => {
      clearTimeout(timer);
      resolve(code ?? 1);
    });

    child.on("error", async (error) => {
      clearTimeout(timer);
      await terminateProcess(child);
      reject(error);
    });
  });
}

async function waitForServer(url, attempts = 30) {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url);

      if (response.ok) {
        return;
      }
    } catch {
      // Keep retrying until the server is ready.
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  throw new Error(`Server did not become ready at ${url}`);
}

async function getAvailablePort() {
  return await new Promise((resolve, reject) => {
    const server = createServer();

    server.listen(0, "127.0.0.1", () => {
      const address = server.address();

      if (!address || typeof address === "string") {
        server.close(() => reject(new Error("Could not determine an open port.")));
        return;
      }

      const { port } = address;
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(port);
      });
    });

    server.on("error", reject);
  });
}

const SERVER_PORT = String(await getAvailablePort());
const SERVER_URL = `http://127.0.0.1:${SERVER_PORT}/sign-in`;
const PLAYWRIGHT_OUTPUT_DIR = `.playwright-results/run-${Date.now()}`;

const startCommand =
  process.platform === "win32"
    ? ["cmd.exe", ["/c", `npm run start -- --hostname 127.0.0.1 --port ${SERVER_PORT}`]]
    : ["npm", ["run", "start", "--", "--hostname", "127.0.0.1", "--port", SERVER_PORT]];

const server = spawnCommand(startCommand[0], startCommand[1], {
  env: {
    ...process.env,
    PLAYWRIGHT_BASE_URL: `http://127.0.0.1:${SERVER_PORT}`,
    PLAYWRIGHT_OUTPUT_DIR,
  },
});

const cleanup = async () => {
  await terminateProcess(server);
};

process.on("SIGINT", async () => {
  await cleanup();
  process.exit(130);
});

process.on("SIGTERM", async () => {
  await cleanup();
  process.exit(143);
});

try {
  await waitForServer(SERVER_URL);

  const playwrightCommand =
    process.platform === "win32"
      ? ["cmd.exe", ["/c", "npx playwright test --config playwright.config.ts"]]
      : ["npx", ["playwright", "test", "--config", "playwright.config.ts"]];

  const result = await runChildProcess(playwrightCommand[0], playwrightCommand[1], {
    ...process.env,
    PLAYWRIGHT_BASE_URL: `http://127.0.0.1:${SERVER_PORT}`,
    PLAYWRIGHT_OUTPUT_DIR,
  });

  await cleanup();
  process.exit(result);
} catch (error) {
  await cleanup();
  console.error(error);
  process.exit(1);
}

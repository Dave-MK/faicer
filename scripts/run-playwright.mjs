import { spawn } from "node:child_process";

const SERVER_URL = "http://127.0.0.1:3001/sign-in";
const SERVER_PORT = "3001";

function spawnCommand(command, args, options = {}) {
  return spawn(command, args, {
    stdio: "inherit",
    shell: process.platform !== "win32",
    ...options,
  });
}

function terminateProcess(child) {
  if (!child || child.killed) {
    return;
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

const startCommand =
  process.platform === "win32"
    ? ["cmd.exe", ["/c", `npm run start -- --hostname 127.0.0.1 --port ${SERVER_PORT}`]]
    : ["npm", ["run", "start", "--", "--hostname", "127.0.0.1", "--port", SERVER_PORT]];

const server = spawnCommand(startCommand[0], startCommand[1], {
  env: process.env,
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

  const result = await new Promise((resolve, reject) => {
    const child = spawnCommand(playwrightCommand[0], playwrightCommand[1], {
      env: process.env,
    });

    child.on("exit", (code) => resolve(code ?? 1));
    child.on("error", reject);
  });

  await cleanup();
  process.exit(result);
} catch (error) {
  await cleanup();
  console.error(error);
  process.exit(1);
}

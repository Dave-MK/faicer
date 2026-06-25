import Link from "next/link";
import { FaicerLogo } from "@/components/FaicerLogo";
import { AuthShell } from "@/components/PublicChrome";
import { updatePasswordAction } from "@/app/actions/auth";

export default async function UpdatePasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  const errorMessage =
    params.error === "invalid-password"
      ? "Password must be at least 8 characters."
      : params.error === "update-failed"
        ? "Failed to update password. Your reset link may have expired — request a new one."
        : null;

  return (
    <AuthShell
      title="Set a new password"
      subtitle="Password update"
      lead="Choose a strong new password for your account."
      points={[
        "At least 8 characters",
        "Your old password will be replaced",
        "You'll be signed out of all devices",
      ]}
    >
      <div className="mx-auto max-w-[430px] rounded-[26px] border border-[var(--ai-border)] bg-[linear-gradient(180deg,rgba(11,23,42,0.98),rgba(8,17,31,0.98))] p-7 shadow-[0_16px_46px_rgba(1,8,20,0.38)]">
        <FaicerLogo
          variant="lockup"
          tone="on-dark"
          className="h-auto w-[150px]"
          priority
        />
        <h1 className="mt-8 text-[2rem] font-semibold text-white">Set new password</h1>
        <p className="mt-2 text-sm leading-7 text-[var(--ai-text-secondary)]">
          Choose a strong password of at least 8 characters.
        </p>

        {errorMessage && (
          <p className="mt-4 rounded-xl bg-[rgba(99,102,241,0.10)] px-4 py-3 text-sm text-[var(--ai-cyan)]">
            {errorMessage}
          </p>
        )}

        <form action={updatePasswordAction} className="mt-6 space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-white">New password</span>
            <input
              type="password"
              name="password"
              placeholder="At least 8 characters"
              required
              minLength={8}
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
            />
          </label>
          <button
            type="submit"
            className="brand-button-primary inline-flex w-full items-center justify-center rounded-xl px-5 py-3.5 text-sm font-semibold transition"
          >
            Update password
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/sign-in" className="text-sm font-medium text-[var(--ai-blue)]">
            Back to log in
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}

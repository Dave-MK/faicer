import Link from "next/link";
import { FaicerLogo } from "@/components/FaicerLogo";
import { AuthShell } from "@/components/PublicChrome";
import { resetPasswordAction } from "@/app/actions/auth";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const errorMessage =
    params.error === "invalid-email" ? "Please enter a valid email address." : null;

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Password reset"
      lead="Enter your email and we'll send you a reset link."
      points={[
        "Secure and private",
        "Link expires in 1 hour",
        "Need help? Contact support",
      ]}
    >
      <div className="mx-auto max-w-[430px] rounded-[26px] border border-[var(--ai-border)] bg-[linear-gradient(180deg,rgba(11,23,42,0.98),rgba(8,17,31,0.98))] p-7 shadow-[0_16px_46px_rgba(1,8,20,0.38)]">
        <FaicerLogo
          variant="lockup"
          tone="on-dark"
          className="h-auto w-[150px]"
          priority
        />
        <h1 className="mt-8 text-[2rem] font-semibold text-white">Reset your password</h1>
        <p className="mt-2 text-sm leading-7 text-[var(--ai-text-secondary)]">
          Enter your email address and we&apos;ll send you a reset link.
        </p>

        {errorMessage && (
          <p className="mt-4 rounded-xl bg-[rgba(99,102,241,0.10)] px-4 py-3 text-sm text-[var(--ai-cyan)]">
            {errorMessage}
          </p>
        )}

        <form action={resetPasswordAction} className="mt-6 space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-white">Email address</span>
            <input
              type="email"
              name="email"
              placeholder="you@company.com"
              required
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
            />
          </label>
          <button
            type="submit"
            className="brand-button-primary inline-flex w-full items-center justify-center rounded-xl px-5 py-3.5 text-sm font-semibold transition"
          >
            Send reset link
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

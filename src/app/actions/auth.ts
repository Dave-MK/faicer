"use server";

import { redirect } from "next/navigation";
import { isSupabaseAuthEnabled } from "@/lib/config/env";
import {
  createMockUserWithOrganisation,
} from "@/lib/data/mock-store";
import {
  findMockUserByEmail,
  getMockDefaultOrganisationId,
  persistMockRegistryBundle,
} from "@/lib/data/mock-registry";
import { signInSchema, signUpSchema } from "@/lib/validation/auth";
import {
  createSession,
  destroySession,
} from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getFirstSupabaseOrganisationId } from "@/lib/supabase/workspace";

function getOptionalString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : undefined;
}

export async function signInAction(formData: FormData) {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: getOptionalString(formData, "password"),
  });

  if (!parsed.success) {
    redirect("/sign-in?error=invalid-form");
  }

  if (isSupabaseAuthEnabled()) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password ?? "",
    });

    if (error || !data.user) {
      redirect("/sign-in?error=invalid-credentials");
    }

    const activeOrganisationId = await getFirstSupabaseOrganisationId(data.user.id);

    await createSession({
      userId: data.user.id,
      activeOrganisationId,
      email: data.user.email ?? parsed.data.email,
    });

    redirect(activeOrganisationId ? "/dashboard" : "/setup/organisation");
  }

  const user = await findMockUserByEmail(parsed.data.email);

  if (!user) {
    redirect("/sign-in?error=invalid-credentials");
  }

  await createSession({
    userId: user.id,
    activeOrganisationId: await getMockDefaultOrganisationId(user.id),
    email: user.email,
  });

  redirect("/dashboard");
}

export async function signUpAction(formData: FormData) {
  const parsed = signUpSchema.safeParse({
    displayName: formData.get("displayName"),
    email: formData.get("email"),
    password: getOptionalString(formData, "password"),
    organisationName: getOptionalString(formData, "organisationName"),
  });

  if (!parsed.success) {
    redirect("/sign-up?error=invalid-form");
  }

  if (isSupabaseAuthEnabled()) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password ?? "",
      options: {
        data: {
          display_name: parsed.data.displayName,
        },
      },
    });

    if (error || !data.user) {
      const code =
        error?.code === "email_address_invalid"
          ? "invalid-email"
          : error?.code === "over_email_send_rate_limit" || error?.status === 429
            ? "email-rate-limit"
            : "sign-up-failed";
      redirect(`/sign-up?error=${code}`);
    }

    if (data.session) {
      await createSession({
        userId: data.user.id,
        activeOrganisationId: null,
        email: data.user.email ?? parsed.data.email,
      });
      redirect("/setup/organisation");
    }

    await destroySession();
    redirect("/sign-in?message=check-email");
  }

  const created = createMockUserWithOrganisation({
    displayName: parsed.data.displayName,
    email: parsed.data.email,
    organisationName: parsed.data.organisationName ?? "New organisation",
  });
  await persistMockRegistryBundle(created);

  await createSession({
    userId: created.user.id,
    activeOrganisationId: created.organisation.id,
    email: created.user.email,
  });

  redirect("/dashboard");
}

export async function signOutAction() {
  if (isSupabaseAuthEnabled()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }

  await destroySession();
  redirect("/sign-in");
}

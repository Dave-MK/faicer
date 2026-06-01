"use server";

import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/config/env";
import {
  createMockUserWithOrganisation,
  getDefaultOrganisationId,
  getUserByEmail,
} from "@/lib/data/mock-store";
import { signInSchema, signUpSchema } from "@/lib/validation/auth";
import {
  createSession,
  destroySession,
} from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getFirstSupabaseOrganisationId } from "@/lib/supabase/workspace";

export async function signInAction(formData: FormData) {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    redirect("/sign-in");
  }

  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password ?? "",
    });

    if (error || !data.user) {
      redirect("/sign-in");
    }

    const activeOrganisationId = await getFirstSupabaseOrganisationId(data.user.id);

    await createSession({
      userId: data.user.id,
      activeOrganisationId,
      email: data.user.email ?? parsed.data.email,
    });

    redirect(activeOrganisationId ? "/dashboard" : "/setup/organisation");
  }

  const user = getUserByEmail(parsed.data.email);

  if (!user) {
    redirect("/sign-in");
  }

  await createSession({
    userId: user.id,
    activeOrganisationId: getDefaultOrganisationId(user.id),
    email: user.email,
  });

  redirect("/dashboard");
}

export async function signUpAction(formData: FormData) {
  const parsed = signUpSchema.safeParse({
    displayName: formData.get("displayName"),
    email: formData.get("email"),
    password: formData.get("password"),
    organisationName: formData.get("organisationName"),
  });

  if (!parsed.success) {
    redirect("/sign-up");
  }

  if (isSupabaseConfigured()) {
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
      redirect("/sign-up");
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
    redirect("/sign-in");
  }

  const created = createMockUserWithOrganisation({
    displayName: parsed.data.displayName,
    email: parsed.data.email,
    organisationName: parsed.data.organisationName ?? "New organisation",
  });

  await createSession({
    userId: created.user.id,
    activeOrganisationId: created.organisation.id,
    email: created.user.email,
  });

  redirect("/dashboard");
}

export async function signOutAction() {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }

  await destroySession();
  redirect("/sign-in");
}

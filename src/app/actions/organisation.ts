"use server";

import { redirect } from "next/navigation";
import { isSupabaseAuthEnabled } from "@/lib/config/env";
import {
  requireSignedInUser,
  requireWorkspaceContext,
} from "@/lib/auth/workspace";
import { createOrganisationSchema } from "@/lib/validation/organisation";
import { createMockOrganisationForUser } from "@/lib/data/mock-store";
import { persistMockRegistryBundle } from "@/lib/data/mock-registry";
import { createSession } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function createOrganisationAction(formData: FormData) {
  const user = await requireSignedInUser();
  const parsed = createOrganisationSchema.safeParse({
    name: formData.get("name"),
    sector: formData.get("sector"),
    country: formData.get("country"),
    employeeBand: formData.get("employeeBand"),
  });

  if (!parsed.success) {
    redirect("/setup/organisation");
  }

  if (isSupabaseAuthEnabled()) {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/sign-in");
    }

    await supabase.from("profiles").upsert({
      id: user.id,
      email: user.email ?? "",
      display_name:
        typeof user.user_metadata.display_name === "string"
          ? user.user_metadata.display_name
          : user.email ?? "User",
    });

    const { data: organisation, error: organisationError } = await supabase
      .from("organisations")
      .insert({
        name: parsed.data.name,
        sector: parsed.data.sector,
        country: parsed.data.country,
        employee_band: parsed.data.employeeBand,
      })
      .select("*")
      .single();

    if (organisationError || !organisation) {
      redirect("/setup/organisation");
    }

    await supabase.from("memberships").insert({
      organisation_id: organisation.id,
      user_id: user.id,
      role: "owner",
      status: "active",
      joined_at: new Date().toISOString(),
    });

    await supabase.from("audit_events").insert({
      organisation_id: organisation.id,
      actor_user_id: user.id,
      action: "organisation.created",
      entity_type: "organisation",
      entity_id: organisation.id,
      metadata_json: { mode: "supabase" },
    });

    await createSession({
      userId: user.id,
      activeOrganisationId: organisation.id,
      email: user.email ?? "",
    });

    redirect("/dashboard");
  }

  const context = await requireWorkspaceContext(["owner", "admin"]);
  const created = createMockOrganisationForUser(context.user.id, parsed.data);
  await persistMockRegistryBundle(created);

  await createSession({
    userId: context.user.id,
    activeOrganisationId: created.organisation.id,
    email: user.email,
  });

  redirect("/dashboard");
}

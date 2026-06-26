import "server-only";

import { getSessionSnapshot } from "@/lib/auth/session";
import { isSupabaseAuthEnabled } from "@/lib/config/env";
import { listMockAuditEvents } from "@/lib/data/mock-registry";
import {
  getFirstSupabaseOrganisationId,
  getSupabaseSessionUser,
  getSupabaseWorkspaceBundle,
} from "@/lib/supabase/workspace";
import type { WorkspaceAuditEvent } from "@/lib/types";

export type NotificationItem = {
  id: string;
  title: string;
  detail: string;
  createdAt: string;
};

const ACTION_LABELS: Record<string, string> = {
  "seed.loaded": "Workspace seeded",
  "organisation.created": "Organisation created",
  "member.invited": "Team member invited",
  "member.role_updated": "Member role changed",
  "member.deactivated": "Member deactivated",
  "ai_tool.created": "New AI tool registered",
  "ai_tool.updated": "AI tool updated",
  "use_case.created": "New use case added",
  "use_case.updated": "Use case updated",
  "policy.created": "New policy drafted",
  "policy.updated": "Policy updated",
  "risk.created": "New risk logged",
  "risk.updated": "Risk updated",
  "control.created": "New control added",
  "control.updated": "Control updated",
  "assessment.created": "Assessment recorded",
  "evidence.created": "Evidence captured",
  "incident.created": "Incident reported",
  "incident.updated": "Incident updated",
  "training_course.created": "Training course added",
};

function humanizeAction(action: string) {
  return ACTION_LABELS[action] ?? action.replace(/[._]/g, " ");
}

function toNotification(event: WorkspaceAuditEvent): NotificationItem {
  const detail =
    event.metadataJson.title ||
    event.metadataJson.name ||
    event.metadataJson.email ||
    event.entityType.replace(/_/g, " ");

  return {
    id: event.id,
    title: humanizeAction(event.action),
    detail,
    createdAt: event.createdAt,
  };
}

async function getRecentAuditEvents(): Promise<WorkspaceAuditEvent[]> {
  if (isSupabaseAuthEnabled()) {
    const sessionUser = await getSupabaseSessionUser();
    if (!sessionUser) return [];

    const session = await getSessionSnapshot();
    const activeOrganisationId =
      session?.userId === sessionUser.workspaceUser.id
        ? session.activeOrganisationId
        : null;

    const organisationId =
      activeOrganisationId ??
      (await getFirstSupabaseOrganisationId(sessionUser.workspaceUser.id));

    if (!organisationId) return [];

    const bundle = await getSupabaseWorkspaceBundle(
      sessionUser.workspaceUser.id,
      organisationId,
    );
    return bundle?.auditEvents ?? [];
  }

  const session = await getSessionSnapshot();
  if (!session?.userId || !session.activeOrganisationId) return [];

  const events = await listMockAuditEvents(session.activeOrganisationId);
  return [...events].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/**
 * Recent organisation activity surfaced as header notifications.
 * Returns [] for signed-out / context-less requests rather than throwing, so it
 * is safe to call from a route handler.
 */
export async function getRecentNotifications(limit = 8): Promise<NotificationItem[]> {
  try {
    const events = await getRecentAuditEvents();
    return events.slice(0, limit).map(toNotification);
  } catch {
    return [];
  }
}

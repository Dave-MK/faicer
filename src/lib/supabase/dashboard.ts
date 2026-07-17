import type { DashboardStats } from "@/lib/types";
import { listSupabaseTools } from "@/lib/supabase/tools";
import { listSupabaseUseCases } from "@/lib/supabase/use-cases";
import { listSupabasePolicies } from "@/lib/supabase/policies";
import { listSupabaseRisks } from "@/lib/supabase/risks";
import { listSupabaseControls } from "@/lib/supabase/controls";
import { listSupabaseAssessments } from "@/lib/supabase/assessments";
import { listSupabaseEvidence } from "@/lib/supabase/evidence";
import { listSupabaseIncidents } from "@/lib/supabase/incidents";

// Mirrors getDashboardStats() from the mock store, but sourced from Supabase.
// Keeps the reports and dashboard health scores correct in hosted-auth mode
// instead of silently reading the local mock registry.
export async function getSupabaseDashboardStats(
  organisationId: string,
): Promise<DashboardStats> {
  const [tools, useCases, policies, risks, controls, assessments, evidence, incidents] =
    await Promise.all([
      listSupabaseTools(organisationId),
      listSupabaseUseCases(organisationId),
      listSupabasePolicies(organisationId),
      listSupabaseRisks(organisationId),
      listSupabaseControls(organisationId),
      listSupabaseAssessments(organisationId),
      listSupabaseEvidence(organisationId),
      listSupabaseIncidents(organisationId),
    ]);

  return {
    tools: {
      total: tools.length,
      approved: tools.filter((t) => t.approvalStatus === "approved").length,
      restricted: tools.filter((t) => t.approvalStatus === "restricted").length,
      prohibited: tools.filter((t) => t.approvalStatus === "prohibited").length,
    },
    policies: {
      total: policies.length,
      active: policies.filter((p) => p.status === "active").length,
    },
    risks: {
      total: risks.length,
      high: risks.filter((r) => r.riskLevel === "high" || r.riskLevel === "critical").length,
      medium: risks.filter((r) => r.riskLevel === "medium").length,
      low: risks.filter((r) => r.riskLevel === "low").length,
    },
    evidence: { total: evidence.length },
    controls: { total: controls.length },
    assessments: { total: assessments.length },
    useCases: {
      total: useCases.length,
      approved: useCases.filter((uc) => uc.status === "approved").length,
    },
    incidents: {
      total: incidents.length,
      open: incidents.filter((i) => i.status === "open" || i.status === "investigating").length,
    },
  };
}

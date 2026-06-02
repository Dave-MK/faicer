import type { ToolApprovalStatus, ToolCategory } from "@/lib/types";

export const toolCategoryOptions: Array<{
  value: ToolCategory;
  label: string;
}> = [
  { value: "general_chatbot", label: "General-purpose chatbot" },
  { value: "image_generation", label: "Image generation" },
  { value: "audio_generation", label: "Audio generation" },
  { value: "video_generation", label: "Video generation" },
  { value: "transcription", label: "Transcription" },
  { value: "meeting_assistant", label: "Meeting assistant" },
  { value: "coding_assistant", label: "Coding assistant" },
  { value: "marketing_automation", label: "Marketing automation" },
  { value: "crm_feature", label: "CRM feature" },
  { value: "recruitment_feature", label: "Recruitment feature" },
  { value: "analytics_feature", label: "Analytics feature" },
  { value: "other", label: "Other" },
];

export const toolApprovalOptions: Array<{
  value: ToolApprovalStatus;
  label: string;
  tone: string;
}> = [
  { value: "approved", label: "Approved", tone: "brand-status-success" },
  {
    value: "restricted",
    label: "Restricted",
    tone: "brand-status-warning",
  },
  {
    value: "prohibited",
    label: "Prohibited",
    tone: "brand-status-danger",
  },
];

export function getToolCategoryLabel(category: ToolCategory) {
  return (
    toolCategoryOptions.find((option) => option.value === category)?.label ??
    category
  );
}

export function getToolApprovalMeta(status: ToolApprovalStatus) {
  return (
    toolApprovalOptions.find((option) => option.value === status) ?? {
      value: status,
      label: status,
      tone: "brand-status-muted",
    }
  );
}

export function formatToolReviewDate(value: string | null) {
  if (!value) {
    return "Not scheduled";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

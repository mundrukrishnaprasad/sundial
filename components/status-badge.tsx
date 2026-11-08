import { Badge } from "./ui";

const statusMap = {
  draft: { label: "Draft", tone: "neutral" as const },
  submitted: { label: "Submitted", tone: "olive" as const },
  approved: { label: "Approved", tone: "olive" as const },
  rejected: { label: "Rejected", tone: "danger" as const },
};

export function StatusBadge({ status }: { status: string | null | undefined }) {
  const item = statusMap[status as keyof typeof statusMap] ?? {
    label: status ?? "Not started",
    tone: "muted" as const,
  };
  return (
    <Badge tone={item.tone} dot>
      {item.label}
    </Badge>
  );
}

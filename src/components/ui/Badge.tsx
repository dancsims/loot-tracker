type BadgeVariant = "character" | "location" | "notable" | "srd" | "neutral";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

export function Badge({ variant = "neutral", children }: BadgeProps) {
  return <span className={`badge ${variant}`}>{children}</span>;
}

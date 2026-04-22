import { Chip } from "@mui/material";

type BadgeVariant = "character" | "location" | "notable" | "srd" | "neutral";

const COLORS: Record<BadgeVariant, { bg: string; color: string }> = {
  character: { bg: "#e6f1fb", color: "#0c447c" },
  location:  { bg: "#eaf3de", color: "#27500a" },
  notable:   { bg: "#faeeda", color: "#633806" },
  srd:       { bg: "#eeedfe", color: "#3c3489" },
  neutral:   { bg: "#f0f0ee", color: "#6b6b67" },
};

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

export function Badge({ variant = "neutral", children }: BadgeProps) {
  const { bg, color } = COLORS[variant];
  return (
    <Chip
      label={children}
      size="small"
      sx={{
        bgcolor: bg,
        color,
        fontWeight: 500,
        fontSize: 11,
        height: 20,
        borderRadius: "10px",
        "& .MuiChip-label": { px: "6px" },
      }}
    />
  );
}

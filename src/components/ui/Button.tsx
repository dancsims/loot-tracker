// Re-export MUI Button with our variant mapping so callers don't need to change.
import {
  Button as MuiButton,
  type ButtonProps as MuiButtonProps,
} from "@mui/material";

type Variant = "default" | "primary" | "danger";
type Size = "sm" | "md";

interface ButtonProps extends Omit<
  MuiButtonProps,
  "variant" | "size" | "color"
> {
  variant?: Variant;
  size?: Size;
}

export function Button({
  variant = "default",
  size = "md",
  children,
  sx,
  ...rest
}: ButtonProps) {
  const muiVariant = variant === "primary" ? "contained" : "outlined";
  const muiColor =
    variant === "danger"
      ? "error"
      : variant === "primary"
        ? "primary"
        : "inherit";
  const muiSize = size === "sm" ? "small" : "medium";

  const defaultSx =
    variant === "default"
      ? {
          color: "var(--text-primary)",
          borderColor: "var(--border)",
          backgroundColor: "var(--bg-secondary)",
          "&:hover": {
            borderColor: "var(--border-md)",
            backgroundColor: "var(--bg-tertiary)",
          },
        }
      : {};

  return (
    <MuiButton
      variant={muiVariant}
      color={muiColor}
      size={muiSize}
      sx={{ ...defaultSx, ...sx }}
      {...rest}
    >
      {children}
    </MuiButton>
  );
}

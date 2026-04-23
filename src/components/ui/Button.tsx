// Re-export MUI Button with our variant mapping so callers don't need to change.
import {
  Button as MuiButton,
  type ButtonProps as MuiButtonProps,
} from "@mui/material";

type Variant = "default" | "primary" | "danger";
type Size = "sm" | "md";

interface ButtonProps extends Omit<MuiButtonProps, "variant" | "size" | "color"> {
  variant?: Variant;
  size?: Size;
}

export function Button({ variant = "default", size = "md", children, ...rest }: ButtonProps) {
  const muiVariant = variant === "primary" ? "contained" : "outlined";
  const muiColor = variant === "danger" ? "error" : variant === "primary" ? "primary" : "inherit";
  const muiSize = size === "sm" ? "small" : "medium";

  return (
    <MuiButton variant={muiVariant} color={muiColor} size={muiSize} {...rest}>
      {children}
    </MuiButton>
  );
}

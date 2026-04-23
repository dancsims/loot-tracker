import type { ReactNode } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormLabel,
  Stack,
} from "@mui/material";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

export function Modal({ title, onClose, children, footer }: ModalProps) {
  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontSize: 15, fontWeight: 500, pb: 1 }}>{title}</DialogTitle>
      <DialogContent dividers sx={{ pt: 1.5 }}>
        <Stack spacing={1.5}>{children}</Stack>
      </DialogContent>
      {footer && <DialogActions sx={{ px: 2, py: 1.5, gap: 0.75 }}>{footer}</DialogActions>}
    </Dialog>
  );
}

interface FieldProps {
  label: string;
  children: ReactNode;
  hint?: ReactNode;
}

export function Field({ label, children, hint }: FieldProps) {
  return (
    <FormControl fullWidth size="small">
      <FormLabel
        sx={{
          fontSize: 11,
          color: "text.secondary",
          textTransform: "uppercase",
          letterSpacing: "0.03em",
          mb: 0.4,
          display: "flex",
          gap: 0.5,
          alignItems: "center",
        }}
      >
        {label}
        {hint}
      </FormLabel>
      {children}
    </FormControl>
  );
}

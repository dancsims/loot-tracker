import type { ReactNode } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormLabel,
  Stack,
  Drawer,
  Box,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Button } from "./Button";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

const dialogSx = {
  "& .MuiDialog-paper": {
    backgroundColor: "var(--bg-primary)",
    color: "var(--text-primary)",
  },
  "& .MuiDialogTitle-root": {
    color: "var(--text-primary)",
  },
  "& .MuiDialogContent-root": {
    borderColor: "var(--border)",
  },
  "& .MuiDialogActions-root": {
    borderColor: "var(--border)",
  },
};

export function Modal({ title, onClose, children, footer }: ModalProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (isMobile) {
    return (
      <Drawer
        anchor="bottom"
        open
        onClose={onClose}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            backgroundColor: "var(--bg-primary)",
            color: "var(--text-primary)",
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <Box
          sx={{
            px: 2,
            pt: 2,
            pb: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            fontWeight={600}
            fontSize={15}
            color="var(--text-primary)"
          >
            {title}
          </Typography>
          <Button size="sm" onClick={onClose}>
            ✕
          </Button>
        </Box>
        <Divider sx={{ borderColor: "var(--border)" }} />
        <Box sx={{ px: 2, py: 1.5, overflowY: "auto", flex: 1 }}>
          <Stack spacing={1.5}>{children}</Stack>
        </Box>
        {footer && (
          <>
            <Divider sx={{ borderColor: "var(--border)" }} />
            <Box
              sx={{
                px: 2,
                py: 1.5,
                display: "flex",
                justifyContent: "flex-end",
                gap: 1,
              }}
            >
              {footer}
            </Box>
          </>
        )}
      </Drawer>
    );
  }

  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth sx={dialogSx}>
      <DialogTitle sx={{ fontSize: 15, fontWeight: 500, pb: 1 }}>
        {title}
      </DialogTitle>
      <DialogContent dividers sx={{ pt: 1.5 }}>
        <Stack spacing={1.5}>{children}</Stack>
      </DialogContent>
      {footer && (
        <DialogActions sx={{ px: 2, py: 1.5, gap: 0.75 }}>
          {footer}
        </DialogActions>
      )}
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
          color: "var(--text-secondary)",
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

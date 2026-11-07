import { create } from "zustand";

export type AiDialog = "generate" | "plan" | null;

interface AiUiState {
  drawerOpen: boolean;
  dialog: AiDialog;
  summarySprintId: string | null;
  setDrawerOpen: (open: boolean) => void;
  openDialog: (d: Exclude<AiDialog, null>) => void;
  closeDialog: () => void;
  openSummary: (sprintId: string) => void;
  closeSummary: () => void;
}

export const useAiUi = create<AiUiState>((set) => ({
  drawerOpen: false,
  dialog: null,
  summarySprintId: null,
  setDrawerOpen: (drawerOpen) => set({ drawerOpen }),
  openDialog: (dialog) => set({ dialog, summarySprintId: null }),
  closeDialog: () => set({ dialog: null }),
  openSummary: (summarySprintId) => set({ summarySprintId, dialog: null }),
  closeSummary: () => set({ summarySprintId: null }),
}));

import { create } from "zustand";

interface AuthDialogState {
  isOpenDialog: boolean;
  setIsOpenDialog: (value: boolean) => void;
}

export const useAuthDialog = create<AuthDialogState>((set) => ({
  isOpenDialog: false,
  setIsOpenDialog: (value: boolean) =>
    set((state: { isOpenDialog: boolean }) => ({ isOpenDialog: value })),
}));

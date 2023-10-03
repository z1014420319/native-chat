import { create } from "zustand";

interface AiLoadingState {
  isAiLoading: boolean;
  setIsAiLoding: (value: boolean) => void;
}

export const useAiLoading = create<AiLoadingState>((set) => ({
  isAiLoading: false,
  setIsAiLoding: (value: boolean) =>
    set((state: { isAiLoading: boolean }) => ({ isAiLoading: value })),
}));

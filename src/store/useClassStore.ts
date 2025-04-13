import { create } from "zustand";

interface ClassState {
  classId: number | null;
  setClassId: (id: number) => void;
}

export const useClassStore = create<ClassState>((set) => ({
  classId: null,
  setClassId: (id) => set({ classId: id }),
}));

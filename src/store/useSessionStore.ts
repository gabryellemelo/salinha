import { create } from "zustand";

interface SessionStore {
  classId: number | null;
  scheduleId: number | null;
  scheduleDate: string | null;
  setSession: (scheduleId: number, classId: number, scheduleDate: string) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionStore>((set) => ({
  classId: null,
  scheduleId: null,
  scheduleDate: null,
  setSession: (scheduleId, classId, scheduleDate) =>
    set({ scheduleId, classId, scheduleDate }),
  clearSession: () => set({ classId: null, scheduleId: null, scheduleDate: null }),
}));

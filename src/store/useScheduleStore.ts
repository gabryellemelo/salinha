import { create } from "zustand";

interface ScheduleState {
  scheduleId: number | null;
  setScheduleId: (id: number) => void;
}

export const useScheduleStore = create<ScheduleState>((set) => ({
  scheduleId: null,
  setScheduleId: (id) => set({ scheduleId: id }),
}));

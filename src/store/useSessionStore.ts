import { create } from "zustand";

interface AttendanceRecord {
  id: number;
  childId: number;
  scheduleId: number;
  checkInTime: string;
  checkOutTime?: string;
  status: 'present' | 'absent' | 'checked_out';
  child: {
    id: number;
    name: string;
    age: number;
    intolerances_restrictions: string;
    image_authorization: boolean;
    guardian: {
      name: string;
      phone: string;
    };
  };
}

interface SessionStore {
  classId: number | null;
  scheduleId: number | null;
  scheduleDate: string | null;
  currentEventId: number | null;
  attendanceData: AttendanceRecord[];
  setSession: (scheduleId: number, classId: number, scheduleDate: string) => void;
  setCurrentEvent: (eventId: number) => void;
  updateAttendance: (data: AttendanceRecord[]) => void;
  clearSession: () => void;
  clearEvent: () => void;
}

export const useSessionStore = create<SessionStore>((set) => ({
  classId: null,
  scheduleId: null,
  scheduleDate: null,
  currentEventId: null,
  attendanceData: [],
  setSession: (scheduleId, classId, scheduleDate) =>
    set({ scheduleId, classId, scheduleDate }),
  setCurrentEvent: (eventId) =>
    set({ currentEventId: eventId }),
  updateAttendance: (data) =>
    set({ attendanceData: data }),
  clearSession: () => set({ 
    classId: null, 
    scheduleId: null, 
    scheduleDate: null 
  }),
  clearEvent: () => set({ 
    currentEventId: null, 
    attendanceData: [] 
  }),
}));

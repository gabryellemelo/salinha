import { useState } from "react";
import client from "../client";
import { IChild } from "../models/Child";

export interface AttendanceRecord {
  id: number;
  childId: number;
  scheduleId: number;
  checkInTime: string;
  checkOutTime?: string;
  status: "present" | "absent" | "checked_out";
  releasedBy?: string;
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

export type AvailableChild = IChild & {
  classId: number;
};

export const useEventCheckin = () => {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [availableChildren, setAvailableChildren] = useState<AvailableChild[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getEventAttendance = async (scheduleId: number) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await client
        .from("event_attendance")
        .select(
          `
          id,
          child_id,
          schedule_id,
          check_in_time,
          check_out_time,
          status,
          released_by,
          child (
            id,
            name,
            age,
            intolerances_restrictions,
            image_authorization,
            guardian (
              name,
              phone
            )
          )
        `
        )
        .eq("schedule_id", scheduleId)
        .order("check_in_time");

      if (error) {
        throw error;
      }

      const formattedData = data.map((record: any) => ({
        id: record.id,
        childId: record.child_id,
        scheduleId: record.schedule_id,
        checkInTime: record.check_in_time,
        checkOutTime: record.check_out_time,
        status: record.status,
        releasedBy: record.released_by || undefined,
        child: {
          id: record.child.id,
          name: record.child.name,
          age: record.child.age,
          intolerances_restrictions:
            record.child.intolerances_restrictions || "",
          image_authorization: record.child.image_authorization || false,
          guardian: {
            name: record.child.guardian?.name || "N/A",
            phone: record.child.guardian?.phone || "",
          },
        },
      }));

      setAttendanceData(formattedData);
      return formattedData;
    } catch (err: any) {
      setError(err.message);
      console.error("Erro ao buscar presenças do evento:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getAvailableChildren = async (scheduleId: number) => {
    setLoading(true);
    setError(null);

    try {
      const { data: allChildren, error: childrenError } = await client
        .from("child")
        .select(
          `
          id,
          name,
          age,
          intolerances_restrictions,
          image_authorization,
          class_id,
          guardian (
            name,
            phone
          )
        `
        )
        .order("name");

      if (childrenError) {
        throw childrenError;
      }

      const { data: eventChildren, error: eventError } = await client
        .from("event_attendance")
        .select("child_id")
        .eq("schedule_id", scheduleId);

      if (eventError) {
        throw eventError;
      }

      const eventChildIds = eventChildren.map((ec: any) => ec.child_id);
      const available = allChildren
        .filter((child: any) => !eventChildIds.includes(child.id))
        .map((child: any) => ({
          id: child.id,
          name: child.name,
          age: child.age,
          intolerances_restrictions: child.intolerances_restrictions || "",
          image_authorization: child.image_authorization || false,
          guardian: child.guardian?.name || "N/A",
          phone: child.guardian?.phone || "",
          classId: child.class_id,
        }));

      setAvailableChildren(available);
      return available;
    } catch (err: any) {
      setError(err.message);
      console.error("Erro ao buscar crianças disponíveis:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (
    childId: number,
    scheduleId: number,
    status: "present" | "absent" | "checked_out"
  ) => {
    setLoading(true);
    setError(null);

    try {
      const { data: existingRecord } = await client
        .from("event_attendance")
        .select("id")
        .eq("child_id", childId)
        .eq("schedule_id", scheduleId)
        .single();

      if (existingRecord) {
        const updateData: any = { status };

        if (status === "present") {
          updateData.check_in_time = new Date().toISOString();
        } else if (status === "checked_out") {
          updateData.check_out_time = new Date().toISOString();
        }

        const { error } = await client
          .from("event_attendance")
          .update(updateData)
          .eq("id", existingRecord.id);

        if (error) {
          throw error;
        }
      } else {
        const insertData: any = {
          child_id: childId,
          schedule_id: scheduleId,
          status,
        };

        if (status === "present") {
          insertData.check_in_time = new Date().toISOString();
        }

        const { error } = await client
          .from("event_attendance")
          .insert(insertData);

        if (error) {
          throw error;
        }
      }

      await getEventAttendance(scheduleId);
      await getAvailableChildren(scheduleId);
    } catch (err: any) {
      setError(err.message);
      console.error("Erro ao marcar presença:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeAttendance = async (childId: number, scheduleId: number) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await client
        .from("event_attendance")
        .delete()
        .eq("child_id", childId)
        .eq("schedule_id", scheduleId);

      if (error) {
        throw error;
      }

      await getEventAttendance(scheduleId);
      await getAvailableChildren(scheduleId);
    } catch (err: any) {
      setError(err.message);
      console.error("Erro ao remover presença:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    attendanceData,
    availableChildren,
    loading,
    error,
    getEventAttendance,
    getAvailableChildren,
    markAttendance,
    removeAttendance,
  };
};

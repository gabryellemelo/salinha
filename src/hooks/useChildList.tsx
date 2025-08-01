import client from "../client";

export const useChildList = () => {
  const getChildren = async (classId: number) => {
    const { data, error } = await client
      .from("child")
      .select(`
        id,
        name,
        age,
        intolerances_restrictions,
        image_authorization,
        released_by,
        guardian (
          name,
          phone
        )
      `)
      .eq("class_id", classId);

    if (error) {
      console.error("Erro ao buscar crianças:", error.message);
      throw error;
    }

    return data.map((c: any) => ({
      id: c.id,
      name: c.name,
      age: c.age,
      intolerances_restrictions: c.intolerances_restrictions || "",
      image_authorization: c.image_authorization || false,
      guardian: c.guardian?.name || "N/A",
      phone: c.guardian?.phone || "",
      releasedBy: c.released_by || undefined,
    }));
  };

  const getAllChildren = async () => {
    const { data, error } = await client
      .from("child")
      .select(`
        id,
        name,
        age,
        intolerances_restrictions,
        image_authorization,
        released_by,
        class_id,
        guardian (
          name,
          phone
        )
      `)
      .order("name");

    if (error) {
      console.error("Erro ao buscar todas as crianças:", error.message);
      throw error;
    }

    return data.map((c: any) => ({
      id: c.id,
      name: c.name,
      age: c.age,
      intolerances_restrictions: c.intolerances_restrictions || "",
      image_authorization: c.image_authorization || false,
      guardian: c.guardian?.name || "N/A",
      phone: c.guardian?.phone || "",
      releasedBy: c.released_by || undefined,
      classId: c.class_id,
    }));
  };

  const getChildrenForEvent = async (scheduleId: number) => {
          const { data, error } = await client
        .from("event_attendance")
        .select(`
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
        `)
      .eq("schedule_id", scheduleId)
      .order("check_in_time");

    if (error) {
      console.error("Erro ao buscar crianças do evento:", error.message);
      throw error;
    }

    return data.map((attendance: any) => ({
      id: attendance.child.id,
      name: attendance.child.name,
      age: attendance.child.age,
      intolerances_restrictions: attendance.child.intolerances_restrictions || "",
      image_authorization: attendance.child.image_authorization || false,
      guardian: attendance.child.guardian?.name || "N/A",
      phone: attendance.child.guardian?.phone || "",
      attendanceId: attendance.id,
      checkInTime: attendance.check_in_time,
      checkOutTime: attendance.check_out_time,
      status: attendance.status,
      releasedBy: attendance.released_by || undefined,
    }));
  };

  const checkInChild = async (childId: number, scheduleId: number) => {
    const { data: existingAttendance } = await client
      .from("event_attendance")
      .select("id, status")
      .eq("child_id", childId)
      .eq("schedule_id", scheduleId)
      .single();

    if (existingAttendance) {
      const { error } = await client
        .from("event_attendance")
        .update({ 
          status: 'present',
          check_in_time: new Date().toISOString()
        })
        .eq("id", existingAttendance.id);

      if (error) {
        console.error("Erro ao atualizar check-in:", error.message);
        throw error;
      }
    } else {
      const { error } = await client
        .from("event_attendance")
        .insert({
          child_id: childId,
          schedule_id: scheduleId,
          status: 'present',
          check_in_time: new Date().toISOString()
        });

      if (error) {
        console.error("Erro ao fazer check-in:", error.message);
        throw error;
      }
    }
  };

  const checkOutChild = async (childId: number, scheduleId: number) => {
    const { error } = await client
      .from("event_attendance")
      .update({ 
        status: 'checked_out',
        check_out_time: new Date().toISOString()
      })
      .eq("child_id", childId)
      .eq("schedule_id", scheduleId);

    if (error) {
      console.error("Erro ao fazer check-out:", error.message);
      throw error;
    }
  };

  const releaseChild = async (id: number, releasedBy: string) => {
    const { error } = await client
      .from("child")
      .update({ released_by: releasedBy })
      .eq("id", id);

    if (error) {
      console.error("Erro ao liberar criança:", error.message);
      throw error;
    }
  };

  return { 
    getChildren, 
    getAllChildren, 
    getChildrenForEvent, 
    checkInChild, 
    checkOutChild, 
    releaseChild 
  };
};

import client from "../client";

export const useChildList = () => {
  const getChildren = async (classId: number) => {
    const { data, error } = await client
      .from("child")
      .select(
        `
          id,
          name,
          age,
          guardian_child (
            guardian (
              id,
              name,
              phone
            )
          )
        `
      )
      .eq("class_id", classId);

    if (error) {
      console.error("Erro ao buscar crianças e responsáveis:", error);
    } else {
      console.log("Crianças com responsáveis:", data);
      return data.map((child) => ({
        ...child,
        guardian_child: child.guardian_child.map((gc) => ({
          id: gc.guardian.id,
          name: gc.guardian.name,
          phone: gc.guardian.phone,
        })),
      }));
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

  return { getChildren, releaseChild };
};

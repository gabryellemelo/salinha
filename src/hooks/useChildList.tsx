import client from "../client";

export const useChildList = () => {
  const getChildren = async () => {
    const { data, error } = await client
      .from("child")
      .select(`
        id,
        name,
        age,
        released_by,
        guardian (
          name,
          phone
        )
      `);

    console.log("🔍 Supabase data:", data);

    if (error) {
      console.error("Erro ao buscar crianças:", error.message);
      throw error;
    }

    return data.map((c: any) => {
      console.log("👀 Mapping child:", c);

      return {
        id: c.id,
        name: c.name,
        age: c.age,
        guardian: c.guardian?.name || "N/A",
        phone: c.guardian?.phone || "",
        releasedBy: c.released_by || undefined,
      };
    });

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

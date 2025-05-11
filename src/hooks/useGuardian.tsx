import client from "../client";

export const useGuardian = () => {
  const getGuardians = async () => {
    const { data, error } = await client.from("guardian").select(`
    id,
    name,
    phone
  `);

    if (error) {
      console.error("Erro ao buscar responsáveis:", error);

      return [];
    } else {
      // Busca todos os childs
      const { data: children, error: errorChildren } = await client
        .from("child")
        .select("id, name, age, guardian_id");

      if (errorChildren) {
        console.error("Erro ao buscar crianças:", errorChildren);
        return;
      }

      // Junta no código
      const guardiansWithChildren = data.map((guardian) => ({
        ...guardian,
        children: children.filter((child) => child.guardian_id === guardian.id),
      }));

      return guardiansWithChildren;
      // return data;
    }
  };

  return { getGuardians };
};

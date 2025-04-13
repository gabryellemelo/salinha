import client from "../client";

type CreateStudentPayload = {
  name: string;
  age: string;
  responsible: string;
  telephone: string;
  class_id: number;
};

export const useStudent = () => {
  const createStudent = async (payload: CreateStudentPayload) => {
    const { name, age, responsible, telephone, class_id } = payload;

    const { data: guardianData, error: guardianError } = await client
      .from("guardian")
      .insert([{ name: responsible, phone: telephone }])
      .select("id")
      .single();

    if (guardianError || !guardianData?.id) {
      throw new Error("Erro ao criar responsável");
    }

    const guardian_id = guardianData.id;

    const { data: childData, error: childError } = await client
      .from("child")
      .insert([{ name, age: Number(age), guardian_id, class_id }])
      .select("*")
      .single();

    if (childError || !childData) {
      throw new Error("Erro ao criar criança");
    }

    return childData;
  };

  return { createStudent };
};

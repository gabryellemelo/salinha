import client from "../client";

type CreateStudentPayload = {
  name: string;
  age: string;
  responsible: string;
  telephone: string;
  intolerances_restrictions?: string;
  image_authorization: boolean;
  class_id: number;
};

export const useStudent = () => {
  const createStudent = async (payload: CreateStudentPayload) => {
    const { name, age, responsible, telephone, intolerances_restrictions, image_authorization, class_id } = payload;

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
      .insert([{ 
        name, 
        age: Number(age), 
        guardian_id, 
        class_id, 
        intolerances_restrictions,
        image_authorization 
      }])
      .select("*")
      .single();

    if (childError || !childData) {
      throw new Error("Erro ao criar criança");
    }

    return childData;
  };

  return { createStudent };
};

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "./styles";
import Ball from "../../assets/ball.png";
import Typography from "../ui/Typography";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { useStudent } from "../../hooks/useStudent";
import toast from "react-hot-toast";
import client from "../../client";
import { useAuth } from "../../hooks/useAuth";

interface IClassDetail {
  schedule: {
    id: string;
    datetime: string;
    class: {
      id: string;
      name: string;
      max_age: number;
      min_age: number;
    };
  };
}

export default function ClassDetail() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [classes, setClasses] = useState<IClassDetail[]>([]);

  useEffect(() => {
    const getDetails = async () => {
      const userId = auth.user?.id;

      if (!userId) {
        console.error("Usuário não encontrado");
        return;
      }

      setIsLoading(true);

      const { data, error } = await client
        .from("schedule_user")
        .select(
          `
            schedule: schedule_id (
              id,
              datetime,
              class: class_id (
                id,
                name,
                min_age,
                max_age
              )
            )
          `
        )
        .eq("user_id", userId);

      if (error) {
        console.error("Erro ao buscar escalas:", error);
        toast.error("Erro ao buscar escalas");
      } else {
        console.log(
          "Classes com horários do usuário:",
          JSON.stringify(data, null, 2)
        );
        setClasses(data);
      }

      setIsLoading(false);
    };

    getDetails();
  }, [auth.user?.id]);

  return (
    <S.Container>
      <S.CardContainer>
        <S.Icon src={Ball} alt="Bola colorida" />

        <Typography align="center" size="22px" weight="bold" margin="0 0 8px">
          Detalhe da Salinha
        </Typography>

        <div>
          {isLoading ? (
            <div>
              <Typography size="16px" weight="bold">
                Carregando...
              </Typography>
            </div>
          ) : (
            classes?.map((item) => (
              <div key={item.schedule.id}>
                <Typography size="16px" weight="bold">
                  {item.schedule.class.name}
                </Typography>
                <Typography size="14px">
                  {new Date(item.schedule.datetime).toLocaleString("pt-BR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </Typography>
              </div>
            ))
          )}
        </div>
      </S.CardContainer>
    </S.Container>
  );
}

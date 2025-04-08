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
        setClasses(data || []);
      }

      setIsLoading(false);
    };

    getDetails();
  }, [auth.user?.id]);

  return (
    <S.Container>
      <S.CardContainer>
        <S.Icon src={Ball} alt="Bola colorida" />

        <Typography align="center" size="22px" weight="bold" margin="0 0 16px">
          Sua Escala na Salinha
        </Typography>

        {isLoading ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <div className="spinner" />
            <Typography size="16px" color="#888">
              Carregando turmas...
            </Typography>
          </div>
        ) : classes.length === 0 ? (
          <Typography size="14px" color="#555" align="center">
            Nenhuma turma atribuída a você por enquanto.
          </Typography>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "20px" }}>
            {classes.map((item) => (
              <S.ScheduleCard
                key={item.schedule.id}
                style={{
                  background: "#F9F9F9",
                  padding: "16px",
                  borderRadius: "12px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                }}
              >
                <Typography size="16px" weight="bold" margin="0 0 8px">
                  Turma: {item.schedule.class.name}
                </Typography>

                <Typography size="14px" color="#444">
                  Faixa etária: {item.schedule.class.min_age} a {item.schedule.class.max_age} anos
                </Typography>

                <Typography size="14px" color="#666">
                  Data e hora:{" "}
                  {new Date(item.schedule.datetime).toLocaleString("pt-BR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </Typography>
              </S.ScheduleCard>
            ))}
          </div>
        )}

        <Button
          type="button"
          color="secondary"
          size="md"
          style={{ marginTop: "32px", width: "100%" }}
          onClick={() => navigate("/")}
        >
          Cadastro
        </Button>
      </S.CardContainer>
    </S.Container>
  );
}

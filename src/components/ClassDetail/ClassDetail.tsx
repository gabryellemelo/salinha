import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "./styles";
import Ball from "../../assets/ball.png";
import Typography from "../ui/Typography";
import Button from "../ui/Button";
import toast from "react-hot-toast";
import client from "../../client";
import { useAuth } from "../../hooks/useAuth";
import { useClassStore } from "../../store/useClassStore";

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
  const { setClassId } = useClassStore();
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
        .select(`
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
              `)
        .eq("user_id", userId);

      if (error) {
        console.error("Erro ao buscar escalas:", error);
        toast.error("Erro ao buscar escalas");
        setIsLoading(false);
        return;
      }

      const todaySchedules = (data || []).filter((item) => {
        const date = new Date(item.schedule.datetime);
        const today = new Date();
        return (
          date.getFullYear() === today.getFullYear() &&
          date.getMonth() === today.getMonth() &&
          date.getDate() === today.getDate()
        );
      });

      setClasses(todaySchedules);
      setIsLoading(false);
    };

    getDetails();
  }, [auth.user?.id]);


  return (
    <S.Container>
      <S.CardContainer>
        <S.Icon src={Ball} alt="Bola colorida" />

        <Typography align="center" size="22px" weight="bold" margin="0 0 16px">
          Sua Escala no Sara Kids
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
              <S.ScheduleCard key={item.schedule.id}>
                <Typography size="16px" weight="bold" margin="0 0 8px">
                  Turma: {item.schedule.class.name}
                </Typography>

                <Typography size="14px" color="#444">
                  Faixa etária: {item.schedule.class.min_age} a {item.schedule.class.max_age} anos
                </Typography>

                <Typography size="14px" color="#666" margin="0 0 12px">
                  Data e hora:{" "}
                  {new Date(item.schedule.datetime).toLocaleString("pt-BR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </Typography>

                <Button
                  type="button"
                  color="secondary"
                  size="md"
                  style={{ width: "100%", marginTop: 20 }}
                  onClick={() => {
                    setClassId(Number(item.schedule.class.id));
                    navigate("/");
                  }}
                >
                  Abrir salinha
                </Button>
              </S.ScheduleCard>
            ))}
          </div>
        )}
      </S.CardContainer>
    </S.Container>
  );
}

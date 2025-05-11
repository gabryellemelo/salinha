import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChildList } from "../../hooks/useChildList";
import * as S from "./styles";
import Typography from "../ui/Typography";
import Button from "../ui/Button";
import Modal from "../Modal/Modal";
import { useClassStore } from "../../store/useClassStore";
import { useAuth } from "../../hooks/useAuth";
import { useGuardian } from "../../hooks/useGuardian";
import { Student } from "../ListStudent/ListStudent";

export type Guardian = {
  id: number;
  name: string;
  phone: string;
};

type GuardianList = Guardian & {
  children: Student[];
};

export default function GuardianList() {
  const navigate = useNavigate();
  const [modalId, setModalId] = useState<number | null>(null);
  const [guardiansList, setGuardians] = useState<Guardian[]>([]);
  const { getGuardians } = useGuardian();
  const [loading, setLoading] = useState(true);
  const auth = useAuth();

  const fetchGuardians = async () => {
    try {
      setLoading(true);
      const data = await getGuardians();
      console.log("Guardians data:", data);
      setGuardians(data);
    } catch (error) {
      alert("Erro ao carregar lista de crianças.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuardians();
  }, []);

  const formatPhone = (phone: string) => {
    const digits = phone.replace(/\D/g, "");
    return digits.replace(/^(\d{2})(\d{5})(\d{4}).*/, "$1 $2-$3");
  };

  return (
    <S.Container>
      <S.Card>
        <S.Title>👧 Lista de Crianças</S.Title>

        {loading ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <div className="spinner" />
          </div>
        ) : guardiansList.length === 0 ? (
          <Typography color="#555" align="center">
            Nenhuma criança cadastrada ainda.
          </Typography>
        ) : (
          <S.ContainerList>
            {guardiansList.map((student) => (
              <S.ChildCard key={student.id}>
                <S.ChildName>{student.name}</S.ChildName>
                <S.ChildInfo>
                  Telefone: {formatPhone(student.phone)}
                </S.ChildInfo>

                {student?.children?.length > 0 && (
                  <S.ChildInfo>
                    Crianças:
                    {student.children.map((child) => (
                      <S.ChildInfo key={child.id}>
                        {child.name} ({child.age} anos)
                      </S.ChildInfo>
                    ))}
                  </S.ChildInfo>
                )}
              </S.ChildCard>
            ))}
          </S.ContainerList>
        )}

        <Button
          type="button"
          color="secondary"
          size="md"
          style={{ marginTop: "30px", padding: "12px", width: "100%" }}
          onClick={() => navigate("/cadastro")}
        >
          Voltar ao Cadastro
        </Button>
      </S.Card>
    </S.Container>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChildList } from "../../hooks/useChildList";
import * as S from "./styles";
import Typography from "../ui/Typography";
import Button from "../ui/Button";
import Modal from "../Modal/Modal";

type Student = {
  id: number;
  name: string;
  age: number;
  guardian: string;
  phone: string;
  releasedBy?: string;
};

export default function StudentList() {
  const navigate = useNavigate();
  const [modalId, setModalId] = useState<number | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const { getChildren, releaseChild } = useChildList();
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await getChildren();
      setStudents(data);
    } catch (error) {
      alert("Erro ao carregar lista de crianças.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleRelease = async (id: number, releasedBy: string) => {
    try {
      await releaseChild(id, releasedBy);
      await fetchStudents();
    } catch (error) {
      alert("Erro ao liberar criança.");
    }
  };

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
        ) : students.length === 0 ? (
          <Typography color="#555" align="center">
            Nenhuma criança cadastrada ainda.
          </Typography>
        ) : (
          <S.ContainerList>
            {students.map((student) => (
              <S.ChildCard key={student.id}>
                <S.ChildName>
                  {student.name} ({student.age} anos)
                </S.ChildName>
                <S.ChildInfo>Responsável: {student.guardian}</S.ChildInfo>
                <S.ChildInfo>Telefone: {formatPhone(student.phone)}</S.ChildInfo>

                {student.releasedBy ? (
                  <S.ReleasedBy>Retirado pelo responsável: {student.releasedBy}</S.ReleasedBy>
                ) : (
                  <S.ContainerButton>
                    <S.WhatsAppButton
                      href={`https://wa.me/55${student.phone.replace(/\D/g, "")}?text=olá%20${encodeURIComponent(
                        student.guardian
                      )}%2C%20por%20favor%20comparecer%20à%20salinha`}
                      target="_blank"
                    >
                      WhatsApp
                    </S.WhatsAppButton>
                    <Button
                      type="button"
                      color="primary"
                      size="sm"
                      style={{ flex: 1, padding: "10px" }}
                      onClick={() => setModalId(student.id)}
                    >
                      Liberar
                    </Button>
                  </S.ContainerButton>
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
          onClick={() => navigate("/")}
        >
          Voltar ao Cadastro
        </Button>

        {modalId !== null && (
          <Modal
            onConfirm={(name) => {
              handleRelease(modalId, name);
              setModalId(null);
            }}
            onClose={() => setModalId(null)}
          />
        )}
      </S.Card>
    </S.Container>
  );
}

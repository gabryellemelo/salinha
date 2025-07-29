import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChildList } from "../../hooks/useChildList";
import * as S from "./styles";
import Typography from "../ui/Typography";
import Button from "../ui/Button";
import Modal from "../Modal/Modal";
import { useAuth } from "../../hooks/useAuth";
import { useSessionStore } from "../../store/useSessionStore";

type Student = {
  id: number;
  name: string;
  age: number;
  intolerances_restrictions: string;
  image_authorization: boolean;
  guardian: string;
  phone: string;
  releasedBy?: string;
};

export default function StudentList() {
  const navigate = useNavigate();
  const { classId, scheduleDate } = useSessionStore();
  const [modalId, setModalId] = useState<number | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const { getChildren, releaseChild } = useChildList();
  const [loading, setLoading] = useState(true);
  const auth = useAuth();

  const isToday = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  const fetchStudents = async () => {
    if (!classId || !scheduleDate || !isToday(scheduleDate)) {
      setStudents([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getChildren(classId);
      setStudents(data);
    } catch (error) {
      alert("Erro ao carregar lista de crianças.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [classId, scheduleDate]);

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

  const printSticker = (student: Student) => {
    const printWindow = window.open('', '_blank', 'width=400,height=300');
    if (!printWindow) return;

    const stickerContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Adesivo - ${student.name}</title>
          <style>
            @media print {
              body { 
                margin: 0; 
                padding: 0; 
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
              }
              .sticker { 
                width: 50mm; 
                height: 30mm; 
                border: 1px solid #000;
                border-radius: 0;
                padding: 2mm;
                font-family: Arial, sans-serif;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                background: white;
                box-shadow: none;
                margin: 0;
              }
              .name { 
                font-size: 11px; 
                font-weight: bold; 
                margin-bottom: 1mm; 
                color: #000;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              }
              .age { 
                font-size: 8px; 
                color: #000;
                font-weight: normal;
                margin-bottom: 1mm;
              }
              .guardian { 
                font-weight: bold; 
                color: #000;
                font-size: 8px;
              }
              .phone { 
                color: #000;
                font-size: 7px;
              }
              .observation {
                color: #000;
                font-size: 6px;
                font-style: italic;
                line-height: 1.2;
                margin-top: 1mm;
                border-top: 1px solid #ccc;
                padding-top: 1mm;
              }
              .image-auth {
                color: #000;
                font-size: 6px;
                font-style: italic;
                line-height: 1.2;
                margin-top: 1mm;
                text-align: center;
              }
            }
          </style>
        </head>
        <body>
          <div class="sticker">
            <div class="name">${student.name}</div>
            <div class="age">${student.age} anos</div>
            <div class="guardian">${student.guardian}</div>
            <div class="phone">${formatPhone(student.phone)}</div>
            ${student.intolerances_restrictions ? `<div class="observation">${student.intolerances_restrictions}</div>` : ""}
            <div class="image-auth">
              ${student.image_authorization ? "✓ Autorizado" : "✗ Nao autorizado"}
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(stickerContent);
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <S.Container>
      <S.Card>
        <S.Title>👧 Lista de Crianças</S.Title>

        {loading ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <div className="spinner" />
          </div>
        ) : !scheduleDate || !isToday(scheduleDate) ? (
          <Typography color="#888" align="center">
            Nenhuma escala ativa para hoje.
          </Typography>
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
                {student.intolerances_restrictions && (
                  <S.ChildInfo>Intolerâncias: {student.intolerances_restrictions}</S.ChildInfo>
                )}
                <S.ChildInfo>
                  Imagens: {student.image_authorization ? "✅ Autorizado" : "❌ Não autorizado"}
                </S.ChildInfo>

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
                
                <S.ContainerButton style={{ marginTop: "8px" }}>
                  <Button
                    type="button"
                    color="secondary"
                    size="sm"
                    style={{ 
                      width: "100%", 
                      padding: "8px", 
                      fontSize: "12px",
                      backgroundColor: "#FFB6C1",
                      borderColor: "#FFB6C1",
                      color: "white"
                    }}
                    onClick={() => printSticker(student)}
                  >
                    🏷️ Imprimir Adesivo
                  </Button>
                </S.ContainerButton>
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
        <Button
          type="button"
          color="primary"
          size="md"
          style={{ width: "100%", marginTop: "12px" }}
          onClick={async () => {
            await auth.logout();
            window.location.href = "/";
          }}
        >
          Fechar salinha
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

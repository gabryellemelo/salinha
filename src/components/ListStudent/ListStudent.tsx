import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useChildList } from "../../hooks/useChildList";
import { useSessionStore } from "../../store/useSessionStore";
import { useAuth } from "../../hooks/useAuth";
import * as S from "./styles";
import Typography from "../ui/Typography";
import Button from "../ui/Button";
import Modal from "../Modal/Modal";
import toast from "react-hot-toast";
import html2canvas from "html2canvas";

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

  const formatPhone = (phone: string) => {
    const digits = phone.replace(/\D/g, "");
    return digits.replace(/^(\d{2})(\d{5})(\d{4}).*/, "$1 $2-$3");
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

  const downloadStickerImage = async (student: Student) => {
    try {
      // Criar elemento temporário para renderizar o adesivo
      const stickerHTML = `
        <div style="
          width: 50mm; 
          height: 30mm; 
          border: 1px solid #000;
          padding: 2mm;
          font-family: Arial, sans-serif;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: white;
          margin: 0;
          font-size: 12px;
        ">
          <div style="font-size: 11px; font-weight: bold; margin-bottom: 1mm; color: #000; text-transform: uppercase; letter-spacing: 0.5px;">
            ${student.name}
          </div>
          <div style="font-size: 8px; color: #000; font-weight: normal; margin-bottom: 1mm;">
            ${student.age} anos
          </div>
          <div style="font-weight: bold; color: #000; font-size: 8px;">
            ${student.guardian}
          </div>
          <div style="color: #000; font-size: 7px;">
            ${formatPhone(student.phone)}
          </div>
          ${student.intolerances_restrictions ? `<div style="color: #000; font-size: 6px; font-style: italic; line-height: 1.2; margin-top: 1mm; border-top: 1px solid #ccc; padding-top: 1mm;">${student.intolerances_restrictions}</div>` : ""}
          <div style="color: #000; font-size: 6px; font-style: italic; line-height: 1.2; margin-top: 1mm; text-align: center;">
            ${student.image_authorization ? "✓ Autorizado" : "✗ Nao autorizado"}
          </div>
        </div>
      `;

      // Criar elemento temporário
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = stickerHTML;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      document.body.appendChild(tempDiv);

      // Converter para imagem
      const canvas = await html2canvas(tempDiv.firstElementChild as HTMLElement, {
        width: 189, // 50mm em pixels (50 * 3.78)
        height: 113, // 30mm em pixels (30 * 3.78)
        scale: 2, // Melhor qualidade
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true
      });

      // Remover elemento temporário
      document.body.removeChild(tempDiv);

      // Criar link de download
      const link = document.createElement('a');
      link.download = `adesivo_${student.name.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      toast.success('Adesivo baixado! Envie para o app da Niimbot');
    } catch (error) {
      console.error('Erro ao gerar adesivo:', error);
      toast.error('Erro ao gerar adesivo');
    }
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
                      📱 Baixar Adesivo
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
                    onClick={() => downloadStickerImage(student)}
                  >
                    📱 Baixar Adesivo
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

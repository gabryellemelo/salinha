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
          width: 200px; 
          height: 120px; 
          border: 2px solid #4A90E2;
          border-radius: 8px;
          padding: 8px;
          font-family: Arial, sans-serif;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: linear-gradient(135deg, #E3F2FD 0%, #FFFFFF 100%);
          margin: 0;
          box-sizing: border-box;
          position: relative;
          overflow: hidden;
        ">
          <!-- Header com ícone -->
          <div style="
            display: flex;
            align-items: center;
            gap: 6px;
            margin-bottom: 4px;
            padding-bottom: 4px;
            border-bottom: 1px solid #4A90E2;
          ">
            <div style="
              width: 16px;
              height: 16px;
              background: #4A90E2;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 8px;
              font-weight: bold;
            ">🧒</div>
            <div style="
              font-size: 12px; 
              font-weight: bold; 
              color: #2C3E50; 
              text-transform: uppercase; 
              letter-spacing: 0.5px; 
              line-height: 1.2;
              flex: 1;
            ">${student.name}</div>
            <div style="
              background: #4A90E2;
              color: white;
              padding: 2px 6px;
              border-radius: 10px;
              font-size: 8px;
              font-weight: bold;
            ">${student.age} anos</div>
          </div>

          <!-- Informações principais -->
          <div style="flex: 1; display: flex; flex-direction: column; gap: 3px;">
            <div style="
              display: flex;
              align-items: center;
              gap: 4px;
              font-size: 9px;
              color: #34495E;
            ">
              <span style="color: #4A90E2; font-weight: bold;">👤</span>
              <span style="font-weight: bold;">${student.guardian}</span>
            </div>
            
            <div style="
              display: flex;
              align-items: center;
              gap: 4px;
              font-size: 8px;
              color: #34495E;
            ">
              <span style="color: #4A90E2; font-weight: bold;">📞</span>
              <span>${formatPhone(student.phone)}</span>
            </div>
          </div>

          <!-- Observações (se houver) -->
          ${student.intolerances_restrictions ? `
            <div style="
              background: #FFF3E0;
              border-left: 3px solid #FF9800;
              padding: 3px 6px;
              margin: 4px 0;
              border-radius: 0 4px 4px 0;
              font-size: 7px;
              color: #E65100;
              font-style: italic;
              line-height: 1.2;
              font-weight: bold;
            ">
              <span style="font-weight: bold;">⚠️</span> ${student.intolerances_restrictions}
            </div>
          ` : ""}

          <!-- Status de autorização -->
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
            padding: 3px;
            border-radius: 4px;
            font-size: 8px;
            font-weight: bold;
            ${student.image_authorization 
              ? 'background: #E8F5E8; color: #2E7D32; border: 1px solid #4CAF50;' 
              : 'background: #FFEBEE; color: #C62828; border: 1px solid #F44336;'
            }
          ">
            <span>${student.image_authorization ? '✅' : '❌'}</span>
            <span>${student.image_authorization ? 'AUTORIZADO' : 'NÃO AUTORIZADO'}</span>
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
        width: 200,
        height: 120,
        scale: 2, // Melhor qualidade
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true,
        logging: false
      });

      // Remover elemento temporário
      document.body.removeChild(tempDiv);

      // Converter canvas para blob
      canvas.toBlob(async (blob) => {
        if (blob) {
          // Criar arquivo
          const file = new File([blob], `adesivo_${student.name.replace(/\s+/g, '_')}.png`, {
            type: 'image/png'
          });

          // Verificar se o navegador suporta Web Share API
          if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
              await navigator.share({
                title: `Adesivo - ${student.name}`,
                text: `Adesivo da criança ${student.name} para impressão`,
                files: [file]
              });
              toast.success('Adesivo compartilhado! Salve na galeria');
            } catch (error) {
              console.error('Erro ao compartilhar:', error);
              // Fallback para download se compartilhamento falhar
              const link = document.createElement('a');
              link.download = `adesivo_${student.name.replace(/\s+/g, '_')}.png`;
              link.href = canvas.toDataURL('image/png');
              link.click();
              toast.success('Adesivo baixado! Salve na galeria');
            }
          } else {
            // Fallback para navegadores que não suportam Web Share API
            const link = document.createElement('a');
            link.download = `adesivo_${student.name.replace(/\s+/g, '_')}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            toast.success('Adesivo baixado! Salve na galeria');
          }
        }
      }, 'image/png');

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
                    onClick={() => downloadStickerImage(student)}
                  >
                    📱 Baixar etiqueta
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

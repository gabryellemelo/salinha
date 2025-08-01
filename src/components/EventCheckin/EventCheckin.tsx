import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSessionStore } from "../../store/useSessionStore";
import { useEventCheckin, AttendanceRecord } from "../../hooks/useEventCheckin";
import { useAuth } from "../../hooks/useAuth";
import client from "../../client";
import ChildSelector from "../ChildSelector/ChildSelector";
import Modal from "../Modal/Modal";
import * as S from "./styles";
import Typography from "../ui/Typography";
import Button from "../ui/Button";
import toast from "react-hot-toast";

export default function EventCheckin() {
  const navigate = useNavigate();
  const auth = useAuth();
  const { 
    classId, 
    scheduleId, 
    scheduleDate, 
    setCurrentEvent,
  } = useSessionStore();
  
  const { 
    attendanceData, 
    getEventAttendance, 
    markAttendance, 
    removeAttendance,
    loading 
  } = useEventCheckin();

  const [showChildSelector, setShowChildSelector] = useState(false);
  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const [childToRelease, setChildToRelease] = useState<number | null>(null);
  const [showChildDetailsModal, setShowChildDetailsModal] = useState(false);
  const [selectedChildForDetails, setSelectedChildForDetails] = useState<any>(null);
  const [showMenuDropdown, setShowMenuDropdown] = useState<number | null>(null);
  const [showStickerPreview, setShowStickerPreview] = useState(false);
  const [selectedChildForSticker, setSelectedChildForSticker] = useState<any>(null);

  useEffect(() => {
    if (scheduleId) {
      setCurrentEvent(scheduleId);
      loadEventData();
    }
  }, [scheduleId]);

  useEffect(() => {
    const handleFocus = () => {
      if (scheduleId) {
        loadEventData();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [scheduleId]);

  useEffect(() => {
    const handleClickOutside = () => {
      setShowMenuDropdown(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const loadEventData = async () => {
    if (!scheduleId) return;
    
    try {
      await getEventAttendance(scheduleId);
    } catch (error) {
      console.error("Erro ao carregar dados do evento:", error);
      toast.error("Erro ao carregar dados do evento");
    }
  };

  const handleCheckIn = async (childId: number) => {
    if (!scheduleId) return;
    
    try {
      await markAttendance(childId, scheduleId, 'present');
      toast.success("Check-in realizado com sucesso!");
      setShowChildSelector(false);
      await loadEventData();
    } catch (error) {
      console.error("Erro ao fazer check-in:", error);
      toast.error("Erro ao fazer check-in");
    }
  };

  const handleRelease = (childId: number) => {
    setChildToRelease(childId);
    setShowReleaseModal(true);
  };

  const handleReleaseConfirm = async (releasedBy: string) => {
    if (!scheduleId || !childToRelease) return;
    
    try {
      const { error } = await client
        .from("event_attendance")
        .update({ 
          status: 'checked_out',
          check_out_time: new Date().toISOString(),
          released_by: releasedBy
        })
        .eq("child_id", childToRelease)
        .eq("schedule_id", scheduleId);

      if (error) {
        throw error;
      }

      toast.success("Criança liberada com sucesso!");
      setShowReleaseModal(false);
      setChildToRelease(null);
      await loadEventData();
    } catch (error) {
      console.error("Erro ao liberar criança:", error);
      toast.error("Erro ao liberar criança");
    }
  };

//   const handleRemoveAttendance = async (childId: number) => {
//     if (!scheduleId) return;
    
//     try {
//       await removeAttendance(childId, scheduleId);
//       toast.success("Presença removida com sucesso!");
//       await loadEventData();
//     } catch (error) {
//       console.error("Erro ao remover presença:", error);
//       toast.error("Erro ao remover presença");
//     }
//   };

  const handleDownloadSticker = async (child: any) => {
    try {
      const stickerDiv = document.createElement('div');
      stickerDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 200px;
        height: 120px;
        padding: 8px;
        font-family: Arial, sans-serif;
        font-size: 10px;
        border: 2px solid #000;
        background: white;
        color: black;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        z-index: 9999;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      `;

      stickerDiv.innerHTML = `
        <div style="
          display: flex;
          flex-direction: column;
          height: 100%;
          justify-content: space-between;
          font-family: 'Arial', sans-serif;
          color: black;
        ">
          <!-- Header -->
          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #000;
            padding-bottom: 4px;
            margin-bottom: 6px;
          ">
            <div style="font-weight: bold; font-size: 14px;">${child.name}</div>
            <div style="font-size: 10px; background: #f0f0f0; padding: 2px 6px; border-radius: 3px;">${child.age} anos</div>
          </div>
          
          <!-- Content -->
          <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="font-size: 9px; margin-bottom: 3px;">
                <strong>Responsável:</strong> ${child.guardian.name}
              </div>
              <div style="font-size: 9px; margin-bottom: 3px;">
                <strong>Telefone:</strong> ${child.guardian.phone}
              </div>
              ${child.intolerances_restrictions ? `
                <div style="font-size: 9px; font-weight: bold; margin-bottom: 3px; border-left: 2px solid #000; padding-left: 4px;">
                  ⚠️ ${child.intolerances_restrictions}
                </div>
              ` : ''}
            </div>
            
            <!-- Footer -->
            <div style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-top: 1px solid #000;
              padding-top: 4px;
              margin-top: 6px;
            ">
              <div style="font-size: 8px;">
                <strong>Autorização de imagem:</strong> ${child.image_authorization ? 'SIM' : 'NÃO'}
              </div>
              <div style="font-size: 12px;">👶</div>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(stickerDiv);

      await new Promise(resolve => setTimeout(resolve, 200));

      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(stickerDiv, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: true
      });
      
      document.body.removeChild(stickerDiv);

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), 'image/png', 1.0);
      });

      if (navigator.share) {
        await navigator.share({
          files: [new File([blob], `etiqueta-${child.name}.png`, { type: 'image/png' })],
          title: 'Etiqueta da Criança',
        });
        toast.success("Adesivo salvo com sucesso!");
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `etiqueta-${child.name}.png`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("Adesivo salvo com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao gerar etiqueta:", error);
      toast.error("Erro ao gerar etiqueta");
    }
  };

  const handleShowChildDetails = (child: any) => {
    setSelectedChildForDetails(child);
    setShowChildDetailsModal(true);
    setShowMenuDropdown(null);
  };

  const handleShowStickerPreview = (child: any) => {
    setSelectedChildForSticker(child);
    setShowStickerPreview(true);
    setShowMenuDropdown(null);
  };

  const handleWhatsApp = (child: any) => {
    const phone = child.guardian.phone.replace(/\D/g, "");
    const message = `olá ${child.guardian.name}, por favor comparecer à salinha`;
    const whatsappUrl = `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setShowMenuDropdown(null);
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    const localDate = new Date(date.getTime() - (3 * 60 * 60 * 1000));
    return localDate.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Sao_Paulo'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return '✅';
      case 'checked_out':
        return '🚪';
      case 'absent':
        return '❌';
      default:
        return '❓';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'present':
        return 'Presente';
      case 'checked_out':
        return 'Liberado';
      default:
        return 'Desconhecido';
    }
  };

  if (!scheduleId || !classId) {
    return (
      <S.Container>
        <S.Card>
          <Typography style={{ textAlign: "center", marginBottom: "20px" }}>
            Nenhum evento selecionado
          </Typography>
          <Button
            type="button"
            color="primary"
            size="md"
            onClick={() => navigate("/")}
            style={{ width: "100%" }}
          >
            Voltar ao Início
          </Button>
        </S.Card>
      </S.Container>
    );
  }

  return (
    <S.Container>
      <S.Card>
        <S.Header>
          <Typography style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "8px" }}>
            Check-in
          </Typography>
          <Typography style={{ color: "#666", marginBottom: "20px" }}>
            {scheduleDate ? new Date(scheduleDate).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              timeZone: 'America/Sao_Paulo'
            }) : ''}
          </Typography>
        </S.Header>

        <S.Actions>
          <Button
            type="button"
            color="primary"
            size="md"
            onClick={() => setShowChildSelector(true)}
            style={{ width: "100%", marginBottom: "16px" }}
          >
            Listar Crianças
          </Button>
        </S.Actions>

        {showChildSelector && (
          <S.ChildSelectorContainer>
            <ChildSelector
              scheduleId={scheduleId}
              onCheckIn={handleCheckIn}
            />
            <Button
              type="button"
              color="secondary"
              size="sm"
              onClick={() => setShowChildSelector(false)}
              style={{ marginTop: "16px" }}
            >
              Fechar
            </Button>
          </S.ChildSelectorContainer>
        )}

        <S.AttendanceSection>
          <Typography style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>
            Lista de Presenças ({attendanceData.length})
          </Typography>

          {loading ? (
            <S.LoadingContainer>
              <Typography>Carregando presenças...</Typography>
            </S.LoadingContainer>
          ) : attendanceData.length === 0 ? (
            <S.EmptyState>
              <Typography style={{ textAlign: "center", color: "#666" }}>
                Nenhuma criança registrada ainda
              </Typography>
            </S.EmptyState>
          ) : (
            <S.AttendanceList>
              {attendanceData.map((record: AttendanceRecord) => (
                <S.AttendanceCard key={record.id}>
                  <S.ChildInfo>
                    <S.ChildName>{record.child.name}</S.ChildName>
                    <S.ChildDetails>
                      {record.child.age} anos • {record.child.guardian.name}
                    </S.ChildDetails>
                    {record.child.intolerances_restrictions && (
                      <S.ChildWarning>
                        ⚠️ {record.child.intolerances_restrictions}
                      </S.ChildWarning>
                    )}
                  </S.ChildInfo>

                  <S.StatusInfo>
                    <S.StatusBadge status={record.status}>
                      {getStatusIcon(record.status)} {getStatusText(record.status)}
                    </S.StatusBadge>
                    <S.TimeInfo>
                      <div>Entrada: {formatTime(record.checkInTime)}</div>
                      {record.checkOutTime && (
                        <div>Saída: {formatTime(record.checkOutTime)}</div>
                      )}
                    </S.TimeInfo>
                  </S.StatusInfo>

                  <S.CardActions>
                    <S.MenuContainer>
                      <S.MenuButton
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          setShowMenuDropdown(showMenuDropdown === record.id ? null : record.id);
                        }}
                      >
                        ⋯
                      </S.MenuButton>
                      
                      {showMenuDropdown === record.id && (
                        <S.MenuDropdown>
                          {record.status === 'present' && (
                            <S.MenuItem onClick={() => handleRelease(record.childId)}>
                              🚪 Liberar
                            </S.MenuItem>
                          )}
                          <S.MenuItem onClick={() => handleShowStickerPreview(record.child)}>
                            🏷️ Etiqueta
                          </S.MenuItem>
                          <S.MenuItem onClick={() => handleWhatsApp(record.child)}>
                            💬 WhatsApp
                          </S.MenuItem>
                          <S.MenuItem onClick={() => handleShowChildDetails(record.child)}>
                            👁️ Ver Detalhes
                          </S.MenuItem>
                        </S.MenuDropdown>
                      )}
                    </S.MenuContainer>
                  </S.CardActions>
                </S.AttendanceCard>
              ))}
            </S.AttendanceList>
          )}
        </S.AttendanceSection>

        <S.Footer>
          <Button
            type="button"
            color="secondary"
            size="md"
            onClick={() => navigate("/lista-presencas")}
            style={{ marginBottom: "12px" }}
          >
            Ver Lista Completa
          </Button>
          <Button
            type="button"
            color="primary"
            size="md"
            onClick={async () => {
              await auth.logout();
              window.location.href = "/";
            }}
            style={{ width: "100%" }}
          >
            Fechar Salinha
          </Button>
        </S.Footer>
      </S.Card>

      {showReleaseModal && (
        <Modal
          onConfirm={handleReleaseConfirm}
          onClose={() => {
            setShowReleaseModal(false);
            setChildToRelease(null);
          }}
        />
      )}

      {showChildDetailsModal && selectedChildForDetails && (
        <S.DetailsModal>
          <S.DetailsModalContent>
            <S.DetailsModalHeader>
              <Typography style={{ fontSize: "20px", fontWeight: "bold" }}>
                Detalhes da Criança
              </Typography>
              <S.CloseButton onClick={() => setShowChildDetailsModal(false)}>
                ✕
              </S.CloseButton>
            </S.DetailsModalHeader>
            
            <S.DetailsContent>
              <S.DetailRow>
                <S.DetailLabel>Nome:</S.DetailLabel>
                <S.DetailValue>{selectedChildForDetails.name}</S.DetailValue>
              </S.DetailRow>
              
              <S.DetailRow>
                <S.DetailLabel>Idade:</S.DetailLabel>
                <S.DetailValue>{selectedChildForDetails.age} anos</S.DetailValue>
              </S.DetailRow>
              
              <S.DetailRow>
                <S.DetailLabel>Responsável:</S.DetailLabel>
                <S.DetailValue>{selectedChildForDetails.guardian.name}</S.DetailValue>
              </S.DetailRow>
              
              <S.DetailRow>
                <S.DetailLabel>Telefone:</S.DetailLabel>
                <S.DetailValue>{selectedChildForDetails.guardian.phone}</S.DetailValue>
              </S.DetailRow>
              
              <S.DetailRow>
                <S.DetailLabel>Autorização de Imagem:</S.DetailLabel>
                <S.DetailValue>
                  {selectedChildForDetails.image_authorization ? (
                    <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>✅ Sim</span>
                  ) : (
                    <span style={{ color: '#F44336', fontWeight: 'bold' }}>❌ Não</span>
                  )}
                </S.DetailValue>
              </S.DetailRow>
              
              {selectedChildForDetails.intolerances_restrictions && (
                <S.DetailRow>
                  <S.DetailLabel>Intolerâncias/Restrições:</S.DetailLabel>
                  <S.DetailValue style={{ color: '#E65100', fontWeight: 'bold' }}>
                    ⚠️ {selectedChildForDetails.intolerances_restrictions}
                  </S.DetailValue>
                </S.DetailRow>
              )}
            </S.DetailsContent>
          </S.DetailsModalContent>
        </S.DetailsModal>
      )}

      {showStickerPreview && selectedChildForSticker && (
        <S.StickerPreviewModal>
          <S.StickerPreviewContent>
            <S.StickerPreviewHeader>
              <Typography style={{ fontSize: "20px", fontWeight: "bold" }}>
                Pré-visualização da Etiqueta
              </Typography>
              <S.CloseButton onClick={() => setShowStickerPreview(false)}>
                ✕
              </S.CloseButton>
            </S.StickerPreviewHeader>
            
            <S.StickerPreviewContainer>
              <S.StickerPreview>
                <S.StickerHeader>
                  <S.StickerName>{selectedChildForSticker.name}</S.StickerName>
                  <S.StickerAge>{selectedChildForSticker.age} anos</S.StickerAge>
                </S.StickerHeader>
                
                <S.StickerContent>
                  <S.StickerInfo>
                    <strong>Responsável:</strong> {selectedChildForSticker.guardian.name}
                  </S.StickerInfo>
                  <S.StickerInfo>
                    <strong>Telefone:</strong> {selectedChildForSticker.guardian.phone}
                  </S.StickerInfo>
                  {selectedChildForSticker.intolerances_restrictions && (
                    <S.StickerWarning>
                      ⚠️ {selectedChildForSticker.intolerances_restrictions}
                    </S.StickerWarning>
                  )}
                </S.StickerContent>
                
                <S.StickerFooter>
                  <S.StickerAuth>
                    <strong>Autorização de imagem:</strong> {selectedChildForSticker.image_authorization ? 'SIM' : 'NÃO'}
                  </S.StickerAuth>
                </S.StickerFooter>
              </S.StickerPreview>
            </S.StickerPreviewContainer>

            <S.StickerPreviewActions>
              <Button
                type="button"
                color="secondary"
                size="md"
                onClick={() => setShowStickerPreview(false)}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                color="primary"
                size="md"
                onClick={() => {
                  handleDownloadSticker(selectedChildForSticker);
                  setShowStickerPreview(false);
                }}
              >
                Baixar Etiqueta
              </Button>
            </S.StickerPreviewActions>
          </S.StickerPreviewContent>
        </S.StickerPreviewModal>
      )}
    </S.Container>
  );
} 
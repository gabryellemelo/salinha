import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useScheduleManagement } from "../../../hooks/useScheduleManagement";
import * as S from "./styles";
import Typography from "../../ui/Typography";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import toast from "react-hot-toast";
import CustomClassSelect from "./CustomClassSelect";

interface Schedule {
  id: number;
  datetime: string;
  class_id: number;
  class_name?: string;
}

export default function ScheduleManagement() {
  const navigate = useNavigate();
  const { 
    schedules, 
    classes, 
    users, 
    loading, 
    error, 
    createSchedule, 
    updateSchedule, 
    deleteSchedule,
    getScheduleUsers 
  } = useScheduleManagement();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [scheduleUsers, setScheduleUsers] = useState<any[]>([]);
  const [showPastSchedules, setShowPastSchedules] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    datetime: "",
    class_id: "",
    user_ids: [] as string[]
  });

  const handleCreateSchedule = async () => {
    try {
      if (!formData.name || !formData.datetime || !formData.class_id) {
        toast.error("Nome, data/hora e turma são obrigatórios");
        return;
      }

      await createSchedule({
        name: formData.name,
        datetime: formData.datetime,
        class_id: parseInt(formData.class_id),
        user_ids: formData.user_ids
      });

      setShowCreateModal(false);
      setFormData({ name: "", datetime: "", class_id: "", user_ids: [] });
    } catch (error) {
      console.error("Erro ao criar escala:", error);
    }
  };

  const handleEditSchedule = async () => {
    try {
      if (!selectedSchedule) return;

      await updateSchedule(selectedSchedule.id, {
        name: formData.name || undefined,
        datetime: formData.datetime || undefined,
        class_id: formData.class_id ? parseInt(formData.class_id) : undefined,
        user_ids: formData.user_ids
      });

      setShowEditModal(false);
      setSelectedSchedule(null);
      setFormData({ name: "", datetime: "", class_id: "", user_ids: [] });
    } catch (error) {
      console.error("Erro ao editar escala:", error);
    }
  };

  const handleDeleteSchedule = async (scheduleId: number) => {
    if (!confirm("Tem certeza que deseja remover esta escala?")) {
      return;
    }

    try {
      await deleteSchedule(scheduleId);
    } catch (error) {
      console.error("Erro ao remover escala:", error);
    }
  };

  const handleUserSelection = (userId: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        user_ids: [...prev.user_ids, userId]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        user_ids: prev.user_ids.filter(id => id !== userId)
      }));
    }
  };

  const loadScheduleUsers = async (scheduleId: number) => {
    try {
      const users = await getScheduleUsers(scheduleId);
      setScheduleUsers(users);
    } catch (error) {
      console.error('Erro ao carregar professores:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.menu-dropdown')) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredSchedules = schedules.filter(schedule => {
    // Filtro de busca
    const matchesSearch =
      schedule.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.class_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.datetime.includes(searchTerm);
    
    // Filtro de data (hoje para frente)
    const scheduleDate = new Date(schedule.datetime);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset para início do dia
    
    const isFutureOrToday = showPastSchedules || scheduleDate >= today;
    
    return matchesSearch && isFutureOrToday;
  });

  if (error) {
    return (
      <S.Container>
        <S.Card>
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Typography color="red">Erro: {error}</Typography>
            <Button 
              onClick={() => window.location.reload()} 
              style={{ marginTop: "20px" }}
            >
              Tentar Novamente
            </Button>
          </div>
        </S.Card>
      </S.Container>
    );
  }

  return (
    <S.Container>
      <S.Card>
        <S.Header>
          <Typography style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "8px" }}>
            Gerenciar Escalas
          </Typography>
          <Typography style={{ color: "#666", marginBottom: "20px" }}>
            Crie, edite e gerencie escalas de culto
          </Typography>
        </S.Header>

        <S.ControlsContainer>
          <S.SearchContainer>
            <Input
              type="text"
              placeholder="Buscar por nome da escala, turma ou data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </S.SearchContainer>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <S.FilterToggle>
              <input
                type="checkbox"
                id="show-past"
                checked={showPastSchedules}
                onChange={(e) => setShowPastSchedules(e.target.checked)}
              />
              <label htmlFor="show-past">
                Mostrar escalas passadas
              </label>
            </S.FilterToggle>
            
            <Button
              type="button"
              color="primary"
              size="md"
              onClick={() => setShowCreateModal(true)}
              style={{ minWidth: "140px" }}
            >
              + Criar Escala
            </Button>
          </div>
        </S.ControlsContainer>

        {!loading && (
          <div style={{ 
            marginBottom: "16px", 
            textAlign: "center",
            color: "#666",
            fontSize: "14px"
          }}>
            <Typography>
              {filteredSchedules.length} escala{filteredSchedules.length !== 1 ? 's' : ''} encontrada{filteredSchedules.length !== 1 ? 's' : ''}
              {!showPastSchedules && ' (apenas futuras)'}
            </Typography>
          </div>
        )}

        {loading ? (
          <S.LoadingContainer>
            <Typography>Carregando escalas...</Typography>
          </S.LoadingContainer>
        ) : (
          <S.SchedulesContainer>
            {filteredSchedules.map((schedule) => (
              <S.ScheduleCard key={schedule.id}>
                <div style={{ position: 'relative' }}>
                  <S.ScheduleHeader>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                      <S.ScheduleTitle>
                        {schedule.name || schedule.class_name}
                      </S.ScheduleTitle>
                      
                      <S.MenuButton
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === schedule.id ? null : schedule.id);
                        }}
                      >
                        ⋯
                      </S.MenuButton>
                    </div>
                    
                    {openMenuId === schedule.id && (
                      <S.MenuDropdown className="menu-dropdown">
                        <S.MenuItem onClick={async () => {
                          setSelectedSchedule(schedule);
                          try {
                            const users = await getScheduleUsers(schedule.id);
                            const userIds = users.map(user => user.user_id);
                            setFormData({
                              name: schedule.name || "",
                              datetime: schedule.datetime,
                              class_id: schedule.class_id.toString(),
                              user_ids: userIds
                            });
                          } catch (error) {
                            console.error('Erro ao carregar professores:', error);
                            setFormData({
                              name: schedule.name || "",
                              datetime: schedule.datetime,
                              class_id: schedule.class_id.toString(),
                              user_ids: []
                            });
                          }
                          setShowEditModal(true);
                          setOpenMenuId(null);
                        }}>
                          ✏️ Editar
                        </S.MenuItem>
                        <S.MenuItem onClick={() => { handleDeleteSchedule(schedule.id); setOpenMenuId(null); }}>
                          🗑️ Excluir
                        </S.MenuItem>
                      </S.MenuDropdown>
                    )}
                  </S.ScheduleHeader>
                  
                  <S.ScheduleSubtitle>
                    {schedule.name && schedule.class_name}
                  </S.ScheduleSubtitle>
                  
                  <S.ScheduleDateTime>
                    {formatDateTime(schedule.datetime)}
                  </S.ScheduleDateTime>
                  
                  <S.ScheduleActions>
                    <S.ActionButton
                      onClick={() => loadScheduleUsers(schedule.id)}
                      style={{ color: '#87CEEB' }}
                    >
                      👥 Ver Professores
                    </S.ActionButton>
                  </S.ScheduleActions>
                </div>
              </S.ScheduleCard>
            ))}
          </S.SchedulesContainer>
        )}

        <S.Footer>
          <Button
            type="button"
            color="secondary"
            size="md"
            onClick={() => navigate("/admin-panel")}
            style={{ width: "100%" }}
          >
            Voltar ao Painel
          </Button>
        </S.Footer>
      </S.Card>

      {/* Modal de Criação */}
      {showCreateModal && (
        <S.Modal>
          <S.ModalContent>
            <S.ModalHeader>
              <Typography style={{ fontSize: "20px", fontWeight: "bold" }}>
                Criar Nova Escala
              </Typography>
              <S.CloseButton onClick={() => setShowCreateModal(false)}>
                ✕
              </S.CloseButton>
            </S.ModalHeader>
            
            <S.ModalBody>
              <S.FormGroup>
                <S.Label>Nome da Escala</S.Label>
                <Input
                  type="text"
                  placeholder="Ex: Escala de domingo manhã..."
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </S.FormGroup>
              
              <S.FormGroup>
                <S.Label>Data e Hora</S.Label>
                <Input
                  type="datetime-local"
                  value={formData.datetime}
                  onChange={(e) => setFormData(prev => ({ ...prev, datetime: e.target.value }))}
                />
              </S.FormGroup>
              
              <S.FormGroup>
                <S.Label>Turma</S.Label>
                <CustomClassSelect
                  value={formData.class_id}
                  onChange={(value) => setFormData(prev => ({ ...prev, class_id: value }))}
                  classes={classes}
                />
              </S.FormGroup>
              
              <S.FormGroup>
                <S.Label>Professores</S.Label>
                <S.CheckboxContainer>
                  {users.map((user) => (
                    <S.CheckboxItem key={user.id}>
                      <input
                        type="checkbox"
                        id={`user-${user.id}`}
                        checked={formData.user_ids.includes(user.id)}
                        onChange={(e) => handleUserSelection(user.id, e.target.checked)}
                      />
                      <label htmlFor={`user-${user.id}`}>
                        {user.display_name || user.email}
                      </label>
                    </S.CheckboxItem>
                  ))}
                </S.CheckboxContainer>
              </S.FormGroup>
            </S.ModalBody>
            
            <S.ModalFooter>
              <Button
                type="button"
                color="secondary"
                size="md"
                onClick={() => setShowCreateModal(false)}
                style={{ flex: 1, minWidth: "120px" }}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                color="primary"
                size="md"
                onClick={handleCreateSchedule}
                style={{ flex: 1, minWidth: "120px" }}
              >
                Criar Escala
              </Button>
            </S.ModalFooter>
          </S.ModalContent>
        </S.Modal>
      )}

      {/* Modal de Edição */}
      {showEditModal && selectedSchedule && (
        <S.Modal>
          <S.ModalContent>
            <S.ModalHeader>
              <Typography style={{ fontSize: "20px", fontWeight: "bold" }}>
                Editar Escala
              </Typography>
              <S.CloseButton onClick={() => setShowEditModal(false)}>
                ✕
              </S.CloseButton>
            </S.ModalHeader>
            
            <S.ModalBody>
              <S.FormGroup>
                <S.Label>Nome da Escala</S.Label>
                <Input
                  type="text"
                  placeholder="Ex: Escala de domingo manhã..."
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </S.FormGroup>
              
              <S.FormGroup>
                <S.Label>Data e Hora</S.Label>
                <Input
                  type="datetime-local"
                  value={formData.datetime}
                  onChange={(e) => setFormData(prev => ({ ...prev, datetime: e.target.value }))}
                />
              </S.FormGroup>
              
              <S.FormGroup>
                <S.Label>Turma</S.Label>
                <CustomClassSelect
                  value={formData.class_id}
                  onChange={(value) => setFormData(prev => ({ ...prev, class_id: value }))}
                  classes={classes}
                />
              </S.FormGroup>
              
              <S.FormGroup>
                <S.Label>Professores</S.Label>
                <S.CheckboxContainer>
                  {users.map((user) => (
                    <S.CheckboxItem key={user.id}>
                      <input
                        type="checkbox"
                        id={`edit-user-${user.id}`}
                        checked={formData.user_ids.includes(user.id)}
                        onChange={(e) => handleUserSelection(user.id, e.target.checked)}
                      />
                      <label htmlFor={`edit-user-${user.id}`}>
                        {user.display_name || user.email}
                      </label>
                    </S.CheckboxItem>
                  ))}
                </S.CheckboxContainer>
              </S.FormGroup>
            </S.ModalBody>
            
            <S.ModalFooter>
              <Button
                type="button"
                color="secondary"
                size="md"
                onClick={() => setShowEditModal(false)}
                style={{ flex: 1, minWidth: "120px" }}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                color="primary"
                size="md"
                onClick={handleEditSchedule}
                style={{ flex: 1, minWidth: "120px" }}
              >
                Salvar Alterações
              </Button>
            </S.ModalFooter>
          </S.ModalContent>
        </S.Modal>
      )}

      {/* Modal de Ver Professores (Tios e Admins) */}
      {scheduleUsers.length > 0 && (
        <S.Modal onClick={() => setScheduleUsers([])}>
          <S.ModalContent onClick={(e) => e.stopPropagation()}>
            <S.ModalHeader>
              <Typography style={{ fontSize: "20px", fontWeight: "bold" }}>
                Professores da Escala
              </Typography>
              <S.CloseButton onClick={() => setScheduleUsers([])}>
                ✕
              </S.CloseButton>
            </S.ModalHeader>
            
            <S.ModalBody>
              {scheduleUsers.map((user) => (
                <div key={user.user_id} style={{ 
                  padding: "12px", 
                  borderBottom: "1px solid #f0f0f0",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px"
                }}>
                  <div style={{ 
                    width: "40px", 
                    height: "40px", 
                    borderRadius: "50%", 
                    backgroundColor: "#FF69B4",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "bold"
                  }}>
                    {(user.user_name || user.user_email || "U").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: "600", color: "#333" }}>
                      {user.user_name || "Nome não disponível"}
                    </div>
                    <div style={{ fontSize: "14px", color: "#666" }}>
                      {user.user_email || "Email não disponível"}
                    </div>
                  </div>
                </div>
              ))}
            </S.ModalBody>
            
            <S.ModalFooter>
              <Button
                type="button"
                color="secondary"
                size="md"
                onClick={() => setScheduleUsers([])}
                style={{ width: "100%" }}
              >
                Fechar
              </Button>
            </S.ModalFooter>
          </S.ModalContent>
        </S.Modal>
      )}
    </S.Container>
  );
} 
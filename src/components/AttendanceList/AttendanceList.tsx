import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSessionStore } from "../../store/useSessionStore";
import { useEventCheckin, AttendanceRecord } from "../../hooks/useEventCheckin";
import { useAuth } from "../../hooks/useAuth";
import * as S from "./styles";
import Typography from "../ui/Typography";
import Button from "../ui/Button";
import Input from "../ui/Input";
import toast from "react-hot-toast";

export default function AttendanceList() {
  const navigate = useNavigate();
  const auth = useAuth();
  const { scheduleId, scheduleDate } = useSessionStore();
  const { attendanceData, getEventAttendance, loading } = useEventCheckin();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    if (scheduleId) {
      loadAttendanceData();
    }
  }, [scheduleId]);

  const loadAttendanceData = async () => {
    if (!scheduleId) return;
    
    try {
      await getEventAttendance(scheduleId);
    } catch (error) {
      console.error("Erro ao carregar lista de presenças:", error);
      toast.error("Erro ao carregar lista de presenças");
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
  };

  const filteredData = attendanceData.filter(record => {
    const matchesSearch = 
      record.child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.child.guardian.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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

  const getStatusCount = (status: string) => {
    return attendanceData.filter(record => record.status === status).length;
  };

  if (!scheduleId) {
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
            Lista de Presenças
          </Typography>
          <Typography style={{ color: "#666", marginBottom: "20px", fontSize: "16px" }}>
            Evento: {scheduleDate ? new Date(scheduleDate).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              timeZone: 'America/Sao_Paulo'
            }) : ''}
          </Typography>
        </S.Header>

        <S.StatsContainer>
          <S.StatCard>
            <S.StatNumber>{getStatusCount('present')}</S.StatNumber>
            <S.StatLabel>Presentes</S.StatLabel>
          </S.StatCard>
          <S.StatCard>
            <S.StatNumber>{getStatusCount('checked_out')}</S.StatNumber>
            <S.StatLabel>Liberados</S.StatLabel>
          </S.StatCard>
        </S.StatsContainer>

        <S.FiltersContainer>
          <S.SearchContainer>
            <Input
              type="text"
              placeholder="Buscar por nome ou responsável..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </S.SearchContainer>
          
          <S.StatusFilters>
            <S.FilterButton
              active={statusFilter === "all"}
              onClick={() => handleStatusFilter("all")}
            >
              Todos ({attendanceData.length})
            </S.FilterButton>
            <S.FilterButton
              active={statusFilter === "present"}
              onClick={() => handleStatusFilter("present")}
            >
              Presentes ({getStatusCount('present')})
            </S.FilterButton>
            <S.FilterButton
              active={statusFilter === "checked_out"}
              onClick={() => handleStatusFilter("checked_out")}
            >
              Liberados ({getStatusCount('checked_out')})
            </S.FilterButton>
          </S.StatusFilters>
        </S.FiltersContainer>

        {loading ? (
          <S.LoadingContainer>
            <Typography>Carregando lista de presenças...</Typography>
          </S.LoadingContainer>
        ) : filteredData.length === 0 ? (
          <S.EmptyState>
            <Typography style={{ textAlign: "center", color: "#666" }}>
              {searchTerm || statusFilter !== "all"
                ? "Nenhum resultado encontrado com os filtros aplicados"
                : "Nenhuma presença registrada ainda"
              }
            </Typography>
          </S.EmptyState>
        ) : (
          <S.AttendanceList>
            {filteredData.map((record: AttendanceRecord) => (
              <S.AttendanceCard key={record.id}>
                <S.ChildInfo>
                  <S.ChildName>{record.child.name}</S.ChildName>
                  <S.ChildDetails>
                    {record.child.age} anos • {record.child.guardian.name}
                  </S.ChildDetails>
                </S.ChildInfo>

                <S.StatusInfo>
                  <S.StatusBadge status={record.status}>
                    {getStatusIcon(record.status)} {getStatusText(record.status)}
                  </S.StatusBadge>
                </S.StatusInfo>
              </S.AttendanceCard>
            ))}
          </S.AttendanceList>
        )}

        <S.Footer>
          <Button
            type="button"
            color="secondary"
            size="md"
            onClick={() => navigate("/checkin")}
            style={{ marginBottom: "12px" }}
          >
            Voltar ao Check-in
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
    </S.Container>
  );
} 
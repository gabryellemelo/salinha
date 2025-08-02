import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useAdminStats } from "../../hooks/useAdminStats";
import * as S from "./styles";
import Typography from "../ui/Typography";
import Button from "../ui/Button";
import toast from "react-hot-toast";

export default function AdminPanel() {
  const navigate = useNavigate();
  const auth = useAuth();
  const { totalUsers, activeUsers, totalAdmins, totalSchedules, upcomingSchedules, totalClasses, totalChildren, loading, error } = useAdminStats();

  const handleLogout = async () => {
    try {
      await auth.logout();
      toast.success("Logout realizado com sucesso!");
      navigate("/admin-login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast.error("Erro ao fazer logout");
    }
  };

  if (loading) {
    return (
      <S.Container>
        <S.Card>
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Typography>Carregando estatísticas...</Typography>
          </div>
        </S.Card>
      </S.Container>
    );
  }

  if (error) {
    return (
      <S.Container>
        <S.Card>
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Typography color="red">Erro ao carregar estatísticas: {error}</Typography>
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
          <S.Icon>⛪</S.Icon>
          <Typography style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "8px", textAlign: "center" }}>
            Painel do Administrador
          </Typography>
          <Typography style={{ color: "#666", marginBottom: "20px", textAlign: "center" }}>
            Gerencie usuários e escalas do sistema
          </Typography>
        </S.Header>

        <S.StatsContainer>
          <S.StatCard>
            <S.StatNumber>{activeUsers}</S.StatNumber>
            <S.StatLabel>Professores Ativos</S.StatLabel>
          </S.StatCard>
          <S.StatCard>
            <S.StatNumber>{upcomingSchedules}</S.StatNumber>
            <S.StatLabel>Próximas Escalas</S.StatLabel>
          </S.StatCard>
        </S.StatsContainer>

        <S.ActionsContainer>
          <S.ActionCard onClick={() => navigate("/admin/users")}>
            <S.ActionIcon>👥</S.ActionIcon>
            <S.ActionTitle>Gerenciar Usuários</S.ActionTitle>
            <S.ActionDescription>
              Criar, editar e remover usuários do sistema
            </S.ActionDescription>
          </S.ActionCard>

          <S.ActionCard onClick={() => navigate("/admin/schedules")}>
            <S.ActionIcon>📅</S.ActionIcon>
            <S.ActionTitle>Gerenciar Escalas</S.ActionTitle>
            <S.ActionDescription>
              Criar e gerenciar escalas do culto
            </S.ActionDescription>
          </S.ActionCard>
        </S.ActionsContainer>

        <S.Footer>
          <Button
            type="button"
            color="secondary"
            size="md"
            onClick={() => navigate("/")}
            style={{ marginBottom: "12px" }}
          >
            Voltar ao Sistema Principal
          </Button>
          <Button
            type="button"
            color="primary"
            size="md"
            onClick={handleLogout}
            style={{ width: "100%" }}
          >
            Sair do Painel
          </Button>
        </S.Footer>
      </S.Card>
    </S.Container>
  );
} 
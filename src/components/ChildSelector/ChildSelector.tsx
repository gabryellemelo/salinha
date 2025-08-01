import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEventCheckin, AvailableChild } from "../../hooks/useEventCheckin";
import * as S from "./styles";
import Typography from "../ui/Typography";
import Button from "../ui/Button";
import Input from "../ui/Input";
import toast from "react-hot-toast";

interface ChildSelectorProps {
  scheduleId: number;
  onChildSelected?: (child: AvailableChild) => void;
  onCheckIn?: (childId: number) => void;
}

export default function ChildSelector({ 
  scheduleId, 
  onCheckIn 
}: ChildSelectorProps) {
  const navigate = useNavigate();
  const { availableChildren, getAvailableChildren, markAttendance, loading } = useEventCheckin();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChildIds, setSelectedChildIds] = useState<number[]>([]);

  useEffect(() => {
    loadAvailableChildren();
  }, [scheduleId]);

  const loadAvailableChildren = async () => {
    try {
      await getAvailableChildren(scheduleId);
    } catch (error) {
      console.error("Erro ao carregar crianças disponíveis:", error);
      toast.error("Erro ao carregar crianças disponíveis");
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const filteredChildren = availableChildren.filter(child =>
    child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    child.guardian.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChildSelect = (childId: number) => {
    setSelectedChildIds(prev => {
      if (prev.includes(childId)) {
        return prev.filter(id => id !== childId);
      } else {
        return [...prev, childId];
      }
    });
  };

  const handleCheckIn = async () => {
    if (selectedChildIds.length === 0) {
      toast.error("Selecione pelo menos uma criança");
      return;
    }

    try {
      for (const childId of selectedChildIds) {
        await markAttendance(childId, scheduleId, 'present');
      }
      
      const count = selectedChildIds.length;
      toast.success(`Check-in realizado com sucesso para ${count} criança${count > 1 ? 's' : ''}!`);
      
      if (onCheckIn) {
        selectedChildIds.forEach(childId => onCheckIn(childId));
      }
      
      setSelectedChildIds([]);
      setSearchTerm("");
      await loadAvailableChildren();
    } catch (error) {
      console.error("Erro ao fazer check-in:", error);
      toast.error("Erro ao fazer check-in");
    }
  };

  const handleCreateNew = () => {
    sessionStorage.setItem('returnToCheckin', 'true');
    navigate("/cadastro");
  };

  return (
    <S.Container>
      <S.Header>
        <Typography style={{ marginBottom: "16px", fontSize: "24px", fontWeight: "bold" }}>
          Selecionar Criança
        </Typography>
        
        <S.SearchContainer>
          <Input
            type="text"
            placeholder="Buscar por nome ou responsável..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ marginBottom: "16px" }}
          />
          {filteredChildren.length > 0 && (
            <S.SelectAllButton
              onClick={() => {
                if (selectedChildIds.length === filteredChildren.length) {
                  setSelectedChildIds([]);
                } else {
                  setSelectedChildIds(filteredChildren.map(child => child.id));
                }
              }}
            >
              {selectedChildIds.length === filteredChildren.length ? "Desselecionar Todas" : "Selecionar Todas"}
            </S.SelectAllButton>
          )}
        </S.SearchContainer>
      </S.Header>

      <S.Content>
        {loading ? (
          <S.LoadingContainer>
            <Typography>Carregando crianças disponíveis...</Typography>
          </S.LoadingContainer>
        ) : filteredChildren.length === 0 ? (
          <S.EmptyState>
            <Typography style={{ marginBottom: "16px" }}>
              {searchTerm 
                ? "Nenhuma criança encontrada com essa busca"
                : "Nenhuma criança disponível para check-in"
              }
            </Typography>
            <Button
              type="button"
              color="primary"
              size="md"
              onClick={handleCreateNew}
            >
              Cadastrar Nova Criança
            </Button>
          </S.EmptyState>
        ) : (
          <>
            <S.ChildrenList>
              {filteredChildren.map((child) => (
                <S.ChildCard
                  key={child.id}
                  selected={selectedChildIds.includes(child.id)}
                  onClick={() => handleChildSelect(child.id)}
                >
                  <S.ChildInfo>
                    <S.ChildName>{child.name}</S.ChildName>
                    <S.ChildDetails>
                      {child.age} anos • {child.guardian}
                    </S.ChildDetails>
                  </S.ChildInfo>
                  
                  <S.ChildStatus>
                    {selectedChildIds.includes(child.id) ? "✓" : "○"}
                  </S.ChildStatus>
                </S.ChildCard>
              ))}
            </S.ChildrenList>

            <S.Actions>
              <Button
                type="button"
                color="secondary"
                size="md"
                onClick={handleCreateNew}
                style={{ marginBottom: "12px" }}
              >
                Cadastrar Nova Criança
              </Button>
              
              <Button
                type="button"
                color="primary"
                size="md"
                onClick={handleCheckIn}
                disabled={selectedChildIds.length === 0 || loading}
                style={{ width: "100%" }}
              >
                {loading ? "Fazendo Check-in..." : `Fazer Check-in (${selectedChildIds.length})`}
              </Button>
            </S.Actions>
          </>
        )}
      </S.Content>
    </S.Container>
  );
} 
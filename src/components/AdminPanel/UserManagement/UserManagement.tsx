import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserManagement } from "../../../hooks/useUserManagement";
import * as S from "./styles";
import Typography from "../../ui/Typography";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import toast from "react-hot-toast";

interface User {
  id: string;
  email: string;
  display_name?: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Componente customizado para select de role
const CustomRoleSelect = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.custom-select-container')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <S.Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="professor">Professor</option>
        <option value="admin">Administrador</option>
      </S.Select>
      
      <S.CustomSelectContainer className="custom-select-container">
        <S.CustomSelectButton
          type="button"
          isOpen={showDropdown}
          onClick={() => setShowDropdown(!showDropdown)}
        >
          {value === 'professor' ? 'Professor' : 'Administrador'}
          <span style={{ color: '#666', fontSize: '12px' }}>▼</span>
        </S.CustomSelectButton>
        
        {showDropdown && (
          <S.CustomDropdown>
            <S.CustomOption
              className={value === 'professor' ? 'selected' : ''}
              onClick={() => {
                onChange('professor');
                setShowDropdown(false);
              }}
            >
              Professor
            </S.CustomOption>
            <S.CustomOption
              className={value === 'admin' ? 'selected' : ''}
              onClick={() => {
                onChange('admin');
                setShowDropdown(false);
              }}
            >
              Administrador
            </S.CustomOption>
          </S.CustomDropdown>
        )}
      </S.CustomSelectContainer>
    </>
  );
};

export default function UserManagement() {
  const navigate = useNavigate();
  const { users, loading, error, createUser, updateUser, toggleUserStatus, deleteUser } = useUserManagement();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "professor"
  });


  const handleCreateUser = async () => {
    try {
      if (!formData.email || !formData.password) {
        toast.error("Email e senha são obrigatórios");
        return;
      }

      await createUser({
        email: formData.email,
        password: formData.password,
        display_name: formData.name || undefined,
        role: formData.role === 'professor' ? 'tio' : formData.role
      });

      setShowCreateModal(false);
      setFormData({ name: "", email: "", password: "", role: "professor" });
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
    }
  };

  const handleEditUser = async () => {
    try {
      if (!selectedUser) return;

      await updateUser(selectedUser.id, {
        display_name: formData.name || undefined,
        role: formData.role === 'professor' ? 'tio' : formData.role,
        password: formData.password || undefined
      });

      setShowEditModal(false);
      setSelectedUser(null);
      setFormData({ name: "", email: "", password: "", role: "professor" });
    } catch (error) {
      console.error("Erro ao editar usuário:", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Tem certeza que deseja desativar este usuário?")) {
      return;
    }

    try {
      await deleteUser(userId);
    } catch (error) {
      console.error("Erro ao desativar usuário:", error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.display_name && user.display_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getRoleColor = (role: string) => {
    return role === 'admin' ? '#FF69B4' : '#87CEEB'; // Usando cores do tema
  };

  const mapRoleForForm = (role: string) => {
    return role === 'tio' ? 'professor' : role;
  };

  const formatDate = (dateString: string) => {
    // Converter para horário do Brasil (UTC-3)
    const date = new Date(dateString);
    const brazilTime = new Date(date.getTime() - (3 * 60 * 60 * 1000)); // UTC-3
    
    return brazilTime.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

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
            Gerenciar Usuários
          </Typography>
          <Typography style={{ color: "#666", marginBottom: "20px" }}>
            Crie, edite e gerencie usuários do sistema
          </Typography>
        </S.Header>

        <S.ControlsContainer>
          <S.SearchContainer>
            <Input
              type="text"
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </S.SearchContainer>
          
          <Button
            type="button"
            color="primary"
            size="md"
            onClick={() => setShowCreateModal(true)}
          >
            + Adicionar Usuário
          </Button>
        </S.ControlsContainer>

        {loading ? (
          <S.LoadingContainer>
            <Typography>Carregando usuários...</Typography>
          </S.LoadingContainer>
        ) : (
          <S.TableContainer>
            <S.Table>
              <S.TableHeader>
                <S.TableRow>
                  <S.TableHeaderCell>Nome</S.TableHeaderCell>
                  <S.TableHeaderCell>Email</S.TableHeaderCell>
                  <S.TableHeaderCell>Tipo de Usuário</S.TableHeaderCell>
                  <S.TableHeaderCell>Status</S.TableHeaderCell>
                  <S.TableHeaderCell>Criado em</S.TableHeaderCell>
                  <S.TableHeaderCell>Ações</S.TableHeaderCell>
                </S.TableRow>
              </S.TableHeader>
              <S.TableBody>
                {filteredUsers.length === 0 ? (
                  <S.TableRow>
                    <S.TableCell colSpan={6} style={{ textAlign: "center", padding: "40px" }}>
                      <Typography>Nenhum usuário encontrado</Typography>
                    </S.TableCell>
                  </S.TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <S.TableRow key={user.id}>
                      <S.TableCell>{user.display_name || "-"}</S.TableCell>
                      <S.TableCell>{user.email}</S.TableCell>
                      <S.TableCell>
                        <S.RoleBadge style={{ backgroundColor: getRoleColor(user.role) }}>
                          {user.role === 'admin' ? 'Administrador' : 'Professor'}
                        </S.RoleBadge>
                      </S.TableCell>
                      <S.TableCell>
                        <span style={{ 
                          fontSize: '18px',
                          color: user.is_active ? '#98FB98' : '#FFB6C1'
                        }}>
                          {user.is_active ? '✅' : '❌'}
                        </span>
                      </S.TableCell>
                      <S.TableCell>
                        {formatDate(user.created_at)}
                      </S.TableCell>
                      <S.TableCell>
                        <S.ActionButtons>
                          <S.ActionButton
                            onClick={() => {
                              setSelectedUser(user);
                              setFormData({
                                name: user.display_name || "",
                                email: user.email,
                                password: "",
                                role: mapRoleForForm(user.role)
                              });
                              setShowEditModal(true);
                            }}
                          >
                            ✏️
                          </S.ActionButton>
                          <S.ActionButton
                            onClick={() => handleDeleteUser(user.id)}
                            style={{ color: '#f44336' }}
                          >
                            🗑️
                          </S.ActionButton>
                        </S.ActionButtons>
                      </S.TableCell>
                    </S.TableRow>
                  ))
                )}
              </S.TableBody>
            </S.Table>
          </S.TableContainer>
        )}

        {/* Versão Mobile - Cards */}
        <S.MobileCardContainer>
          {filteredUsers.map(user => (
            <S.MobileCard key={user.id}>
              <S.MobileCardHeader>
                <div>
                  <S.MobileCardName>
                    {user.display_name || user.email}
                  </S.MobileCardName>
                  <S.MobileCardEmail>
                    {user.email}
                  </S.MobileCardEmail>
                </div>
                <S.RoleBadge style={{ backgroundColor: getRoleColor(user.role) }}>
                  {user.role === 'admin' ? 'Administrador' : 'Professor'}
                </S.RoleBadge>
              </S.MobileCardHeader>
              
              <S.MobileCardFooter>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  {user.is_active ? '✅ Ativo' : '❌ Inativo'}
                </div>
                <S.MobileCardActions>
                  <S.ActionButton
                    onClick={() => {
                      setSelectedUser(user);
                      setFormData({
                        name: user.display_name || "",
                        email: user.email,
                        password: "",
                        role: mapRoleForForm(user.role)
                      });
                      setShowEditModal(true);
                    }}
                  >
                    ✏️
                  </S.ActionButton>
                  <S.ActionButton
                    onClick={() => handleDeleteUser(user.id)}
                    style={{ color: '#f44336' }}
                  >
                    🗑️
                  </S.ActionButton>
                </S.MobileCardActions>
              </S.MobileCardFooter>
            </S.MobileCard>
          ))}
        </S.MobileCardContainer>

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
        <S.Modal onClick={() => setShowCreateModal(false)}>
          <S.ModalContent onClick={(e) => e.stopPropagation()}>
            <S.ModalHeader>
              <Typography style={{ fontSize: "20px", fontWeight: "bold" }}>
                Novo Usuário
              </Typography>
              <S.CloseButton onClick={() => setShowCreateModal(false)}>
                ✕
              </S.CloseButton>
            </S.ModalHeader>
            
            <S.ModalBody>
              <S.FormGroup>
                <S.Label>Nome</S.Label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nome completo"
                />
              </S.FormGroup>
              
              <S.FormGroup>
                <S.Label>Email</S.Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@exemplo.com"
                />
              </S.FormGroup>
              
              <S.FormGroup>
                <S.Label>Senha</S.Label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Senha"
                />
              </S.FormGroup>
              
              <S.FormGroup>
                <S.Label>Tipo de Usuário</S.Label>
                <CustomRoleSelect
                  value={formData.role}
                  onChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
                />
              </S.FormGroup>
            </S.ModalBody>
            
            <S.ModalFooter>
              <Button
                type="button"
                color="secondary"
                size="md"
                onClick={() => setShowCreateModal(false)}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                color="primary"
                size="md"
                onClick={handleCreateUser}
              >
                Criar Usuário
              </Button>
            </S.ModalFooter>
          </S.ModalContent>
        </S.Modal>
      )}

      {/* Modal de Edição */}
      {showEditModal && selectedUser && (
        <S.Modal onClick={() => setShowEditModal(false)}>
          <S.ModalContent onClick={(e) => e.stopPropagation()}>
            <S.ModalHeader>
              <Typography style={{ fontSize: "20px", fontWeight: "bold" }}>
                Editar Usuário
              </Typography>
              <S.CloseButton onClick={() => setShowEditModal(false)}>
                ✕
              </S.CloseButton>
            </S.ModalHeader>
            
            <S.ModalBody>
              <S.FormGroup>
                <S.Label>Nome</S.Label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nome completo"
                />
              </S.FormGroup>
              
              <S.FormGroup>
                <S.Label>Email</S.Label>
                <Input
                  type="email"
                  value={formData.email}
                  disabled
                  placeholder="email@exemplo.com"
                />
              </S.FormGroup>
              
              <S.FormGroup>
                <S.Label>Nova Senha (opcional)</S.Label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Deixe em branco para manter a atual"
                />
              </S.FormGroup>
              
              <S.FormGroup>
                <S.Label>Tipo de Usuário</S.Label>
                <CustomRoleSelect
                  value={formData.role}
                  onChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
                />
              </S.FormGroup>
            </S.ModalBody>
            
            <S.ModalFooter>
              <Button
                type="button"
                color="secondary"
                size="md"
                onClick={() => setShowEditModal(false)}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                color="primary"
                size="md"
                onClick={handleEditUser}
              >
                Salvar Alterações
              </Button>
            </S.ModalFooter>
          </S.ModalContent>
        </S.Modal>
      )}
    </S.Container>
  );
} 
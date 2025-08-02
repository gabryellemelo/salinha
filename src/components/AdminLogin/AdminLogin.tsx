import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "./styles";
import Typography from "../ui/Typography";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import client from "../../client";

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { email, password } = formData;

    if (!email || !password) {
      toast.error("Preencha todos os campos");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await auth.login({ email, password });
      
      if (error) {
        throw error;
      }

      // Verificar se o usuário é admin
      if (data.user) {
        // Verificar se o usuário tem role de admin
        if (auth.isAdmin()) {
          toast.success("Login realizado com sucesso!");
          navigate("/admin-panel");
        } else {
          // Verificação direta no banco como fallback
          try {
            const { data: profileData, error: profileError } = await client
              .from('user_profiles')
              .select('role, is_active')
              .eq('id', data.user.id)
              .single();
            
            if (profileData && profileData.role === 'admin' && profileData.is_active) {
              toast.success("Login realizado com sucesso!");
              navigate("/admin-panel");
              return;
            }
          } catch (dbError) {
            console.error("Erro na verificação direta:", dbError);
          }
          
          // Fazer logout se não for admin
          await auth.logout();
          toast.error("Acesso negado. Apenas administradores podem acessar este painel.");
        }
      }
    } catch (error: any) {
      console.error("Erro no login:", error);
      toast.error(error.message || "Erro ao fazer login");
    }

    setIsLoading(false);
  };

  return (
    <S.Container>
      <S.FormContainer onSubmit={handleSubmit}>
        <S.SecurityBadge>🔒 ADMIN</S.SecurityBadge>
        
        <S.Icon>⛪</S.Icon>

        <S.AdminTitle>Painel Administrativo</S.AdminTitle>

        <S.InputContainer>
          <Input
            name="email"
            placeholder="Email do administrador"
            type="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="off"
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#333',
              fontSize: '15px',
              padding: '14px',
              borderRadius: '10px',
            }}
          />
          <Input
            name="password"
            placeholder="Senha do administrador"
            type="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="off"
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#333',
              fontSize: '15px',
              padding: '14px',
              borderRadius: '10px',
            }}
          />
        </S.InputContainer>

        <S.ButtonContainer>
          <S.AdminButton
            type="submit"
            disabled={isLoading}
            style={{ width: "100%" }}
          >
            {isLoading ? "Entrando..." : "Entrar como Administrador"}
          </S.AdminButton>

          <S.SecondaryButton
            type="button"
            onClick={() => navigate("/")}
            style={{ width: "100%" }}
          >
            Voltar ao Login Principal
          </S.SecondaryButton>
        </S.ButtonContainer>

        <div style={{ 
          marginTop: '20px', 
          padding: '12px', 
          background: 'rgba(255, 105, 180, 0.1)', 
          borderRadius: '8px',
          border: '1px solid rgba(255, 105, 180, 0.2)'
        }}>
          <Typography style={{ 
            color: '#666', 
            fontSize: '12px', 
            textAlign: 'center',
            lineHeight: '1.4'
          }}>
            ⚠️ Acesso restrito apenas para administradores autorizados.
          </Typography>
        </div>
      </S.FormContainer>
    </S.Container>
  );
} 
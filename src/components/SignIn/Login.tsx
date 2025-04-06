import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Typography from "../ui/Typography";
import * as S from "./styles";
import toast from "react-hot-toast";

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Preencha todos os campos.");
      return;
    }

    try {
      setLoading(true);
      const response = await auth.login({ email, password });

      if (response.error) {
        setErrorMsg("Email ou senha incorretos.");
        return;
      }
      toast.success("Login realizado com sucesso!");
      onLogin();
    } catch (error) {
      setErrorMsg("Erro ao fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <S.Container>
      <S.FormContainer onSubmit={handleSubmit}>
        <S.Icon
          src="https://cdn-icons-png.flaticon.com/512/3589/3589331.png"
          alt="Criança brincando"
        />

        <Typography size="22px" weight="bold" align="center">
          Bem-vindo à Salinha!
        </Typography>

        <Typography
          size="14px"
          color="#555"
          margin="0 30 30"
          lineHeight="1.5"
          align="center"
        >
          “Deixem vir a mim as crianças, não as impeçam; <br />
          pois o Reino de Deus pertence aos que são semelhantes a elas.” <br />
          <em>Marcos 10:14</em>
        </Typography>

        <Input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email do tio"
          style={{ marginBottom: "10px" }}
          autoComplete="off"
        />

        <Input
          type="password"
          name="senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha do tio"
          style={{ marginBottom: "30px" }}
          autoComplete="off"
        />

        {errorMsg && (
          <Typography color="red" size="14px" align="center" margin="0 0 20px" style={{ fontWeight: "bold" }}>
            {errorMsg}
          </Typography>
        )}

        <Button
          type="submit"
          color="primary"
          size="md"
          style={{ width: "100%" }}
          disabled={loading}
        >
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </S.FormContainer>
    </S.Container>
  );
}

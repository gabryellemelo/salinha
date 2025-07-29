import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "./styles";
import Ball from "../../assets/ball.png";
import Typography from "../ui/Typography";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { useStudent } from "../../hooks/useStudent";
import toast from "react-hot-toast";
import { useSessionStore } from "../../store/useSessionStore";

export default function CreateStudent() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    responsible: "",
    telephone: "",
    intolerances_restrictions: "",
    image_authorization: false,
  });

  const navigate = useNavigate();
  const { createStudent } = useStudent();
  const { classId } = useSessionStore();
  const [isLoading, setIsLoading] = useState(false);

  console.log("CreateStudent - classId:", classId);

  if (!classId) {
    return (
      <S.Container>
        <S.CardContainer>
          <S.Icon src={Ball} alt="Bola colorida" />
          <Typography align="center" size="22px" weight="bold" margin="0 0 16px">
            Turma não selecionada
          </Typography>
          <Typography align="center" size="14px" color="#555" margin="0 0 24px">
            Por favor, selecione uma turma primeiro.
          </Typography>
          <Button
            type="button"
            color="primary"
            size="md"
            style={{ width: "100%" }}
            onClick={() => navigate("/")}
          >
            Voltar para Seleção de Turma
          </Button>
        </S.CardContainer>
      </S.Container>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === "telephone") {
      const numericValue = value.replace(/\D/g, "").slice(0, 11);
      const formatted = numericValue
        .replace(/^(\d{2})(\d)/, "$1 $2")
        .replace(/(\d{5})(\d)/, "$1-$2");

      setFormData((prev) => ({ ...prev, [name]: formatted }));
      return;
    }

    if (name === "age") {
      const numericAge = value.replace(/\D/g, "").slice(0, 2);
      setFormData((prev) => ({ ...prev, [name]: numericAge }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { name, age, responsible, telephone, intolerances_restrictions, image_authorization } = formData;

    if (!name || !age || !responsible || !telephone) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (image_authorization === undefined) {
      toast.error("Selecione uma opção para autorização de imagens");
      return;
    }

    if (!classId) {
      toast.error("Turma não selecionada. Volte para a tela anterior.");
      return;
    }

    setIsLoading(true);

    try {
      await createStudent({
        name,
        age: age,
        responsible,
        telephone,
        intolerances_restrictions,
        image_authorization,
        class_id: classId,
      });

      toast.success("Criança cadastrada com sucesso!");

      setFormData({
        name: "",
        age: "",
        responsible: "",
        telephone: "",
        intolerances_restrictions: "",
        image_authorization: false,
      });
    } catch (error) {
      console.error(error);
      toast.error("Erro ao cadastrar criança. Tente novamente.");
    }

    setIsLoading(false);
  };

  return (
    <S.Container>
      <S.CardContainer>
        <S.Icon src={Ball} alt="Bola colorida" />

        <Typography align="center" size="22px" weight="bold" margin="0 0 8px">
          Cadastro da Criança
        </Typography>

        <Typography
          align="center"
          size="14px"
          color="#555"
          margin="0 0 24px"
          lineHeight="1.5"
        >
          "Ensina a criança no caminho em que deve andar, <br />
          e mesmo quando envelhecer não se desviará dele." <br />
          <em>Provérbios 22:6</em>
        </Typography>

        <S.Form onSubmit={handleSubmit}>
          <S.InputContainer>
            <Input
              name="name"
              placeholder="Nome da criança"
              type="text"
              value={formData.name}
              onChange={handleChange}
              autoComplete="off"
            />
            <Input
              name="age"
              placeholder="Idade"
              type="number"
              value={formData.age}
              onChange={handleChange}
              autoComplete="off"
            />
            <Input
              name="responsible"
              placeholder="Nome do responsável"
              type="text"
              value={formData.responsible}
              onChange={handleChange}
              autoComplete="off"
            />
            <Input
              name="telephone"
              placeholder="Telefone"
              type="tel"
              value={formData.telephone}
              onChange={handleChange}
              autoComplete="off"
            />
            <Input
              name="intolerances_restrictions"
              placeholder="Intolerâncias/Restrições (opcional)"
              type="text"
              value={formData.intolerances_restrictions}
              onChange={handleChange}
              autoComplete="off"
            />
            
            <div style={{ marginTop: "16px" }}>
              <Typography size="14px" weight="bold" margin="0 0 8px">
                Autorização de Imagens:
              </Typography>
              <div style={{ display: "flex", gap: "12px" }}>
                <label style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "8px", 
                  cursor: "pointer",
                  padding: "8px 16px",
                  border: "2px solid #e1e5e9",
                  borderRadius: "8px",
                  backgroundColor: formData.image_authorization === true ? "#4CAF50" : "white",
                  color: formData.image_authorization === true ? "white" : "#333",
                  transition: "all 0.2s ease"
                }}>
                  <input
                    type="radio"
                    name="image_authorization"
                    value="true"
                    checked={formData.image_authorization === true}
                    onChange={() => setFormData(prev => ({ ...prev, image_authorization: true }))}
                    style={{ display: "none" }}
                  />
                  <span style={{ fontWeight: "500" }}>Sim</span>
                </label>
                <label style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "8px", 
                  cursor: "pointer",
                  padding: "8px 16px",
                  border: "2px solid #e1e5e9",
                  borderRadius: "8px",
                  backgroundColor: formData.image_authorization === false ? "#f44336" : "white",
                  color: formData.image_authorization === false ? "white" : "#333",
                  transition: "all 0.2s ease"
                }}>
                  <input
                    type="radio"
                    name="image_authorization"
                    value="false"
                    checked={formData.image_authorization === false}
                    onChange={() => setFormData(prev => ({ ...prev, image_authorization: false }))}
                    style={{ display: "none" }}
                  />
                  <span style={{ fontWeight: "500" }}>Não</span>
                </label>
              </div>
            </div>
          </S.InputContainer>

          <Button
            type="submit"
            color="primary"
            size="md"
            style={{ width: "100%", marginTop: "20px" }}
            disabled={isLoading}
          >
            {isLoading ? "Cadastrando..." : "Cadastrar"}
          </Button>

          <Button
            type="button"
            color="secondary"
            size="md"
            style={{ width: "100%", marginTop: "12px" }}
            onClick={() => navigate("/lista")}
          >
            Ver Lista de Crianças
          </Button>
        </S.Form>
      </S.CardContainer>
    </S.Container>
  );
}

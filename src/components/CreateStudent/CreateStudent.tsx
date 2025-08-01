import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "./styles";
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
        <S.Card>
          <S.Header>
            <S.Icon>🎨</S.Icon>
            <Typography style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "16px" }}>
              Turma não selecionada
            </Typography>
            <Typography style={{ color: "#555", marginBottom: "24px" }}>
              Por favor, selecione uma turma primeiro.
            </Typography>
          </S.Header>
          <Button
            type="button"
            color="primary"
            size="md"
            style={{ width: "100%" }}
            onClick={() => navigate("/")}
          >
            Voltar para Seleção de Turma
          </Button>
        </S.Card>
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

      toast.success("Criança cadastrada com sucesso! Redirecionando para o sistema de check-in...");

      setFormData({
        name: "",
        age: "",
        responsible: "",
        telephone: "",
        intolerances_restrictions: "",
        image_authorization: false,
      });

      const returnToCheckin = sessionStorage.getItem('returnToCheckin');

      setTimeout(() => {
        if (returnToCheckin === 'true') {
          sessionStorage.removeItem('returnToCheckin');
          navigate("/checkin");
        } else {
          navigate("/lista");
        }
      }, 1500);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao cadastrar criança. Tente novamente.");
    }

    setIsLoading(false);
  };

  return (
    <S.Container>
      <S.Card>
        <S.Header>
          <S.Icon>🎨</S.Icon>
          <Typography style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "8px" }}>
            Cadastro da Criança
          </Typography>
          <Typography style={{ color: "#666", marginBottom: "20px", textAlign: "center", lineHeight: "1.5" }}>
            "Ensina a criança no caminho em que deve andar, <br />
            e mesmo quando envelhecer não se desviará dele." <br />
            <em>Provérbios 22:6</em>
          </Typography>
        </S.Header>

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

            <S.AuthorizationSection>
              <Typography style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "8px" }}>
                Autorização de Imagens:
              </Typography>
              <S.RadioContainer>
                <S.RadioButton
                  selected={formData.image_authorization === true}
                  onClick={() => setFormData(prev => ({ ...prev, image_authorization: true }))}
                >
                  <input
                    type="radio"
                    name="image_authorization"
                    value="true"
                    checked={formData.image_authorization === true}
                    onChange={() => setFormData(prev => ({ ...prev, image_authorization: true }))}
                    style={{ display: "none" }}
                  />
                  <span>Sim</span>
                </S.RadioButton>
                <S.RadioButton
                  selected={formData.image_authorization === false}
                  isNo={true}
                  onClick={() => setFormData(prev => ({ ...prev, image_authorization: false }))}
                >
                  <input
                    type="radio"
                    name="image_authorization"
                    value="false"
                    checked={formData.image_authorization === false}
                    onChange={() => setFormData(prev => ({ ...prev, image_authorization: false }))}
                    style={{ display: "none" }}
                  />
                  <span>Não</span>
                </S.RadioButton>
              </S.RadioContainer>
            </S.AuthorizationSection>
          </S.InputContainer>

          <S.Actions>
            <Button
              type="submit"
              color="primary"
              size="md"
              style={{ width: "100%", marginBottom: "12px" }}
              disabled={isLoading}
            >
              {isLoading ? "Cadastrando..." : "Cadastrar"}
            </Button>

            <Button
              type="button"
              color="secondary"
              size="md"
              style={{ width: "100%" }}
              onClick={() => navigate("/checkin")}
            >
              Ir para o Check-in
            </Button>
          </S.Actions>
        </S.Form>
      </S.Card>
    </S.Container>
  );
}

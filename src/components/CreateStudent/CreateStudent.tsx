import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Crianca } from "../../App";
import * as S from "./styles";
import Ball from '../../assets/ball.png'
import Typography from "../ui/Typography";
import Button from "../ui/Button";
import Input from "../ui/Input";

interface Props {
  onAdd: (crianca: Omit<Crianca, "id">) => void;
}

export default function CreateStudent({ onAdd }: Props) {
  const [form, setForm] = useState<Omit<Crianca, "id">>({
    nome: "",
    idade: "",
    responsavel: "",
    telefone: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.idade || !form.responsavel || !form.telefone) {
      alert("Preencha todos os campos");
      return;
    }
    onAdd(form);
    setForm({ nome: "", idade: "", responsavel: "", telefone: "" });
  };

  return (
    <S.Container>
      <S.CardContainer
      >
        <S.Icon
          src={Ball}
          alt="Bola colorida"
        />

        <Typography align="center" size="22px" weight="bold" margin="0 0 8px">
          Cadastro da Criança
        </Typography>

        <Typography align="center" size="14px" color="#555" margin="0 0 24px" lineHeight="1.5">
          “Ensina a criança no caminho em que deve andar, <br />
          e mesmo quando envelhecer não se desviará dele.” <br />
          <em>Provérbios 22:6</em>
        </Typography>


        <S.Form onSubmit={handleSubmit}>
          <S.InputContainer>
            <Input
              name="nome"
              placeholder="Nome da criança"
              type="text"
              value={form.nome}
              onChange={handleChange}
              autoComplete="off"
            />
            <Input
              name="idade"
              placeholder="Idade"
              type="text"
              value={form.idade}
              onChange={handleChange}
              autoComplete="off"
            />
            <Input
              name="responsavel"
              placeholder="Nome do responsável"
              type="text"
              value={form.responsavel}
              onChange={handleChange}
              autoComplete="off"
            />
            <Input
              name="telefone"
              placeholder="Telefone"
              type="tel"
              value={form.telefone}
              onChange={handleChange}
              style={{ marginBottom: "20px" }}
              autoComplete="off"
            />
          </S.InputContainer>
          <Button
            type="submit"
            color="primary"
            size="md"
            style={{ width: "100%", marginTop: "20px" }}
          >
            Cadastrar
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
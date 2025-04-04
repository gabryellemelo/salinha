import { useState } from "react";
import * as S from "./styles";
import Input from "../ui/Input";
import Button from "../ui/Button";

interface ModalProps {
  onConfirm: (nome: string) => void;
  onClose: () => void;
}

export default function Modal({ onConfirm, onClose }: ModalProps) {
  const [nome, setNome] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return alert("Digite um nome válido");
    onConfirm(nome.trim());
  };

  return (
    <S.Overlay >
      <S.ModalForm
        onSubmit={handleSubmit}
      >
        <S.ModalTitle>
          Quem retirou a criança?
        </S.ModalTitle>

        <Input
          type="text"
          placeholder="Digite o nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          style={{ marginBottom: "20px" }}
        />

        <S.ContainerButton>
          <Button
            type="button"
            color="secondary"
            size="md"
            style={{ flex: 1, padding: "12px" }}
            onClick={onClose}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            color="primary"
            size="md"
            style={{ flex: 1, padding: "12px" }}
          >
            Confirmar
          </Button>
        </S.ContainerButton>
      </S.ModalForm>
    </S.Overlay>
  );
}

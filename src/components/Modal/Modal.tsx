import { useState } from "react";
import * as S from "./styles";
import Input from "../ui/Input";
import Button from "../ui/Button";
import toast from "react-hot-toast";

interface ModalProps {
  onConfirm: (name: string) => void;
  onClose: () => void;
}

export default function Modal({ onConfirm, onClose }: ModalProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Digite um nome válido");
    onConfirm(name.trim());
    toast.success("Retirada confirmada com sucesso!");
  };

  return (
    <S.Overlay>
      <S.ModalForm onSubmit={handleSubmit}>
        <S.ModalTitle>
          Quem retirou a criança?
        </S.ModalTitle>

        <Input
          type="text"
          placeholder="Digite o nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
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

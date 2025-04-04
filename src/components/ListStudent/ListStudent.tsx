// src/components/ListaCriancasPage.tsx
import { Crianca } from "../../App";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Modal from "../Modal/Modal";
import * as S from "./styles";
import Typography from "../ui/Typography";
import Button from "../ui/Button";

interface Props {
  crianças: Crianca[];
  onRetirar: (id: number, liberadoPor: string) => void;
}

export default function ListStudent({ crianças, onRetirar }: Props) {
  const navigate = useNavigate();
  const [modalId, setModalId] = useState<number | null>(null);

  return (
    <S.Container>
      <S.Card>
        <S.Title>
          👧 Lista de Crianças
        </S.Title>

        {crianças.length === 0 ? (
          <Typography color="#555" align="center">
            Nenhuma criança cadastrada ainda.
          </Typography>

        ) : (
          <S.ContainerList>
            {crianças.map((c) => (
              <S.ChildCard
                key={c.id}
                style={{
                  backgroundColor: "#F9F9F9",
                  borderRadius: "12px",
                  padding: "16px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <S.ChildName>
                  {c.nome} ({c.idade} anos)
                </S.ChildName>
                <S.ChildInfo>
                  Responsável: {c.responsavel}
                </S.ChildInfo>
                <S.ChildInfo>
                  Telefone: {c.telefone}
                </S.ChildInfo>

                {c.liberadoPor ? (
                  <S.ReleasedBy>
                    Liberado por: {c.liberadoPor}
                  </S.ReleasedBy>
                ) : (
                  <S.ContainerButton>
                    <S.WhatsAppButton
                      href={`https://wa.me/55${c.telefone.replace(/\D/g, "")}?text=olá%20${encodeURIComponent(
                        c.responsavel
                      )}%2C%20por%20favor%20comparecer%20à%20salinha`}
                      target="_blank"
                    >
                      WhatsApp
                    </S.WhatsAppButton>
                    <Button
                      type="button"
                      color="primary"
                      size="sm"
                      style={{ flex: 1, padding: "10px" }}
                      onClick={() => setModalId(c.id)}
                    >
                      Liberar
                    </Button>
                  </S.ContainerButton>
                )}
              </S.ChildCard>
            ))}
          </S.ContainerList>
        )}

        <Button
          type="button"
          color="secondary"
          size="md"
          style={{
            marginTop: "30px",
            padding: "12px",
            width: "100%",
          }}
          onClick={() => navigate("/")}
        >
          Voltar ao Cadastro
        </Button>


        {modalId !== null && (
          <Modal
            onConfirm={(nome) => {
              onRetirar(modalId, nome);
              setModalId(null);
            }}
            onClose={() => setModalId(null)}
          />
        )}
      </S.Card>
    </S.Container>
  );
}
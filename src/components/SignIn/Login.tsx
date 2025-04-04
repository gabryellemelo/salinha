import Button from "../ui/Button";
import Input from "../ui/Input";
import Typography from "../ui/Typography";
import * as S from "./styles";

interface LoginProps {
    onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const senha = (e.target as any).senha.value;
        if (senha === "1234") {
            onLogin();
        } else {
            alert("Senha incorreta!");
        }
    };

    return (
        <S.Container>
            <S.FormContainer
                onSubmit={handleSubmit}
            >
                <S.Icon
                    src="https://cdn-icons-png.flaticon.com/512/3589/3589331.png"
                    alt="Criança brincando"
                />

                <Typography size="22px" weight="bold" align="center">
                    Bem-vindo à Salinha!
                </Typography>


                <Typography size="14px" color="#555" margin="0 30 30" lineHeight="1.5" align="center" >
                    “Deixem vir a mim as crianças, não as impeçam; <br />
                    pois o Reino de Deus pertence aos que são semelhantes a elas.” <br />
                    <em>Marcos 10:14</em>
                </Typography>


                <Input type="password"
                    name="senha"
                    placeholder="Senha dos tios" style={{ marginBottom: "30px" }} autoComplete="off"/>

                <Button
                    type="submit"
                    color="primary"
                    size="md"
                    style={{width: "100%"}}
                >
                    Entrar
                </Button>
            </S.FormContainer>
        </S.Container>
    );
}

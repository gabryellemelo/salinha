import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/SignIn/Login";
import CreateStudent from "./components/CreateStudent/CreateStudent";
import ListStudent from "./components/ListStudent/ListStudent";

export interface Crianca {
  id: number;
  nome: string;
  idade: string;
  responsavel: string;
  telefone: string;
  liberadoPor?: string;
}

function App() {
  const [logado, setLogado] = useState(false);
  const [crianças, setCriancas] = useState<Crianca[]>([]);

  useEffect(() => {
    const salvas = localStorage.getItem("crianças");
    if (salvas) setCriancas(JSON.parse(salvas));
  }, []);

  useEffect(() => {
    localStorage.setItem("crianças", JSON.stringify(crianças));
  }, [crianças]);

  const adicionarCrianca = (nova: Omit<Crianca, "id">) => {
    setCriancas([...crianças, { ...nova, id: Date.now() }]);
  };

  const registrarRetirada = (id: number, liberadoPor: string) => {
    setCriancas(crianças.map(c => c.id === id ? { ...c, liberadoPor } : c));
  };

  if (!logado) return <Login onLogin={() => setLogado(true)} />;

  return (
    <Routes>
      <Route path="/" element={<CreateStudent onAdd={adicionarCrianca} />} />
      <Route
        path="/lista"
        element={
          <ListStudent crianças={crianças} onRetirar={registrarRetirada} />
        }
      />
    </Routes>
  );
}

export default App;

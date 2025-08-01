import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./components/SignIn/Login";
import CreateStudent from "./components/CreateStudent/CreateStudent";
import EventCheckin from "./components/EventCheckin/EventCheckin";
import AttendanceList from "./components/AttendanceList/AttendanceList";
import client from "./client";
import { Toaster } from "react-hot-toast";
import ClassDetail from "./components/ClassDetail/ClassDetail";
import { useAuth } from "./hooks/useAuth";

function App() {
  const auth = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loadingSession, setLoadingSession] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await client.auth.getSession();

      auth.onAuthStateChange();

      if (data?.session?.user) {
        setIsLoggedIn(true);
        navigate("/");
      }

      setLoadingSession(false);
    };

    checkSession();
  }, []);

  if (loadingSession)
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <div className="spinner" />
      </div>
    );

  if (!isLoggedIn) return <Login onLogin={() => setIsLoggedIn(true)} />;

  return (
    <>
      <Routes>
        <Route path="/" element={<ClassDetail />} />
        <Route path="/cadastro" element={<CreateStudent />} />
        <Route path="/checkin" element={<EventCheckin />} />
        <Route path="/lista-presencas" element={<AttendanceList />} />
      </Routes>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </>
  );
}

export default App;

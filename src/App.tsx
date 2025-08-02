import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./components/SignIn/Login";
import CreateStudent from "./components/CreateStudent/CreateStudent";
import EventCheckin from "./components/EventCheckin/EventCheckin";
import AttendanceList from "./components/AttendanceList/AttendanceList";
import AdminLogin from "./components/AdminLogin/AdminLogin";
import AdminPanel from "./components/AdminPanel/AdminPanel";
import AdminRoute from "./components/AdminPanel/AdminRoute";
import UserManagement from "./components/AdminPanel/UserManagement/UserManagement";
import ScheduleManagement from "./components/AdminPanel/ScheduleManagement/ScheduleManagement";
import client from "./client";
import { Toaster } from "react-hot-toast";
import ClassDetail from "./components/ClassDetail/ClassDetail";
import { useAuth } from "./hooks/useAuth";

function App() {
  const auth = useAuth();
  const isLoggedIn = !!auth.user;
  const loadingSession = auth.loading;

  if (loadingSession)
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <div className="spinner" />
      </div>
    );

  return (
    <>
      <Routes>
        {!isLoggedIn ? (
          <>
            <Route path="/" element={<Login />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="*" element={<Login />} />
          </>
        ) : (
          <>
            <Route path="/" element={<ClassDetail />} />
            <Route path="/cadastro" element={<CreateStudent />} />
            <Route path="/checkin" element={<EventCheckin />} />
            <Route path="/lista-presencas" element={<AttendanceList />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin-panel" element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            } />
            <Route path="/admin/users" element={
              <AdminRoute>
                <UserManagement />
              </AdminRoute>
            } />
            <Route path="/admin/schedules" element={
              <AdminRoute>
                <ScheduleManagement />
              </AdminRoute>
            } />
            <Route path="*" element={<ClassDetail />} />
          </>
        )}
      </Routes>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </>
  );
}

export default App;

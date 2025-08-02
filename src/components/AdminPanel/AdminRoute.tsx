import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const auth = useAuth();

  // Se não há usuário logado, redirecionar para login
  if (!auth.user) {
    toast.error('Você precisa estar logado para acessar esta página');
    return <Navigate to="/admin-login" replace />;
  }

  // Se o usuário não é admin, redirecionar para login
  if (!auth.isAdmin()) {
    toast.error('Acesso negado. Apenas administradores podem acessar esta página');
    return <Navigate to="/admin-login" replace />;
  }

  return <>{children}</>;
} 
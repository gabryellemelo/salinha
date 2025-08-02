import { useEffect } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import client from "../client";
import { AuthOtpResponse, AuthUser } from "@supabase/supabase-js";

type User = {
  id: string;
  full_name: string;
  email: string;
  church_id: string;
  profile_id: string;
  role?: string;
  is_active?: boolean;
};

type AuthStore = {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
};

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      loading: true,
      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ loading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);

const mapUser = (payload: AuthUser): User => ({
  id: payload.id,
  full_name: payload.user_metadata.full_name || '',
  email: payload.email || '',
  church_id: payload.user_metadata.church_id || '',
  profile_id: payload.user_metadata.profile_id || '',
});

// Função para buscar perfil do usuário na tabela user_profiles
const fetchUserProfile = async (userId: string): Promise<{ role?: string; is_active?: boolean } | null> => {
  try {
    const { data, error } = await client
      .from('user_profiles')
      .select('role, is_active')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Erro ao buscar perfil do usuário:', error);
      return null;
    }

    return data || null;
  } catch (error) {
    console.error('Erro ao buscar perfil do usuário:', error);
    return null;
  }
};

export const useAuth = () => {
  const { user, setUser, loading, setLoading } = useAuthStore();

  const getUser = async (): Promise<User | null> => {
    const { data, error } = await client.auth.getUser();

    if (error || !data) {
      console.error(
        "Erro ao buscar usuário:",
        error?.message || "Usuário não encontrado"
      );
      return null;
    }

    const user: User = mapUser(data);
    
    // Buscar perfil do usuário
    const profile = await fetchUserProfile(user.id);
    if (profile) {
      user.role = profile.role;
      user.is_active = profile.is_active;
    }

    setUser(user);

    return user;
  };

  const onAuthStateChange = () => {
    const { data } = client.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = mapUser(session.user as AuthUser);
        
        // Buscar perfil do usuário
        const profile = await fetchUserProfile(user.id);
        if (profile) {
          user.role = profile.role;
          user.is_active = profile.is_active;
        }
        
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return data;
  };

  const login = async (payload: {
    email: string;
    password: string;
  }) => {
    setLoading(true);

    const response = await client.auth.signInWithPassword({
      email: payload.email,
      password: payload.password,
    });

    if (response?.error) {
      setLoading(false);
      throw response.error;
    }

    if (response?.data.user) {
      const user = mapUser(response.data.user as AuthUser);
      
      // Buscar perfil do usuário
      const profile = await fetchUserProfile(user.id);
      if (profile) {
        user.role = profile.role;
        user.is_active = profile.is_active;
      }
      
      setUser(user);
    }

    setLoading(false);

    return response;
  };

  // Verificar se o usuário é admin
  const isAdmin = (): boolean => {
    return user?.role === 'admin' && user?.is_active === true;
  };

  // Logout
  const logout = async (): Promise<void> => {
    setLoading(true);
    const { error } = await client.auth.signOut();
    if (error) {
      setLoading(false);
      throw error;
    }
    setUser(null);
    setLoading(false);
  };

  async function updateUserMetadata({ churchId, profileId, fullName }: { churchId: string; profileId: string; fullName: string }) {
    const { data, error } = await client.auth.updateUser({
      data: {
        church_id: churchId,
        profile_id: profileId,
        full_name: fullName,
      },
    });

    if (error) {
      console.error("Error updating user metadata:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true, user: data };
  }

  // Inicializar estado de autenticação
  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await client.auth.getSession();
      if (session?.user) {
        const user = mapUser(session.user as AuthUser);
        
        // Buscar perfil do usuário
        const profile = await fetchUserProfile(user.id);
        if (profile) {
          user.role = profile.role;
          user.is_active = profile.is_active;
        }
        
        setUser(user);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  return {
    user,
    getUser,
    onAuthStateChange,
    loading,
    login,
    logout,
    updateUserMetadata,
    isAdmin,
  };
};

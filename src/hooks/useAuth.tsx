import { useEffect } from "react";
import { create } from "zustand";
import client from "../client";
import { AuthOtpResponse, AuthUser } from "@supabase/supabase-js";

type User = {
  id: string;
  full_name: string;
  email: string;
  church_id: string;
  profile_id: string;
};

type AuthStore = {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
};

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
}));

const mapUser = (payload: AuthUser): User => ({
  id: payload.id,
  full_name: payload.user_metadata.full_name,
  email: payload.email,
  church_id: payload.user_metadata.church_id,
  profile_id: payload.user_metadata.profile_id,
});

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

    setUser(user);

    return user;
  };

  const onAuthStateChange = () => {
    const { data } = client.auth.onAuthStateChange((event, session) => {
      // console.log("Event:", event);
      // console.log("Session:", session);

      setUser(session?.user ? mapUser(session?.user as AuthUser) : null);
    });

    return data;
  };

  const login = async (payload: {
    email: string;
    password: string;
  }): Promise<AuthOtpResponse> => {
    setLoading(true);

    const response = await client.auth.signInWithPassword({
      email: payload.email,
      password: payload.password,
    });

    if (response?.error) {
      setLoading(false);
      throw response.error;
    }
    setUser(response?.data.user as User);
    setLoading(false);

    return response;
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

  async function updateUserMetadata({ churchId, profileId, fullName }) {
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

  return {
    user,
    getUser,
    onAuthStateChange,
    loading,
    login,
    logout,
    updateUserMetadata,
  };
};

import { useState, useEffect } from 'react';
import client from '../client';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  display_name?: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface UserManagementState {
  users: User[];
  loading: boolean;
  error: string | null;
}

export const useUserManagement = () => {
  const [state, setState] = useState<UserManagementState>({
    users: [],
    loading: true,
    error: null
  });

  const fetchUsers = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Tentar usar a função RPC primeiro
      try {
        const { data, error } = await client
          .rpc('get_users_with_emails');

        if (!error && data) {
          const mappedUsers: User[] = (data || []).map((user: any) => ({
            id: user.id,
            email: user.email,
            display_name: user.display_name,
            role: user.role || 'user',
            is_active: user.is_active || false,
            created_at: user.created_at,
            updated_at: user.updated_at
          }));

          setState({
            users: mappedUsers,
            loading: false,
            error: null
          });
          return;
        }
      } catch (rpcError) {
        console.log('RPC não disponível, usando método alternativo');
      }

      // Método alternativo: buscar apenas user_profiles
      const { data: profiles, error: profilesError } = await client
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Mapear os dados para o formato esperado
      const mappedUsers: User[] = (profiles || []).map(profile => ({
        id: profile.id,
        email: `ID: ${profile.id.slice(0, 8)}...`, // Placeholder
        display_name: profile.display_name || null,
        role: profile.role || 'user',
        is_active: profile.is_active || false,
        created_at: profile.created_at,
        updated_at: profile.updated_at
      }));

      setState({
        users: mappedUsers,
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Erro ao carregar usuários'
      }));
    }
  };

  const createUser = async (userData: {
    email: string;
    password: string;
    display_name?: string;
    role: string;
  }) => {
    try {
      // Usar a função RPC para criar usuário automaticamente
      const { data, error } = await client
        .rpc('create_user_with_profile', {
          user_email: userData.email,
          user_password: userData.password,
          user_display_name: userData.display_name || null,
          user_role: userData.role
        });

      if (error) throw error;

      if (data && data.success) {
        toast.success('Usuário criado com sucesso!');
        fetchUsers();
      } else {
        throw new Error(data?.message || 'Erro ao criar usuário');
      }

    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      toast.error('Erro ao criar usuário');
      throw error;
    }
  };

  const updateUser = async (userId: string, updates: {
    display_name?: string;
    role?: string;
    password?: string;
  }) => {
    try {
      // Atualizar dados do perfil
      const profileUpdates: any = {
        updated_at: new Date().toISOString()
      };

      if (updates.display_name !== undefined) {
        profileUpdates.display_name = updates.display_name;
      }
      if (updates.role !== undefined) {
        profileUpdates.role = updates.role;
      }

      const { error: profileError } = await client
        .from('user_profiles')
        .update(profileUpdates)
        .eq('id', userId);

      if (profileError) throw profileError;

      toast.success('Usuário atualizado com sucesso!');
      fetchUsers(); // Recarregar lista

    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      toast.error('Erro ao atualizar usuário');
      throw error;
    }
  };

  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const { error } = await client
        .from('user_profiles')
        .update({ 
          is_active: isActive, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', userId);

      if (error) throw error;

      toast.success(`Usuário ${isActive ? 'ativado' : 'desativado'} com sucesso!`);
      fetchUsers(); // Recarregar lista

    } catch (error) {
      console.error('Erro ao alterar status:', error);
      toast.error('Erro ao alterar status do usuário');
      throw error;
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      // Soft delete - apenas desativar
      const { error } = await client
        .from('user_profiles')
        .update({ 
          is_active: false, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', userId);

      if (error) throw error;

      toast.success('Usuário desativado com sucesso!');
      fetchUsers(); // Recarregar lista

    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      toast.error('Erro ao desativar usuário');
      throw error;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    ...state,
    fetchUsers,
    createUser,
    updateUser,
    toggleUserStatus,
    deleteUser
  };
}; 
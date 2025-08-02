import { useState, useEffect } from 'react';
import client from '../client';
import toast from 'react-hot-toast';

interface Class {
  id: number;
  name: string;
  min_age: number;
  max_age: number;
}

interface Schedule {
  id: number;
  name?: string;
  datetime: string;
  class_id: number;
  class_name?: string;
}

interface ScheduleUser {
  id: number;
  schedule_id: number;
  user_id: string;
  user_email?: string;
  user_name?: string;
}

interface ScheduleManagementState {
  schedules: Schedule[];
  classes: Class[];
  users: { id: string; email: string; display_name?: string }[];
  loading: boolean;
  error: string | null;
}

export const useScheduleManagement = () => {
  const [state, setState] = useState<ScheduleManagementState>({
    schedules: [],
    classes: [],
    users: [],
    loading: true,
    error: null
  });

  const fetchSchedules = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Buscar escalas com nome da turma
      const { data: schedules, error: schedulesError } = await client
        .from('schedule')
        .select(`
          id,
          name,
          datetime,
          class_id,
          class:class(
            name
          )
        `)
        .order('datetime', { ascending: false });

      if (schedulesError) throw schedulesError;

      const mappedSchedules: Schedule[] = (schedules || []).map((schedule: any) => ({
        id: schedule.id,
        name: schedule.name,
        datetime: schedule.datetime,
        class_id: schedule.class_id,
        class_name: schedule.class?.name
      }));

      setState(prev => ({
        ...prev,
        schedules: mappedSchedules,
        loading: false
      }));

    } catch (error) {
      console.error('Erro ao buscar escalas:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Erro ao carregar escalas'
      }));
    }
  };

  const fetchClasses = async () => {
    try {
      const { data: classes, error: classesError } = await client
        .from('class')
        .select('*')
        .order('name');

      if (classesError) throw classesError;

      setState(prev => ({
        ...prev,
        classes: classes || []
      }));

    } catch (error) {
      console.error('Erro ao buscar turmas:', error);
      toast.error('Erro ao carregar turmas');
    }
  };

  const fetchUsers = async () => {
    try {
      // Buscar usuários que são "tio" (professores)
      const { data: users, error: usersError } = await client
        .rpc('get_users_with_emails');

      if (usersError) throw usersError;

      // Filtrar usuários que podem ser professores (tio ou admin) e estão ativos
      const teacherUsers = (users || []).filter((user: any) => 
        (user.role === 'tio' || user.role === 'admin') && user.is_active === true
      );

      setState(prev => ({
        ...prev,
        users: teacherUsers
      }));

    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      toast.error('Erro ao carregar usuários');
    }
  };

  const createSchedule = async (scheduleData: {
    name: string;
    datetime: string;
    class_id: number;
    user_ids: string[];
  }) => {
    try {
      console.log('Criando escala com dados:', scheduleData);

      // 1. Criar a escala na tabela schedule
      const { data: schedule, error: scheduleError } = await client
        .from('schedule')
        .insert({
          name: scheduleData.name,
          datetime: scheduleData.datetime,
          class_id: scheduleData.class_id
        })
        .select('id')
        .single();

      if (scheduleError) {
        console.error('Erro ao criar schedule:', scheduleError);
        throw scheduleError;
      }

      console.log('Schedule criada:', schedule);

      // 2. Criar as relações na schedule_user
      if (scheduleData.user_ids.length > 0) {
        const scheduleUsers = scheduleData.user_ids.map(userId => ({
          schedule_id: schedule.id,
          user_id: userId
        }));

        console.log('Criando schedule_users:', scheduleUsers);

        const { error: scheduleUserError } = await client
          .from('schedule_user')
          .insert(scheduleUsers);

        if (scheduleUserError) {
          console.error('Erro ao criar schedule_users:', scheduleUserError);
          throw scheduleUserError;
        }
      }

      toast.success('Escala criada com sucesso!');
      fetchSchedules();

    } catch (error) {
      console.error('Erro ao criar escala:', error);
      toast.error('Erro ao criar escala');
      throw error;
    }
  };

  const updateSchedule = async (scheduleId: number, updates: {
    name?: string;
    datetime?: string;
    class_id?: number;
    user_ids?: string[];
  }) => {
    try {
      // 1. Atualizar a escala
      const scheduleUpdates: any = {};
      if (updates.name) scheduleUpdates.name = updates.name;
      if (updates.datetime) scheduleUpdates.datetime = updates.datetime;
      if (updates.class_id) scheduleUpdates.class_id = updates.class_id;

      if (Object.keys(scheduleUpdates).length > 0) {
        const { error: scheduleError } = await client
          .from('schedule')
          .update(scheduleUpdates)
          .eq('id', scheduleId);

        if (scheduleError) throw scheduleError;
      }

      // 2. Atualizar usuários se necessário
      if (updates.user_ids) {
        // Remover usuários existentes
        const { error: deleteError } = await client
          .from('schedule_user')
          .delete()
          .eq('schedule_id', scheduleId);

        if (deleteError) throw deleteError;

        // Adicionar novos usuários
        if (updates.user_ids.length > 0) {
          const scheduleUsers = updates.user_ids.map(userId => ({
            schedule_id: scheduleId,
            user_id: userId
          }));

          const { error: insertError } = await client
            .from('schedule_user')
            .insert(scheduleUsers);

          if (insertError) throw insertError;
        }
      }

      toast.success('Escala atualizada com sucesso!');
      fetchSchedules();

    } catch (error) {
      console.error('Erro ao atualizar escala:', error);
      toast.error('Erro ao atualizar escala');
      throw error;
    }
  };

  const deleteSchedule = async (scheduleId: number) => {
    try {
      // Remover relações primeiro
      const { error: scheduleUserError } = await client
        .from('schedule_user')
        .delete()
        .eq('schedule_id', scheduleId);

      if (scheduleUserError) throw scheduleUserError;

      // Remover a escala
      const { error: scheduleError } = await client
        .from('schedule')
        .delete()
        .eq('id', scheduleId);

      if (scheduleError) throw scheduleError;

      toast.success('Escala removida com sucesso!');
      fetchSchedules();

    } catch (error) {
      console.error('Erro ao remover escala:', error);
      toast.error('Erro ao remover escala');
      throw error;
    }
  };

  const getScheduleUsers = async (scheduleId: number) => {
    try {
      // Primeiro buscar os schedule_users
      const { data: scheduleUsers, error: scheduleUserError } = await client
        .from('schedule_user')
        .select('id, schedule_id, user_id')
        .eq('schedule_id', scheduleId);

      if (scheduleUserError) throw scheduleUserError;

      if (!scheduleUsers || scheduleUsers.length === 0) {
        return [];
      }

      // Depois buscar os dados dos usuários usando RPC
      const userIds = scheduleUsers.map(su => su.user_id);
      
      try {
        // Tentar usar a função RPC para buscar emails
        const { data: allUsers, error: rpcError } = await client
          .rpc('get_users_with_emails');

        if (!rpcError && allUsers) {
          // Filtrar apenas os usuários da escala
          const userProfiles = allUsers.filter((user: any) => 
            userIds.includes(user.id)
          );

          // Combinar os dados
          return scheduleUsers.map((su: any) => {
            const userProfile = userProfiles.find((up: any) => up.id === su.user_id);
            return {
              id: su.id,
              schedule_id: su.schedule_id,
              user_id: su.user_id,
              user_email: userProfile?.email || 'N/A',
              user_name: userProfile?.display_name || 'N/A'
            };
          });
        }
      } catch (rpcError) {
        console.log('RPC não disponível, usando método alternativo');
      }

      // Método alternativo: buscar apenas user_profiles sem email
      const { data: userProfiles, error: userError } = await client
        .from('user_profiles')
        .select('id, display_name')
        .in('id', userIds);

      if (userError) throw userError;

      // Combinar os dados
      return scheduleUsers.map((su: any) => {
        const userProfile = userProfiles?.find(up => up.id === su.user_id);
        return {
          id: su.id,
          schedule_id: su.schedule_id,
          user_id: su.user_id,
          user_email: `ID: ${su.user_id.slice(0, 8)}...`,
          user_name: userProfile?.display_name || 'N/A'
        };
      });

    } catch (error) {
      console.error('Erro ao buscar usuários da escala:', error);
      return [];
    }
  };

  useEffect(() => {
    fetchSchedules();
    fetchClasses();
    fetchUsers();
  }, []);

  return {
    ...state,
    fetchSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    getScheduleUsers
  };
}; 
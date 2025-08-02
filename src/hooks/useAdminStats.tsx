import { useState, useEffect } from 'react';
import client from '../client';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalAdmins: number;
  totalSchedules: number;
  totalClasses: number;
  totalChildren: number;
  upcomingSchedules: number;
  loading: boolean;
  error: string | null;
}

export const useAdminStats = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalAdmins: 0,
    totalSchedules: 0,
    totalClasses: 0,
    totalChildren: 0,
    upcomingSchedules: 0,
    loading: true,
    error: null
  });

  const fetchStats = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true, error: null }));

      // Buscar estatísticas de usuários
      const [usersResponse, activeUsersResponse, adminsResponse, schedulesResponse, classesResponse, childrenResponse, allSchedulesResponse] = await Promise.all([
        // Total de usuários
        client.from('user_profiles').select('id', { count: 'exact' }),
        // Usuários ativos (não admin)
        client.from('user_profiles').select('id', { count: 'exact' }).eq('is_active', true).neq('role', 'admin'),
        // Administradores
        client.from('user_profiles').select('id', { count: 'exact' }).eq('role', 'admin').eq('is_active', true),
        // Total de escalas
        client.from('schedule').select('id', { count: 'exact' }),
        // Classes
        client.from('class').select('id', { count: 'exact' }),
        // Crianças
        client.from('child').select('id', { count: 'exact' }),
        // Todas as escalas para filtrar
        client.from('schedule').select('id, datetime, name').order('datetime')
      ]);

      const currentDate = new Date();
      const todayDate = new Date().toISOString().split('T')[0];
      
      // Calcular escalas futuras
      const allSchedules = allSchedulesResponse.data || [];
      const upcomingSchedules = allSchedules.filter((schedule: any) => {
        const scheduleDate = new Date(schedule.datetime);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return scheduleDate >= today;
      });
      
      console.log('Debug - Estatísticas:', {
        totalUsers: usersResponse.count || 0,
        activeUsers: activeUsersResponse.count || 0,
        totalAdmins: adminsResponse.count || 0,
        totalSchedules: schedulesResponse.count || 0,
        totalClasses: classesResponse.count || 0,
        totalChildren: childrenResponse.count || 0,
        upcomingSchedules: upcomingSchedules.length,
        currentDateUTC: currentDate.toISOString(),
        todayDate: todayDate,
        currentDateLocal: currentDate.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
        allSchedules: allSchedules
      });

      setStats({
        totalUsers: usersResponse.count || 0,
        activeUsers: activeUsersResponse.count || 0,
        totalAdmins: adminsResponse.count || 0,
        totalSchedules: schedulesResponse.count || 0,
        totalClasses: classesResponse.count || 0,
        totalChildren: childrenResponse.count || 0,
        upcomingSchedules: upcomingSchedules.length,
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      setStats(prev => ({
        ...prev,
        loading: false,
        error: 'Erro ao carregar estatísticas'
      }));
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    ...stats,
    refetch: fetchStats
  };
}; 
import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import type { NetworkNode, UserRanking, UserStats, ActivityItem } from '../types/database.types';

export interface UseReportsReturn {
  network: NetworkNode[];
  ranking: UserRanking[];
  stats: UserStats | null;
  activity: ActivityItem[];
  isLoading: boolean;
  error: string | null;
  fetchNetwork: () => Promise<void>;
  fetchRanking: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchActivity: (limit?: number) => Promise<void>;
}

export function useReports(): UseReportsReturn {
  const { user } = useAuth();
  const [network, setNetwork] = useState<NetworkNode[]>([]);
  const [ranking, setRanking] = useState<UserRanking[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNetwork = useCallback(async () => {
    if (!user?.id) return;
    setIsLoading(true);

    try {
      // Intentar usar la función RPC si existe
      const { data, error: networkError } = await supabase
        .rpc('get_user_network', { user_uuid: user.id });

      if (networkError) {
        // Fallback: obtener referidos directos
        const { data: referrals } = await supabase
          .from('referrals')
          .select('id, first_name, last_name')
          .eq('referred_by', user.id);

        const fallbackNetwork: NetworkNode[] = ((referrals as any) || []).map((r: any, i: number) => ({
          id: r.id,
          first_name: r.first_name,
          last_name: r.last_name,
          level: 1,
          parent_id: user.id,
          children_count: 0
        }));

        setNetwork(fallbackNetwork);
      } else {
        setNetwork((data as any) || []);
      }
    } catch (err) {
      console.error('Error in fetchNetwork:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const fetchRanking = useCallback(async () => {
    setIsLoading(true);

    try {
      // Intentar usar la función RPC si existe
      const { data, error: rankingError } = await supabase
        .rpc('get_user_ranking', { limit_count: 20 });

      if (rankingError) {
        // Fallback: obtener usuarios ordenados por referidos
        const { data: users } = await supabase
          .from('users')
          .select('id, first_name, last_name, referral_code, municipality')
          .limit(20);

        const fallbackRanking: UserRanking[] = ((users as any) || []).map((u: any, i: number) => ({
          id: u.id,
          first_name: u.first_name,
          last_name: u.last_name,
          referral_code: u.referral_code,
          municipality: u.municipality,
          total_referrals: 0,
          network_size: 0,
          rank: i + 1
        }));

        setRanking(fallbackRanking);
      } else {
        // Mapear datos de RPC al formato esperado
        const mappedRanking: UserRanking[] = ((data as any) || []).map((r: any, i: number) => ({
          id: r.user_id || r.id,
          first_name: r.name?.split(' ')[0] || '',
          last_name: r.name?.split(' ').slice(1).join(' ') || '',
          referral_code: r.referral_code,
          total_referrals: r.direct_count || 0,
          network_size: r.network_count || 0,
          rank: r.rank || i + 1
        }));
        setRanking(mappedRanking);

        // Encontrar ranking del usuario actual
        if (user?.id) {
          const userRank = mappedRanking.find(r => r.id === user.id);
          if (userRank) {
            setStats(prev => prev ? { ...prev, userRank: userRank.rank } : null);
          }
        }
      }
    } catch (err) {
      console.error('Error in fetchRanking:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const fetchStats = useCallback(async () => {
    if (!user?.id) return;
    setIsLoading(true);

    try {
      // Obtener referidos directos
      const { count: directCount } = await supabase
        .from('referrals')
        .select('*', { count: 'exact', head: true })
        .eq('referred_by', user.id);

      // Obtener referidos del mes actual
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count: monthlyCount } = await supabase
        .from('referrals')
        .select('*', { count: 'exact', head: true })
        .eq('referred_by', user.id)
        .gte('created_at', startOfMonth.toISOString());

      // Obtener total de usuarios
      const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalUsers: totalUsers || 0,
        totalReferrals: directCount || 0,
        totalNetwork: directCount || 0,
        newThisMonth: monthlyCount || 0,
        userRank: 1
      });
    } catch (err) {
      console.error('Error in fetchStats:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const fetchActivity = useCallback(async (limit: number = 10) => {
    if (!user?.id) return;
    setIsLoading(true);

    try {
      const { data, error: activityError } = await supabase
        .from('activity_log')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (activityError) {
        console.error('Error fetching activity:', activityError);
        setActivity([]);
        return;
      }

      // Mapear a ActivityItem
      const mappedActivity: ActivityItem[] = ((data as any) || []).map((a: any) => ({
        id: a.id,
        user_id: a.user_id,
        action_type: a.action,
        description: a.description,
        metadata: a.metadata,
        created_at: a.created_at
      }));

      setActivity(mappedActivity);
    } catch (err) {
      console.error('Error in fetchActivity:', err);
      setActivity([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  return {
    network,
    ranking,
    stats,
    activity,
    isLoading,
    error,
    fetchNetwork,
    fetchRanking,
    fetchStats,
    fetchActivity
  };
}


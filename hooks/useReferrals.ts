import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import type { Referral, ReferralInsert } from '../types/database.types';

interface UseReferralsReturn {
  referrals: Referral[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  addReferral: (data: Omit<ReferralInsert, 'referred_by'>) => Promise<{ success: boolean; error?: string }>;
  updateReferral: (id: string, data: Partial<Referral>) => Promise<boolean>;
  deleteReferral: (id: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function useReferrals(): UseReferralsReturn {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchReferrals = useCallback(async () => {
    if (!user?.id) {
      setReferrals([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError, count } = await supabase
        .from('referrals')
        .select('*', { count: 'exact' })
        .eq('referred_by', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      setReferrals(data || []);
      setTotalCount(count || 0);
    } catch (err) {
      console.error('Error fetching referrals:', err);
      setError('Error al cargar referidos');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchReferrals();
  }, [fetchReferrals]);

  // Suscripción en tiempo real
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('referrals-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'referrals',
          filter: `referred_by=eq.${user.id}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setReferrals(prev => [payload.new as Referral, ...prev]);
            setTotalCount(prev => prev + 1);
          } else if (payload.eventType === 'UPDATE') {
            setReferrals(prev => 
              prev.map(r => r.id === payload.new.id ? payload.new as Referral : r)
            );
          } else if (payload.eventType === 'DELETE') {
            setReferrals(prev => prev.filter(r => r.id !== payload.old.id));
            setTotalCount(prev => prev - 1);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const addReferral = async (data: Omit<ReferralInsert, 'referred_by'>) => {
    if (!user?.id) {
      return { success: false, error: 'Usuario no autenticado' };
    }

    try {
      // Verificar si ya existe el referido
      const { data: existing } = await supabase
        .from('referrals')
        .select('id')
        .eq('identification', data.identification)
        .single();

      if (existing) {
        return { success: false, error: 'Esta persona ya está registrada' };
      }

      const { error: insertError } = await supabase
        .from('referrals')
        .insert({
          ...data,
          referred_by: user.id
        });

      if (insertError) {
        return { success: false, error: insertError.message };
      }

      // Registrar actividad
      await supabase.from('activity_log').insert({
        user_id: user.id,
        action: 'add_referral',
        entity_type: 'referral',
        description: `Registraste a ${data.first_name} ${data.last_name}`
      });

      return { success: true };
    } catch (err) {
      console.error('Error adding referral:', err);
      return { success: false, error: 'Error al registrar referido' };
    }
  };

  const updateReferral = async (id: string, data: Partial<Referral>) => {
    try {
      const { error: updateError } = await supabase
        .from('referrals')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (updateError) {
        setError(updateError.message);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Error updating referral:', err);
      return false;
    }
  };

  const deleteReferral = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('referrals')
        .delete()
        .eq('id', id);

      if (deleteError) {
        setError(deleteError.message);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Error deleting referral:', err);
      return false;
    }
  };

  return {
    referrals,
    isLoading,
    error,
    totalCount,
    addReferral,
    updateReferral,
    deleteReferral,
    refetch: fetchReferrals
  };
}

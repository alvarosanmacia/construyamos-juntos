import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import type { User } from '../types/database.types';

interface UpdateResult {
  success: boolean;
  error?: string;
}

interface UseProfileReturn {
  isUpdating: boolean;
  error: string | null;
  updateProfile: (data: Partial<User>) => Promise<UpdateResult>;
  updateAvatar: (file: File) => Promise<string | null>;
}

export function useProfile(): UseProfileReturn {
  const { user, fetchUser } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = useCallback(async (data: Partial<User>): Promise<UpdateResult> => {
    if (!user?.id) return { success: false, error: 'No autenticado' };

    setIsUpdating(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from('users')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) {
        setError(updateError.message);
        return { success: false, error: updateError.message };
      }

      // Refrescar datos del usuario
      await fetchUser();
      return { success: true };
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Error al actualizar perfil');
      return { success: false, error: 'Error al actualizar perfil' };
    } finally {
      setIsUpdating(false);
    }
  }, [user?.id, fetchUser]);

  const updateAvatar = useCallback(async (file: File) => {
    if (!user?.id) return null;

    setIsUpdating(true);
    setError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Subir imagen a Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        setError(uploadError.message);
        return null;
      }

      // Obtener URL pública
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const avatarUrl = urlData.publicUrl;

      // Actualizar perfil con nueva URL
      await updateProfile({ avatar_url: avatarUrl });

      return avatarUrl;
    } catch (err) {
      console.error('Error uploading avatar:', err);
      setError('Error al subir imagen');
      return null;
    } finally {
      setIsUpdating(false);
    }
  }, [user?.id, updateProfile]);

  return {
    isUpdating,
    error,
    updateProfile,
    updateAvatar
  };
}

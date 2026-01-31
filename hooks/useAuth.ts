import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase, generateSyntheticEmail } from '../lib/supabase';
import type { UserWithStats } from '../types/database.types';
import type { Session } from '@supabase/supabase-js';

interface AuthState {
  user: UserWithStats | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  
  // Actions
  login: (identification: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>;
  fetchUser: () => Promise<void>;
  clearError: () => void;
}

interface RegisterData {
  identification: string;
  firstName: string;
  lastName: string;
  phone?: string;
  department?: string;
  municipality: string;
  zone?: string;
  neighborhood?: string;
  birthDate?: string;
  occupation?: string;
  referralCode?: string; // Código del referidor
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,

      login: async (identification: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const email = generateSyntheticEmail(identification);
          
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          });

          if (error) {
            set({ 
              isLoading: false, 
              error: error.message === 'Invalid login credentials' 
                ? 'Identificación o contraseña incorrecta' 
                : error.message 
            });
            return false;
          }

          if (data.user) {
            // Obtener perfil del usuario
            const { data: profile, error: profileError } = await supabase
              .from('users')
              .select('*')
              .eq('auth_id', data.user.id)
              .single();

            if (profileError) {
              console.error('Error fetching profile:', profileError);
              set({ isLoading: false, error: 'Error al cargar perfil' });
              return false;
            }

            // Obtener conteo de referidos
            const { count: referralCount } = await supabase
              .from('referrals')
              .select('*', { count: 'exact', head: true })
              .eq('referred_by', (profile as any)?.id);

            set({ 
              user: {
                ...(profile as any),
                total_referrals: referralCount || 0,
                network_size: referralCount || 0
              },
              session: data.session,
              isAuthenticated: true,
              isLoading: false,
              error: null
            });
            return true;
          }

          set({ isLoading: false });
          return false;
        } catch (err) {
          console.error('Login error:', err);
          set({ 
            isLoading: false, 
            error: 'Error de conexión. Intenta de nuevo.' 
          });
          return false;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        await supabase.auth.signOut();
        set({ 
          user: null, 
          session: null, 
          isAuthenticated: false, 
          isLoading: false,
          error: null
        });
      },

      register: async (userData: RegisterData) => {
        set({ isLoading: true, error: null });

        try {
          const email = generateSyntheticEmail(userData.identification);
          const password = userData.identification; // Contraseña = identificación

          // 1. Buscar referidor si hay código
          let parentUserId: string | null = null;
          if (userData.referralCode) {
            const { data: referrer, error: referrerError } = await supabase
              .from('users')
              .select('id')
              .eq('referral_code', userData.referralCode)
              .single();

            if (referrerError || !referrer) {
              set({ isLoading: false, error: 'Código de referido inválido' });
              return { success: false, error: 'Código de referido inválido' };
            }
            parentUserId = (referrer as any).id;
          }

          // 2. Crear usuario en Auth
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/`
            }
          });

          if (authError) {
            const errorMsg = authError.message.includes('already registered')
              ? 'Esta identificación ya está registrada'
              : authError.message;
            set({ isLoading: false, error: errorMsg });
            return { success: false, error: errorMsg };
          }

          if (!authData.user) {
            set({ isLoading: false, error: 'Error al crear usuario' });
            return { success: false, error: 'Error al crear usuario' };
          }

          // 3. Generar código de referido único
          const { data: refCode, error: refCodeError } = await supabase
            .rpc('generate_referral_code');

          if (refCodeError) {
            console.error('Error generating referral code:', refCodeError);
          }

          const referralCode = refCode || `GGF-${userData.identification.slice(-6).toUpperCase()}`;

          // 4. Crear perfil en tabla users
          const { data: profile, error: profileError } = await supabase
            .from('users')
            .insert({
              auth_id: authData.user.id,
              identification: userData.identification,
              email,
              phone: userData.phone || null,
              first_name: userData.firstName,
              last_name: userData.lastName,
              referral_code: referralCode,
              parent_user_id: parentUserId,
              department: userData.department || null,
              municipality: userData.municipality,
              zone: userData.zone || null,
              neighborhood: userData.neighborhood || null,
              birth_date: userData.birthDate || null,
              occupation: userData.occupation || null,
              role: 'volunteer'
            })
            .select()
            .single();

          if (profileError) {
            console.error('Profile creation error:', profileError);
            // Intentar eliminar usuario de auth si falla el perfil
            set({ isLoading: false, error: 'Error al crear perfil' });
            return { success: false, error: 'Error al crear perfil' };
          }

          // 5. Registrar actividad
          if (parentUserId && profile) {
            await supabase.from('activity_log').insert({
              user_id: parentUserId,
              action: 'new_referral',
              entity_type: 'user',
              entity_id: (profile as any).id,
              description: `${userData.firstName} ${userData.lastName} se unió a tu red`
            });
          }

          // 6. Auto-login
          set({ 
            user: profile as any,
            session: authData.session,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

          return { success: true };
        } catch (err) {
          console.error('Registration error:', err);
          set({ isLoading: false, error: 'Error de conexión' });
          return { success: false, error: 'Error de conexión' };
        }
      },

      fetchUser: async () => {
        set({ isLoading: true });
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('auth_id', session.user.id)
            .single();

          set({ 
            user: profile,
            session,
            isAuthenticated: !!profile,
            isLoading: false
          });
        } else {
          set({ 
            user: null,
            session: null,
            isAuthenticated: false,
            isLoading: false
          });
        }
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
);

// Listener para cambios de sesión
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_OUT') {
    useAuth.setState({ 
      user: null, 
      session: null, 
      isAuthenticated: false 
    });
  } else if (event === 'SIGNED_IN' && session) {
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', session.user.id)
      .single();

    if (profile) {
      useAuth.setState({ 
        user: profile, 
        session, 
        isAuthenticated: true 
      });
    }
  }
});

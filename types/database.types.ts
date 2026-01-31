export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          auth_id: string | null
          identification: string
          email: string | null
          phone: string | null
          first_name: string
          last_name: string
          role: 'admin' | 'coordinator' | 'volunteer'
          referral_code: string
          parent_user_id: string | null
          department: string | null
          municipality: string | null
          zone: string | null
          neighborhood: string | null
          birth_date: string | null
          occupation: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          auth_id?: string | null
          identification: string
          email?: string | null
          phone?: string | null
          first_name: string
          last_name: string
          role?: 'admin' | 'coordinator' | 'volunteer'
          referral_code: string
          parent_user_id?: string | null
          department?: string | null
          municipality?: string | null
          zone?: string | null
          neighborhood?: string | null
          birth_date?: string | null
          occupation?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          auth_id?: string | null
          identification?: string
          email?: string | null
          phone?: string | null
          first_name?: string
          last_name?: string
          role?: 'admin' | 'coordinator' | 'volunteer'
          referral_code?: string
          parent_user_id?: string | null
          department?: string | null
          municipality?: string | null
          zone?: string | null
          neighborhood?: string | null
          birth_date?: string | null
          occupation?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      referrals: {
        Row: {
          id: string
          identification: string
          first_name: string
          last_name: string
          gender: 'M' | 'F' | 'O' | null
          birth_date: string | null
          phone: string | null
          email: string | null
          department: string | null
          municipality: string
          zone: 'Urbana' | 'Rural' | null
          neighborhood: string | null
          occupation: string | null
          status: 'active' | 'pending' | 'inactive'
          referred_by: string
          user_id: string | null
          terms_accepted: boolean
          privacy_accepted: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          identification: string
          first_name: string
          last_name: string
          gender?: 'M' | 'F' | 'O' | null
          birth_date?: string | null
          phone?: string | null
          email?: string | null
          department?: string | null
          municipality: string
          zone?: 'Urbana' | 'Rural' | null
          neighborhood?: string | null
          occupation?: string | null
          status?: 'active' | 'pending' | 'inactive'
          referred_by: string
          user_id?: string | null
          terms_accepted?: boolean
          privacy_accepted?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          identification?: string
          first_name?: string
          last_name?: string
          gender?: 'M' | 'F' | 'O' | null
          birth_date?: string | null
          phone?: string | null
          email?: string | null
          department?: string | null
          municipality?: string
          zone?: 'Urbana' | 'Rural' | null
          neighborhood?: string | null
          occupation?: string | null
          status?: 'active' | 'pending' | 'inactive'
          referred_by?: string
          user_id?: string | null
          terms_accepted?: boolean
          privacy_accepted?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      activity_log: {
        Row: {
          id: string
          user_id: string
          action: string
          entity_type: string
          entity_id: string | null
          description: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          action: string
          entity_type: string
          entity_id?: string | null
          description?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          action?: string
          entity_type?: string
          entity_id?: string | null
          description?: string | null
          metadata?: Json | null
          created_at?: string
        }
      }
      municipalities: {
        Row: {
          id: number
          department: string
          name: string
        }
        Insert: {
          id?: number
          department: string
          name: string
        }
        Update: {
          id?: number
          department?: string
          name?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_referral_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_network: {
        Args: {
          user_uuid: string
        }
        Returns: {
          id: string
          name: string
          level: number
          parent_id: string | null
          referral_count: number
        }[]
      }
      get_user_ranking: {
        Args: {
          limit_count?: number
        }
        Returns: {
          user_id: string
          name: string
          referral_code: string
          direct_count: number
          rank: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Tipos auxiliares
export type User = Database['public']['Tables']['users']['Row']
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type Referral = Database['public']['Tables']['referrals']['Row']
export type ReferralInsert = Database['public']['Tables']['referrals']['Insert']
export type ActivityLog = Database['public']['Tables']['activity_log']['Row']
export type Municipality = Database['public']['Tables']['municipalities']['Row']

// Usuario con propiedades calculadas (para el frontend)
export interface UserWithStats extends User {
  total_referrals?: number
  network_size?: number
}

export interface NetworkNode {
  id: string
  first_name?: string
  last_name?: string
  name?: string
  level: number
  parent_id: string | null
  referral_count?: number
  children_count?: number
}

export interface UserRanking {
  id: string
  user_id?: string
  first_name: string
  last_name: string
  name?: string
  referral_code: string
  municipality?: string
  total_referrals: number
  network_size: number
  direct_count?: number
  rank: number
}

export interface UserStats {
  totalUsers: number
  totalReferrals: number
  totalNetwork: number
  newThisMonth: number
  userRank: number
}

export interface ActivityItem {
  id: string
  user_id: string
  user_first_name?: string
  user_last_name?: string
  action_type: string
  description?: string
  metadata?: Record<string, any>
  created_at: string
}

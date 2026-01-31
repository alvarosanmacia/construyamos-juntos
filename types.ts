export interface User {
  id: string;
  name: string;
  role: 'admin' | 'coordinator' | 'volunteer';
  referralCode: string;
  referrals: number;
  totalNetwork: number;
  email: string;
  phone: string;
}

export interface Referral {
  id: string;
  identification: string;
  firstName: string;
  lastName: string;
  phone: string;
  municipality: string;
  zone: string;
  neighborhood: string;
  birthDate: string;
  status: 'active' | 'pending';
  parentId: string;
  dateAdded: string;
}

export interface NetworkNode {
  id: string;
  name: string;
  group: number; // Level in hierarchy
  children?: NetworkNode[];
}

export type ViewState = 'login' | 'dashboard' | 'register' | 'reports' | 'profile' | 'network';

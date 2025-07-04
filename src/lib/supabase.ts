import { createClient } from '@supabase/supabase-js';

// Fallback values for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Проверяем наличие переменных окружения
if (!supabaseUrl || supabaseUrl === 'https://your-project.supabase.co') {
  console.error('Missing VITE_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey || supabaseAnonKey === 'your-anon-key') {
  console.error('Missing VITE_SUPABASE_ANON_KEY environment variable');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Types for database tables
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

export interface SiteContent {
  id: string;
  section: string;
  key: string;
  value: any;
  created_at: string;
  updated_at: string;
}

export interface House {
  id: string;
  name: string;
  area: number;
  rooms: number;
  rent_price: number;
  buy_price: number;
  images: string[];
  description: string;
  materials: string[];
  features: string[];
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id: string;
  key: string;
  value: any;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  house: string;
  check_in: string;
  check_out: string;
  name: string;
  phone: string;
  email: string;
  message?: string;
  status: 'new' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
  updated_at: string;
}
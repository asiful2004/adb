
export enum UserRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  CLIENT = 'CLIENT'
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
  avatarUrl?: string;
  password?: string; // For local management simulation
}

export interface BrandingConfig {
  title: string;
  logoUrl: string;
  faviconUrl: string;
}

export interface DatabaseConfig {
  host: string;
  user: string;
  pass: string;
  name: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  DISABLED = 'DISABLED'
}

export enum ValorantStatus {
  SOLD = 'SOLD',
  UNSOLD = 'UNSOLD'
}

export interface GoogleAccount {
  id: string;
  gmail_id: string;
  gmail_password: string;
  backup_email?: string;
  subscription_phase: string;
  plan_duration: '1_MONTH' | '1_YEAR';
  start_date: string;
  end_date: string;
  notes?: string;
  status: SubscriptionStatus;
}

export interface AppleAccount {
  id: string;
  apple_id: string;
  apple_password: string;
  security_q1: string;
  security_q2: string;
  security_q3: string;
  balance: number;
  linked_gmail_id?: string;
  notes?: string;
  status: SubscriptionStatus;
}

export interface ClientWorkspace {
  id: string;
  name: string;
  slug: string;
  totalPaid: number;
  cost: number;
  notes?: string;
}

export interface ValorantAccount {
  id: string;
  username: string;
  password: string;
  email: string;
  backup_email?: string;
  price: number;
  level: number;
  status: ValorantStatus;
  notes?: string;
}

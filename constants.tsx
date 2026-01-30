
import { 
  LayoutDashboard, 
  Youtube, 
  Apple, 
  Users, 
  CreditCard, 
  Wallet, 
  ShieldCheck, 
  Box, 
  TrendingUp, 
  Gamepad2,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Copy,
  Edit,
  Trash2,
  FileDown,
  FileUp,
  Menu,
  X,
  Shield,
  Fingerprint,
  Layers,
  Zap,
  Activity
} from 'lucide-react';
import { UserRole } from './types';

export const COLORS = {
  abyss: '#09090b',
  layer: '#18181b',
  grid: '#27272a',
  electric: '#06b6d4',
  flow: '#10b981',
  radiant: '#f97316',
  matrix: '#a855f7',
  pulse: '#f59e0b',
  shadow: '#71717a'
};

export const ICONS = {
  Dashboard: LayoutDashboard,
  Volmerix: Youtube,
  Apple: Apple,
  Clients: Users,
  Arodx: CreditCard,
  Zynra: Wallet,
  Valorant: Gamepad2,
  Settings: Settings,
  LogOut: LogOut,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Copy,
  Edit,
  Trash2,
  FileDown,
  FileUp,
  Menu,
  X,
  Stock: Box,
  Profits: TrendingUp,
  Security: ShieldCheck,
  Google: Shield,
  Fingerprint,
  Layers,
  Zap,
  Activity
};

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path?: string;
  roles: UserRole[];
  children?: {
    id: string;
    label: string;
    path: string;
    icon: string;
    roles: UserRole[];
  }[];
}

export const NAV_ITEMS: NavItem[] = [
  { 
    id: 'dashboard', 
    label: 'Dashboard', 
    icon: 'Dashboard', 
    path: '/', 
    roles: [UserRole.OWNER, UserRole.ADMIN, UserRole.STAFF] 
  },
  { 
    id: 'volmerix', 
    label: 'Volmerix Core', 
    icon: 'Volmerix', 
    roles: [UserRole.OWNER, UserRole.ADMIN, UserRole.STAFF],
    children: [
      { id: 'vol-google', label: 'Google Data', path: '/volmerix/google', icon: 'Google', roles: [UserRole.OWNER, UserRole.ADMIN, UserRole.STAFF] },
      { id: 'vol-apple', label: 'Apple Vault', path: '/volmerix/apple', icon: 'Apple', roles: [UserRole.OWNER, UserRole.ADMIN, UserRole.STAFF] },
      { id: 'vol-clients', label: 'Clients', path: '/volmerix/clients', icon: 'Clients', roles: [UserRole.OWNER, UserRole.ADMIN] },
    ]
  },
  { 
    id: 'arodx', 
    label: 'Arodx Hub', 
    icon: 'Arodx', 
    roles: [UserRole.OWNER, UserRole.ADMIN, UserRole.STAFF],
    children: [
      { id: 'aro-subs', label: 'Subscriptions', path: '/arodx/subscriptions', icon: 'Zap', roles: [UserRole.OWNER, UserRole.ADMIN, UserRole.STAFF] },
      { id: 'aro-stock', label: 'Stock Levels', path: '/arodx/stock', icon: 'Stock', roles: [UserRole.OWNER, UserRole.ADMIN, UserRole.STAFF] },
    ]
  },
  { 
    id: 'zynra', 
    label: 'Zynra Wallet', 
    icon: 'Zynra', 
    path: '/zynra', 
    roles: [UserRole.OWNER, UserRole.ADMIN] 
  },
  { 
    id: 'valorant', 
    label: 'Valo Depot', 
    icon: 'Valorant', 
    path: '/valorant', 
    roles: [UserRole.OWNER, UserRole.ADMIN, UserRole.STAFF] 
  },
];

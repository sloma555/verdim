export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  isDefault: boolean;
}

export interface IncomeSource {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  categoryId: string | null;
  paymentMethod: string | null;
  incomeSourceId: string | null;
  date: string; // ISO
  createdAt: string;
  updatedAt: string;
}

export interface FixedExpense {
  id: string;
  name: string;
  amount: number;
  categoryId: string;
  paymentMethod: string;
  dueDate: string; // ISO
  recurrence: 'monthly';
  paid: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryLimit {
  categoryId: string;
  monthKey: string; // YYYY-MM
  limitAmount: number;
}

export interface UserSettings {
  theme: 'dark' | 'light';
  currency: string;
  monthStartDay: number;
}

export const DEFAULT_CATEGORIES: Omit<Category, 'id'>[] = [
  { name: 'Mercado', color: '#22c55e', icon: '🛒', isDefault: true },
  { name: 'Necessidades', color: '#3b82f6', icon: '📦', isDefault: true },
  { name: 'Eletrônicos', color: '#8b5cf6', icon: '💻', isDefault: true },
  { name: 'Assinaturas', color: '#ec4899', icon: '📱', isDefault: true },
  { name: 'Roupa', color: '#f59e0b', icon: '👕', isDefault: true },
  { name: 'Beleza', color: '#d946ef', icon: '💅', isDefault: true },
  { name: 'Presentes', color: '#f43f5e', icon: '🎁', isDefault: true },
  { name: 'Saúde', color: '#14b8a6', icon: '🏥', isDefault: true },
  { name: 'Despesas Eventuais', color: '#6366f1', icon: '💸', isDefault: true },
  { name: 'Desenvolvimento', color: '#06b6d4', icon: '📚', isDefault: true },
  { name: 'Uber/Transporte', color: '#64748b', icon: '🚗', isDefault: true },
  { name: 'iFood/Restaurante', color: '#ef4444', icon: '🍔', isDefault: true },
  { name: 'Lazer', color: '#a855f7', icon: '🎮', isDefault: true },
  { name: 'Aluguel', color: '#0ea5e9', icon: '🏠', isDefault: true },
  { name: 'Contas', color: '#eab308', icon: '📄', isDefault: true },
  { name: 'Outros', color: '#94a3b8', icon: '📌', isDefault: true },
];

export const PAYMENT_METHODS = [
  'Dinheiro',
  'Cartão de Crédito',
  'Cartão de Débito',
  'PIX',
  'Transferência',
  'Boleto',
];

export type ThermometerStatus = 'safe' | 'warning' | 'critical' | 'exceeded';

export function getThermometerStatus(percentage: number): ThermometerStatus {
  if (percentage > 100) return 'exceeded';
  if (percentage > 90) return 'critical';
  if (percentage > 60) return 'warning';
  return 'safe';
}

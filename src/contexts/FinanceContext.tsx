import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Category, Transaction, FixedExpense, CategoryLimit, UserSettings, IncomeSource, DEFAULT_CATEGORIES } from '@/types/finance';
import { format } from 'date-fns';
import { db } from '@/lib/firebase';
import {
  collection, doc, setDoc, deleteDoc, onSnapshot, writeBatch, getDoc
} from 'firebase/firestore';

function generateId() {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

interface FinanceContextType {
  categories: Category[];
  transactions: Transaction[];
  fixedExpenses: FixedExpense[];
  limits: CategoryLimit[];
  incomeSources: IncomeSource[];
  settings: UserSettings;
  selectedMonth: string;
  loading: boolean;

  setSelectedMonth: (m: string) => void;

  addCategory: (cat: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, cat: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  addTransaction: (t: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTransaction: (id: string, t: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  addFixedExpense: (f: Omit<FixedExpense, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateFixedExpense: (id: string, f: Partial<FixedExpense>) => void;
  deleteFixedExpense: (id: string) => void;

  addIncomeSource: (s: Omit<IncomeSource, 'id'>) => void;
  updateIncomeSource: (id: string, s: Partial<IncomeSource>) => void;
  deleteIncomeSource: (id: string) => void;

  setLimit: (categoryId: string, monthKey: string, amount: number) => void;
  getLimit: (categoryId: string, monthKey: string) => number;

  updateSettings: (s: Partial<UserSettings>) => void;

  getMonthTransactions: () => Transaction[];
  getMonthFixedExpenses: () => FixedExpense[];
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  getTotalFixed: () => number;
  getBalance: () => number;
  getCategorySpent: (categoryId: string) => number;
  getIncomeBySource: (sourceId: string) => number;
}

const FinanceContext = createContext<FinanceContextType | null>(null);

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error('useFinance must be inside FinanceProvider');
  return ctx;
}

// Helper: Firestore paths
function userCol(uid: string, col: string) {
  return collection(db, 'users', uid, col);
}
function userDoc(uid: string, col: string, id: string) {
  return doc(db, 'users', uid, col, id);
}
function settingsDoc(uid: string) {
  return doc(db, 'users', uid, 'settings', 'main');
}

export function FinanceProvider({ children, uid }: { children: React.ReactNode; uid: string }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([]);
  const [limits, setLimits] = useState<CategoryLimit[]>([]);
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([]);
  const [settings, setSettings] = useState<UserSettings>({ theme: 'dark', currency: 'BRL', monthStartDay: 1 });
  const [selectedMonth, setSelectedMonth] = useState(() => format(new Date(), 'yyyy-MM'));
  const [loading, setLoading] = useState(true);

  // Initialize default categories if user has none
  useEffect(() => {
    async function initDefaults() {
      const snap = await getDoc(doc(db, 'users', uid, 'categories', '__init__'));
      // Check if user already has categories by listening once
      const catCol = userCol(uid, 'categories');
      const unsub = onSnapshot(catCol, async (snapshot) => {
        unsub(); // only once
        if (snapshot.empty) {
          const batch = writeBatch(db);
          DEFAULT_CATEGORIES.forEach(c => {
            const id = generateId();
            batch.set(doc(catCol, id), { ...c, id });
          });
          await batch.commit();
        }
      });
    }
    initDefaults();
  }, [uid]);

  // Real-time listeners
  useEffect(() => {
    const unsubs: (() => void)[] = [];
    let loadedCount = 0;
    const checkLoaded = () => { loadedCount++; if (loadedCount >= 6) setLoading(false); };

    unsubs.push(onSnapshot(userCol(uid, 'categories'), (snap) => {
      setCategories(snap.docs.map(d => d.data() as Category));
      checkLoaded();
    }));

    unsubs.push(onSnapshot(userCol(uid, 'transactions'), (snap) => {
      setTransactions(snap.docs.map(d => d.data() as Transaction));
      checkLoaded();
    }));

    unsubs.push(onSnapshot(userCol(uid, 'fixedExpenses'), (snap) => {
      setFixedExpenses(snap.docs.map(d => d.data() as FixedExpense));
      checkLoaded();
    }));

    unsubs.push(onSnapshot(userCol(uid, 'limits'), (snap) => {
      setLimits(snap.docs.map(d => d.data() as CategoryLimit));
      checkLoaded();
    }));

    unsubs.push(onSnapshot(settingsDoc(uid), (snap) => {
      if (snap.exists()) {
        setSettings(snap.data() as UserSettings);
      }
      checkLoaded();
    }));

    unsubs.push(onSnapshot(userCol(uid, 'incomeSources'), (snap) => {
      setIncomeSources(snap.docs.map(d => d.data() as IncomeSource));
      checkLoaded();
    }));

    return () => unsubs.forEach(u => u());
  }, [uid]);

  // Theme
  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.theme === 'dark');
  }, [settings.theme]);

  // Categories
  const addCategory = useCallback((cat: Omit<Category, 'id'>) => {
    const id = generateId();
    setDoc(userDoc(uid, 'categories', id), { ...cat, id });
  }, [uid]);
  const updateCategory = useCallback((id: string, cat: Partial<Category>) => {
    setDoc(userDoc(uid, 'categories', id), cat, { merge: true });
  }, [uid]);
  const deleteCategory = useCallback((id: string) => {
    deleteDoc(userDoc(uid, 'categories', id));
  }, [uid]);

  // Transactions
  const addTransaction = useCallback((t: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = generateId();
    const now = new Date().toISOString();
    setDoc(userDoc(uid, 'transactions', id), { ...t, id, createdAt: now, updatedAt: now });
  }, [uid]);
  const updateTransaction = useCallback((id: string, t: Partial<Transaction>) => {
    setDoc(userDoc(uid, 'transactions', id), { ...t, updatedAt: new Date().toISOString() }, { merge: true });
  }, [uid]);
  const deleteTransaction = useCallback((id: string) => {
    deleteDoc(userDoc(uid, 'transactions', id));
  }, [uid]);

  // Fixed Expenses
  const addFixedExpense = useCallback((f: Omit<FixedExpense, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = generateId();
    const now = new Date().toISOString();
    setDoc(userDoc(uid, 'fixedExpenses', id), { ...f, id, createdAt: now, updatedAt: now });
  }, [uid]);
  const updateFixedExpense = useCallback((id: string, f: Partial<FixedExpense>) => {
    setDoc(userDoc(uid, 'fixedExpenses', id), { ...f, updatedAt: new Date().toISOString() }, { merge: true });
  }, [uid]);
  const deleteFixedExpense = useCallback((id: string) => {
    deleteDoc(userDoc(uid, 'fixedExpenses', id));
  }, [uid]);

  // Income Sources
  const addIncomeSource = useCallback((s: Omit<IncomeSource, 'id'>) => {
    const id = generateId();
    setDoc(userDoc(uid, 'incomeSources', id), { ...s, id });
  }, [uid]);
  const updateIncomeSource = useCallback((id: string, s: Partial<IncomeSource>) => {
    setDoc(userDoc(uid, 'incomeSources', id), s, { merge: true });
  }, [uid]);
  const deleteIncomeSource = useCallback((id: string) => {
    deleteDoc(userDoc(uid, 'incomeSources', id));
  }, [uid]);

  // Limits
  const setLimit = useCallback((categoryId: string, monthKey: string, amount: number) => {
    const id = `${categoryId}_${monthKey}`;
    setDoc(userDoc(uid, 'limits', id), { categoryId, monthKey, limitAmount: amount });
  }, [uid]);
  const getLimit = useCallback((categoryId: string, monthKey: string) => {
    return limits.find(l => l.categoryId === categoryId && l.monthKey === monthKey)?.limitAmount || 0;
  }, [limits]);

  // Settings
  const updateSettings = useCallback((s: Partial<UserSettings>) => {
    const newSettings = { ...settings, ...s };
    setDoc(settingsDoc(uid), newSettings);
  }, [uid, settings]);

  // Computed
  const getMonthTransactions = useCallback(() => {
    return transactions.filter(t => t.date.startsWith(selectedMonth));
  }, [transactions, selectedMonth]);

  const getMonthFixedExpenses = useCallback(() => {
    return fixedExpenses.filter(f => f.dueDate.startsWith(selectedMonth));
  }, [fixedExpenses, selectedMonth]);

  const getTotalIncome = useCallback(() => {
    return getMonthTransactions().filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  }, [getMonthTransactions]);

  const getTotalExpenses = useCallback(() => {
    return getMonthTransactions().filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  }, [getMonthTransactions]);

  const getTotalFixed = useCallback(() => {
    return getMonthFixedExpenses().reduce((s, f) => s + f.amount, 0);
  }, [getMonthFixedExpenses]);

  const getBalance = useCallback(() => {
    return getTotalIncome() - getTotalExpenses() - getTotalFixed();
  }, [getTotalIncome, getTotalExpenses, getTotalFixed]);

  const getCategorySpent = useCallback((categoryId: string) => {
    const fromTx = getMonthTransactions().filter(t => t.type === 'expense' && t.categoryId === categoryId).reduce((s, t) => s + t.amount, 0);
    const fromFixed = getMonthFixedExpenses().filter(f => f.categoryId === categoryId).reduce((s, f) => s + f.amount, 0);
    return fromTx + fromFixed;
  }, [getMonthTransactions, getMonthFixedExpenses]);

  const getIncomeBySource = useCallback((sourceId: string) => {
    return getMonthTransactions().filter(t => t.type === 'income' && t.incomeSourceId === sourceId).reduce((s, t) => s + t.amount, 0);
  }, [getMonthTransactions]);

  return (
    <FinanceContext.Provider value={{
      categories, transactions, fixedExpenses, limits, incomeSources, settings, selectedMonth, loading,
      setSelectedMonth, addCategory, updateCategory, deleteCategory,
      addTransaction, updateTransaction, deleteTransaction,
      addFixedExpense, updateFixedExpense, deleteFixedExpense,
      addIncomeSource, updateIncomeSource, deleteIncomeSource,
      setLimit, getLimit, updateSettings,
      getMonthTransactions, getMonthFixedExpenses,
      getTotalIncome, getTotalExpenses, getTotalFixed, getBalance, getCategorySpent, getIncomeBySource,
    }}>
      {children}
    </FinanceContext.Provider>
  );
}

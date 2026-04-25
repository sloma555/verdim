import { useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { MonthSelector } from '@/components/MonthSelector';
import { EmptyState } from '@/components/EmptyState';
import { TransactionModal } from '@/components/TransactionModal';
import { TrendingUp, TrendingDown, CalendarClock, Trash2, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Transaction } from '@/types/finance';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function OverviewPage() {
  const { getTotalIncome, getTotalExpenses, getTotalFixed, getBalance, getMonthTransactions, deleteTransaction, categories, incomeSources } = useFinance();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTx, setEditTx] = useState<Transaction | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const income = getTotalIncome();
  const expenses = getTotalExpenses();
  const fixed = getTotalFixed();
  const balance = getBalance();
  const transactions = getMonthTransactions().sort((a, b) => b.date.localeCompare(a.date));

  const getCatInfo = (id: string | null) => categories.find(c => c.id === id);
  const getSourceName = (id: string | null | undefined) => incomeSources.find(s => s.id === id);

  const formatCurrency = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="space-y-4 animate-fade-in-up">
      <MonthSelector />

      {/* Balance Card */}
      <div className="glass-card p-5 text-center">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Saldo do Mês</p>
        <p className={cn("text-3xl font-bold", balance >= 0 ? 'text-income' : 'text-expense')}>
          {formatCurrency(balance)}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="glass-card p-3 text-center">
          <TrendingUp className="w-4 h-4 mx-auto mb-1 text-income" />
          <p className="text-[10px] text-muted-foreground">Entradas</p>
          <p className="text-sm font-bold text-income">{formatCurrency(income)}</p>
        </div>
        <div className="glass-card p-3 text-center">
          <TrendingDown className="w-4 h-4 mx-auto mb-1 text-expense" />
          <p className="text-[10px] text-muted-foreground">Saídas</p>
          <p className="text-sm font-bold text-expense">{formatCurrency(expenses)}</p>
        </div>
        <div className="glass-card p-3 text-center">
          <CalendarClock className="w-4 h-4 mx-auto mb-1 text-primary" />
          <p className="text-[10px] text-muted-foreground">Fixos</p>
          <p className="text-sm font-bold text-primary">{formatCurrency(fixed)}</p>
        </div>
      </div>

      {/* Transactions */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-2">Últimas Transações</h2>
        {transactions.length === 0 ? (
          <EmptyState icon="💰" title="Nenhuma transação" description="Adicione sua primeira transação usando o botão +" />
        ) : (
          <div className="space-y-2">
            {transactions.slice(0, 20).map(tx => {
              const cat = getCatInfo(tx.categoryId);
              return (
                <div key={tx.id} className="glass-card p-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg bg-secondary">
                    {tx.type === 'income' ? (getSourceName(tx.incomeSourceId)?.icon || '💰') : cat?.icon || '📌'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{tx.description}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {tx.type === 'income' ? (getSourceName(tx.incomeSourceId)?.name || 'Receita') : (cat?.name || '')} · {format(parseISO(tx.date), 'dd MMM', { locale: ptBR })}
                    </p>
                  </div>
                  <span className={cn("text-sm font-bold whitespace-nowrap", tx.type === 'income' ? 'text-income' : 'text-expense')}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </span>
                  <div className="flex gap-1 ml-1">
                    <button onClick={() => { setEditTx(tx); setModalOpen(true); }} className="p-1.5 rounded-md hover:bg-secondary transition-colors">
                      <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                    <button onClick={() => setDeleteId(tx.id)} className="p-1.5 rounded-md hover:bg-destructive/20 transition-colors">
                      <Trash2 className="w-3.5 h-3.5 text-destructive" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <TransactionModal open={modalOpen} onClose={() => { setModalOpen(false); setEditTx(null); }} editTransaction={editTx} />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir transação?</AlertDialogTitle>
            <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (deleteId) deleteTransaction(deleteId); setDeleteId(null); }}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

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
    <div className="space-y-6 animate-fade-in-up pb-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Olá, Bem-vindo</h1>
        <p className="text-sm text-muted-foreground">Aqui está o resumo das suas finanças.</p>
      </header>

      <MonthSelector />

      {/* Balance Card */}
      <div className={cn(
        "glass-card p-6 text-center relative overflow-hidden transition-all duration-300 hover:scale-[1.02]",
        balance >= 0 ? "glow-primary" : "glow-critical"
      )}>
        <div className="relative z-10">
          <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] mb-2 font-medium">Saldo Disponível</p>
          <p className={cn("text-4xl font-extrabold tracking-tight mb-1", balance >= 0 ? 'text-income' : 'text-expense')}>
            {formatCurrency(balance)}
          </p>
        </div>
        <div className={cn(
          "absolute -right-4 -top-4 w-24 h-24 rounded-full blur-3xl opacity-20",
          balance >= 0 ? "bg-income" : "bg-expense"
        )} />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card p-4 text-center transition-transform hover:translate-y-[-2px]">
          <div className="w-8 h-8 rounded-full bg-income/10 flex items-center justify-center mx-auto mb-2">
            <TrendingUp className="w-4 h-4 text-income" />
          </div>
          <p className="text-[10px] text-muted-foreground font-medium uppercase mb-1">Entradas</p>
          <p className="text-sm font-bold text-income">{formatCurrency(income)}</p>
        </div>
        <div className="glass-card p-4 text-center transition-transform hover:translate-y-[-2px]">
          <div className="w-8 h-8 rounded-full bg-expense/10 flex items-center justify-center mx-auto mb-2">
            <TrendingDown className="w-4 h-4 text-expense" />
          </div>
          <p className="text-[10px] text-muted-foreground font-medium uppercase mb-1">Saídas</p>
          <p className="text-sm font-bold text-expense">{formatCurrency(expenses)}</p>
        </div>
        <div className="glass-card p-4 text-center transition-transform hover:translate-y-[-2px]">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
            <CalendarClock className="w-4 h-4 text-primary" />
          </div>
          <p className="text-[10px] text-muted-foreground font-medium uppercase mb-1">Fixos</p>
          <p className="text-sm font-bold text-primary">{formatCurrency(fixed)}</p>
        </div>
      </div>

      {/* Transactions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base font-bold text-foreground">Últimas Transações</h2>
          <button className="text-xs text-primary font-medium hover:underline">Ver tudo</button>
        </div>
        
        {transactions.length === 0 ? (
          <EmptyState icon="💰" title="Nenhuma transação" description="Adicione sua primeira transação usando o botão +" />
        ) : (
          <div className="space-y-3">
            {transactions.slice(0, 10).map(tx => {
              const cat = getCatInfo(tx.categoryId);
              return (
                <div key={tx.id} className="glass-card p-4 flex items-center gap-4 transition-all hover:bg-glass/90 premium-shadow">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-secondary shadow-inner">
                    {tx.type === 'income' ? (getSourceName(tx.incomeSourceId)?.icon || '💰') : cat?.icon || '📌'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate leading-none mb-1">{tx.description}</p>
                    <p className="text-[11px] text-muted-foreground font-medium">
                      {tx.type === 'income' ? (getSourceName(tx.incomeSourceId)?.name || 'Receita') : (cat?.name || '')} · {format(parseISO(tx.date), 'dd MMM', { locale: ptBR })}
                    </p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <span className={cn("text-sm font-bold tracking-tight", tx.type === 'income' ? 'text-income' : 'text-expense')}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </span>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditTx(tx); setModalOpen(true); }} className="p-1 rounded-md hover:bg-secondary transition-colors">
                        <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                      <button onClick={() => setDeleteId(tx.id)} className="p-1 rounded-md hover:bg-destructive/10 transition-colors">
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <TransactionModal open={modalOpen} onClose={() => { setModalOpen(false); setEditTx(null); }} editTransaction={editTx} />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="glass-card">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir transação?</AlertDialogTitle>
            <AlertDialogDescription>Esta ação não pode ser desfeita e removerá os dados do seu histórico.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => { if (deleteId) deleteTransaction(deleteId); setDeleteId(null); }}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-xl"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}


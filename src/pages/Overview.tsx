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
    <div className="space-y-8 animate-fade-in-up pb-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-medium tracking-tighter text-glow drop-shadow-2xl leading-none">Olá, Bem-vindo</h1>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse" />
          <span className="text-[10px] font-mono text-emerald-400/80 tracking-widest uppercase">Finanças em dia</span>
        </div>
      </header>

      <MonthSelector />

      {/* Balance Card */}
      <div className="glass-panel p-8 text-center relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[60px] rounded-full group-hover:bg-indigo-500/20 transition-all" />
        <div className="relative z-10">
          <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-4">Saldo Disponível</p>
          <p className={cn("text-6xl font-light stat-value text-glow leading-none mb-2", balance >= 0 ? 'text-white' : 'text-expense')}>
            {balance >= 0 ? formatCurrency(balance).replace('R$', '').trim() : `-${formatCurrency(Math.abs(balance)).replace('R$', '').trim()}`}
            <span className="text-2xl text-white/30 ml-2 font-normal">BRL</span>
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/[0.03] border border-white/5 rounded-[1.5rem] p-4 text-center hover:bg-white/[0.06] transition-colors duration-500 group">
          <TrendingUp className="w-5 h-5 mx-auto mb-2 text-income opacity-70 group-hover:opacity-100 transition-opacity" />
          <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1">Entradas</p>
          <p className="text-sm font-bold text-income">{formatCurrency(income)}</p>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-[1.5rem] p-4 text-center hover:bg-white/[0.06] transition-colors duration-500 group">
          <TrendingDown className="w-5 h-5 mx-auto mb-2 text-expense opacity-70 group-hover:opacity-100 transition-opacity" />
          <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1">Saídas</p>
          <p className="text-sm font-bold text-expense">{formatCurrency(expenses)}</p>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-[1.5rem] p-4 text-center hover:bg-white/[0.06] transition-colors duration-500 group">
          <CalendarClock className="w-5 h-5 mx-auto mb-2 text-indigo-400 opacity-70 group-hover:opacity-100 transition-opacity" />
          <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1">Fixos</p>
          <p className="text-sm font-bold text-indigo-400">{formatCurrency(fixed)}</p>
        </div>
      </div>

      {/* Transactions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-sm font-mono text-white/40 uppercase tracking-widest">Últimas Transações</h2>
          <button className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-widest">Ver tudo</button>
        </div>
        
        {transactions.length === 0 ? (
          <EmptyState icon="💰" title="Nenhuma transação" description="Adicione sua primeira transação usando o botão +" />
        ) : (
          <div className="space-y-3">
            {transactions.slice(0, 10).map(tx => {
              const cat = getCatInfo(tx.categoryId);
              return (
                <div key={tx.id} className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/[0.06] transition-all group">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-white/5 border border-white/5 group-hover:border-white/10 transition-colors">
                    {tx.type === 'income' ? (getSourceName(tx.incomeSourceId)?.icon || '💰') : cat?.icon || '📌'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white/90 truncate mb-0.5">{tx.description}</p>
                    <p className="text-[10px] font-mono text-white/30 uppercase tracking-wider">
                      {tx.type === 'income' ? (getSourceName(tx.incomeSourceId)?.name || 'Receita') : (cat?.name || '')} · {format(parseISO(tx.date), 'dd MMM', { locale: ptBR })}
                    </p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <span className={cn("text-sm font-bold font-mono tracking-tighter", tx.type === 'income' ? 'text-income' : 'text-expense')}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount).replace('R$', '').trim()}
                    </span>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditTx(tx); setModalOpen(true); }} className="p-1 rounded hover:bg-white/10 transition-colors">
                        <Pencil className="w-3 h-3 text-white/40" />
                      </button>
                      <button onClick={() => setDeleteId(tx.id)} className="p-1 rounded hover:bg-red-500/10 transition-colors">
                        <Trash2 className="w-3 h-3 text-red-500/50 hover:text-red-500" />
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
        <AlertDialogContent className="glass-panel border-none">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Excluir transação?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/40">Esta ação não pode ser desfeita e removerá os dados do seu histórico.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-xl">Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => { if (deleteId) deleteTransaction(deleteId); setDeleteId(null); }}
              className="bg-red-500/20 text-red-400 border border-red-500/20 hover:bg-red-500/30 rounded-xl"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}



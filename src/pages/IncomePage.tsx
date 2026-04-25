import { useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { MonthSelector } from '@/components/MonthSelector';
import { EmptyState } from '@/components/EmptyState';
import { IncomeSourceModal } from '@/components/IncomeSourceModal';
import { IncomeSource } from '@/types/finance';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { DynamicIcon } from '@/components/DynamicIcon';
import { Wallet, Briefcase } from 'lucide-react';

export function IncomePage() {
  const { incomeSources, addIncomeSource, updateIncomeSource, deleteIncomeSource, getIncomeBySource, getMonthTransactions, getTotalIncome } = useFinance();
  const [modalOpen, setModalOpen] = useState(false);
  const [editSource, setEditSource] = useState<IncomeSource | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const incomeTransactions = getMonthTransactions().filter(t => t.type === 'income').sort((a, b) => b.date.localeCompare(a.date));
  const totalIncome = getTotalIncome();

  const formatCurrency = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const getSourceById = (id: string | null | undefined) => incomeSources.find(s => s.id === id);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <MonthSelector />

      {/* Total */}
      <div className="glass-panel p-8 text-center relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-[40px] rounded-full" />
        <div className="relative z-10">
          <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-4">Total de Entradas</p>
          <p className="text-5xl font-light text-income stat-value text-glow leading-none">{formatCurrency(totalIncome).replace('R$', '').trim()}<span className="text-xl text-white/30 ml-2 font-normal">BRL</span></p>
        </div>
      </div>

      {/* Sources */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-sm font-mono text-white/40 uppercase tracking-widest">Fontes de Renda</h2>
          <button
            onClick={() => { setEditSource(null); setModalOpen(true); }}
            className="flex items-center gap-2 text-[10px] font-mono text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-widest"
          >
            <Plus className="w-3 h-3" /> Nova Fonte
          </button>
        </div>

        {incomeSources.length === 0 ? (
          <EmptyState icon={<Briefcase className="w-8 h-8 text-white/20" />} title="Nenhuma fonte" description="Crie suas fontes de renda para organizar seus ganhos" />
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {incomeSources.map(source => {
              const earned = getIncomeBySource(source.id);
              return (
                <div key={source.id} className="glass-panel p-4 relative group hover:-translate-y-1 transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 group-hover:text-white transition-colors">
                      <DynamicIcon name={source.icon} className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-medium text-white/60 group-hover:text-white transition-colors truncate flex-1">{source.name}</span>
                  </div>
                  <p className="text-lg font-bold text-income font-mono tracking-tighter">{formatCurrency(earned).replace('R$', '').trim()}</p>
                  <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditSource(source); setModalOpen(true); }} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                      <Pencil className="w-3 h-3 text-white/40" />
                    </button>
                    <button onClick={() => setDeleteId(source.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors">
                      <Trash2 className="w-3 h-3 text-red-500/40 hover:text-red-500" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Transactions by source */}
      <div className="space-y-4">
        <h2 className="text-sm font-mono text-white/40 uppercase tracking-widest px-2">Entradas do Mês</h2>
        {incomeTransactions.length === 0 ? (
          <EmptyState icon={<Wallet className="w-8 h-8 text-white/20" />} title="Nenhuma entrada" description="Adicione entradas usando o botão +" />
        ) : (
          <div className="space-y-3">
            {incomeTransactions.map(tx => {
              const source = getSourceById(tx.incomeSourceId);
              return (
                <div key={tx.id} className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex items-center gap-4 group hover:bg-white/[0.05] transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-white transition-colors">
                    <DynamicIcon name={source?.icon} fallback={<Wallet className="w-5 h-5" />} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white/80 truncate mb-0.5">{tx.description}</p>
                    <p className="text-[10px] font-mono text-white/30 uppercase tracking-wider">
                      {source?.name || 'Sem fonte'} · {format(parseISO(tx.date), 'dd MMM', { locale: ptBR })}
                    </p>
                  </div>
                  <span className="text-sm font-bold font-mono text-income tracking-tighter whitespace-nowrap">
                    +{formatCurrency(tx.amount).replace('R$', '').trim()}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <IncomeSourceModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditSource(null); }}
        editSource={editSource}
        onSave={(data) => {
          if (editSource) {
            updateIncomeSource(editSource.id, data);
          } else {
            addIncomeSource(data);
          }
        }}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir fonte de renda?</AlertDialogTitle>
            <AlertDialogDescription>As transações associadas não serão excluídas.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (deleteId) deleteIncomeSource(deleteId); setDeleteId(null); }}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

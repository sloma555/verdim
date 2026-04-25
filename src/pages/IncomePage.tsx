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
    <div className="space-y-4 animate-fade-in-up">
      <MonthSelector />

      {/* Total */}
      <div className="glass-card p-5 text-center">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total de Entradas</p>
        <p className="text-3xl font-bold text-income">{formatCurrency(totalIncome)}</p>
      </div>

      {/* Sources */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-foreground">Fontes de Renda</h2>
          <button
            onClick={() => { setEditSource(null); setModalOpen(true); }}
            className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
          >
            <Plus className="w-4 h-4" /> Nova Fonte
          </button>
        </div>

        {incomeSources.length === 0 ? (
          <EmptyState icon="💼" title="Nenhuma fonte" description="Crie suas fontes de renda para organizar seus ganhos" />
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {incomeSources.map(source => {
              const earned = getIncomeBySource(source.id);
              return (
                <div key={source.id} className="glass-card p-3 relative group">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
                      style={{ backgroundColor: source.color + '22' }}
                    >
                      {source.icon}
                    </div>
                    <span className="text-sm font-medium truncate flex-1">{source.name}</span>
                  </div>
                  <p className="text-lg font-bold text-income">{formatCurrency(earned)}</p>
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditSource(source); setModalOpen(true); }} className="p-1 rounded hover:bg-secondary">
                      <Pencil className="w-3 h-3 text-muted-foreground" />
                    </button>
                    <button onClick={() => setDeleteId(source.id)} className="p-1 rounded hover:bg-destructive/20">
                      <Trash2 className="w-3 h-3 text-destructive" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Transactions by source */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-2">Entradas do Mês</h2>
        {incomeTransactions.length === 0 ? (
          <EmptyState icon="💰" title="Nenhuma entrada" description="Adicione entradas usando o botão +" />
        ) : (
          <div className="space-y-2">
            {incomeTransactions.map(tx => {
              const source = getSourceById(tx.incomeSourceId);
              return (
                <div key={tx.id} className="glass-card p-3 flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-lg"
                    style={{ backgroundColor: (source?.color || '#22c55e') + '22' }}
                  >
                    {source?.icon || '💰'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{tx.description}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {source?.name || 'Sem fonte'} · {format(parseISO(tx.date), 'dd MMM', { locale: ptBR })}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-income whitespace-nowrap">
                    +{formatCurrency(tx.amount)}
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

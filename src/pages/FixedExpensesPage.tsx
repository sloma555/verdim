import { useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { MonthSelector } from '@/components/MonthSelector';
import { EmptyState } from '@/components/EmptyState';
import { FixedExpenseModal } from '@/components/FixedExpenseModal';
import { FixedExpense } from '@/types/finance';
import { Trash2, Pencil, Check, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function FixedExpensesPage() {
  const { getMonthFixedExpenses, updateFixedExpense, deleteFixedExpense, categories } = useFinance();
  const [modalOpen, setModalOpen] = useState(false);
  const [editExpense, setEditExpense] = useState<FixedExpense | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fixeds = getMonthFixedExpenses();
  const getCatInfo = (id: string) => categories.find(c => c.id === id);

  const formatCurrency = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="space-y-4 animate-fade-in-up">
      <MonthSelector />

      <Button onClick={() => { setEditExpense(null); setModalOpen(true); }} className="w-full gradient-primary text-primary-foreground">
        + Adicionar Gasto Fixo
      </Button>

      {fixeds.length === 0 ? (
        <EmptyState icon="📅" title="Nenhum gasto fixo" description="Adicione seus gastos recorrentes como aluguel, assinaturas, etc." />
      ) : (
        <div className="space-y-2">
          {fixeds.map(f => {
            const cat = getCatInfo(f.categoryId);
            return (
              <div key={f.id} className="glass-card p-3 flex items-center gap-3">
                <button
                  onClick={() => updateFixedExpense(f.id, { paid: !f.paid })}
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-all flex-shrink-0",
                    f.paid ? "bg-safe/20 text-safe" : "bg-warning/20 text-warning"
                  )}
                >
                  {f.paid ? <Check className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm font-medium truncate", f.paid && "line-through opacity-60")}>{f.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {cat?.icon} {cat?.name} · Venc. {format(parseISO(f.dueDate), 'dd MMM', { locale: ptBR })}
                  </p>
                </div>
                <span className="text-sm font-bold text-expense">{formatCurrency(f.amount)}</span>
                <div className="flex gap-1 ml-1">
                  <button onClick={() => { setEditExpense(f); setModalOpen(true); }} className="p-1.5 rounded-md hover:bg-secondary transition-colors">
                    <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                  <button onClick={() => setDeleteId(f.id)} className="p-1.5 rounded-md hover:bg-destructive/20 transition-colors">
                    <Trash2 className="w-3.5 h-3.5 text-destructive" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <FixedExpenseModal open={modalOpen} onClose={() => { setModalOpen(false); setEditExpense(null); }} editExpense={editExpense} />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir gasto fixo?</AlertDialogTitle>
            <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (deleteId) deleteFixedExpense(deleteId); setDeleteId(null); }}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

import { useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { MonthSelector } from '@/components/MonthSelector';
import { CategoryThermometer } from '@/components/CategoryThermometer';
import { EmptyState } from '@/components/EmptyState';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowLeft } from 'lucide-react';

export function CategoriesPage() {
  const { categories, getCategorySpent, getLimit, selectedMonth, getMonthTransactions, getMonthFixedExpenses } = useFinance();
  const [selectedCat, setSelectedCat] = useState<string | null>(null);

  const formatCurrency = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  if (selectedCat) {
    const cat = categories.find(c => c.id === selectedCat);
    if (!cat) return null;
    const spent = getCategorySpent(selectedCat);
    const limit = getLimit(selectedCat, selectedMonth);
    const txs = getMonthTransactions().filter(t => t.type === 'expense' && t.categoryId === selectedCat);
    const fixeds = getMonthFixedExpenses().filter(f => f.categoryId === selectedCat);

    return (
      <div className="space-y-4 animate-fade-in-up">
        <button onClick={() => setSelectedCat(null)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{cat.icon}</span>
            <div>
              <h2 className="font-semibold">{cat.name}</h2>
              <p className="text-sm text-muted-foreground">Gasto: {formatCurrency(spent)}</p>
            </div>
          </div>
          <CategoryThermometer spent={spent} limit={limit} />
        </div>

        <h3 className="text-sm font-semibold">Transações</h3>
        {txs.length === 0 && fixeds.length === 0 ? (
          <EmptyState icon="📂" title="Nada aqui" description="Nenhuma transação nesta categoria este mês." />
        ) : (
          <div className="space-y-2">
            {txs.map(tx => (
              <div key={tx.id} className="glass-card p-3 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">{tx.description}</p>
                  <p className="text-[10px] text-muted-foreground">{format(parseISO(tx.date), 'dd MMM', { locale: ptBR })}</p>
                </div>
                <span className="text-sm font-bold text-expense">{formatCurrency(tx.amount)}</span>
              </div>
            ))}
            {fixeds.map(f => (
              <div key={f.id} className="glass-card p-3 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">{f.name} <span className="text-[10px] text-primary">(fixo)</span></p>
                  <p className="text-[10px] text-muted-foreground">Venc. {format(parseISO(f.dueDate), 'dd MMM', { locale: ptBR })}</p>
                </div>
                <span className="text-sm font-bold text-expense">{formatCurrency(f.amount)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in-up">
      <MonthSelector />
      <div className="grid grid-cols-2 gap-2">
        {categories.map(cat => {
          const spent = getCategorySpent(cat.id);
          const limit = getLimit(cat.id, selectedMonth);
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className="glass-card p-3 text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{cat.icon}</span>
                <span className="text-xs font-semibold truncate">{cat.name}</span>
              </div>
              <p className="text-sm font-bold mb-1.5">{formatCurrency(spent)}</p>
              <CategoryThermometer spent={spent} limit={limit} compact />
            </button>
          );
        })}
      </div>
    </div>
  );
}

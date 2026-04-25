import { useState } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { MonthSelector } from '@/components/MonthSelector';
import { CategoryThermometer } from '@/components/CategoryThermometer';
import { EmptyState } from '@/components/EmptyState';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DynamicIcon } from '@/components/DynamicIcon';
import { ArrowLeft, LayoutGrid } from 'lucide-react';

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
      <div className="space-y-6 animate-fade-in-up">
        <button onClick={() => setSelectedCat(null)} className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors font-mono uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>
        <div className="glass-panel p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60">
              <DynamicIcon name={cat.icon} className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-medium text-white">{cat.name}</h2>
              <p className="text-sm text-white/40">Gasto: {formatCurrency(spent)}</p>
            </div>
          </div>
          <CategoryThermometer spent={spent} limit={limit} />
        </div>

        <h3 className="text-sm font-mono text-white/40 uppercase tracking-widest px-2">Transações</h3>
        {txs.length === 0 && fixeds.length === 0 ? (
          <EmptyState icon={<LayoutGrid className="w-8 h-8 text-white/20" />} title="Nada aqui" description="Nenhuma transação nesta categoria este mês." />
        ) : (
          <div className="space-y-3">
            {txs.map(tx => (
              <div key={tx.id} className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex justify-between items-center group hover:bg-white/[0.05] transition-colors">
                <div>
                  <p className="text-sm font-medium text-white/80">{tx.description}</p>
                  <p className="text-[10px] font-mono text-white/30 uppercase tracking-wider">{format(parseISO(tx.date), 'dd MMM', { locale: ptBR })}</p>
                </div>
                <span className="text-sm font-bold font-mono text-expense tracking-tighter">-{formatCurrency(tx.amount).replace('R$', '').trim()}</span>
              </div>
            ))}
            {fixeds.map(f => (
              <div key={f.id} className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex justify-between items-center group hover:bg-white/[0.05] transition-colors">
                <div>
                  <p className="text-sm font-medium text-white/80">{f.name} <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest ml-1">(fixo)</span></p>
                  <p className="text-[10px] font-mono text-white/30 uppercase tracking-wider">Venc. {format(parseISO(f.dueDate), 'dd MMM', { locale: ptBR })}</p>
                </div>
                <span className="text-sm font-bold font-mono text-expense tracking-tighter">-{formatCurrency(f.amount).replace('R$', '').trim()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <MonthSelector />
      <div className="grid grid-cols-2 gap-4">
        {categories.map(cat => {
          const spent = getCategorySpent(cat.id);
          const limit = getLimit(cat.id, selectedMonth);
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className="glass-panel p-4 text-left transition-all hover:-translate-y-1 active:scale-95 group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 group-hover:text-white transition-colors">
                  <DynamicIcon name={cat.icon} className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-white/60 group-hover:text-white transition-colors truncate">{cat.name}</span>
              </div>
              <p className="text-lg font-bold text-white mb-2 font-mono tracking-tighter">{formatCurrency(spent).replace('R$', '').trim()}</p>
              <CategoryThermometer spent={spent} limit={limit} compact />
            </button>
          );
        })}
      </div>
    </div>
  );
}

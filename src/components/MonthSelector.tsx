import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useFinance } from '@/contexts/FinanceContext';

export function MonthSelector() {
  const { selectedMonth, setSelectedMonth } = useFinance();

  const currentDate = parse(selectedMonth, 'yyyy-MM', new Date());
  const label = format(currentDate, "MMMM 'de' yyyy", { locale: ptBR });

  const prev = () => setSelectedMonth(format(subMonths(currentDate, 1), 'yyyy-MM'));
  const next = () => setSelectedMonth(format(addMonths(currentDate, 1), 'yyyy-MM'));

  return (
    <div className="flex items-center justify-between px-1">
      <button onClick={prev} className="p-2 rounded-lg hover:bg-secondary transition-colors">
        <ChevronLeft className="w-5 h-5 text-muted-foreground" />
      </button>
      <span className="text-sm font-semibold capitalize text-foreground">{label}</span>
      <button onClick={next} className="p-2 rounded-lg hover:bg-secondary transition-colors">
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </button>
    </div>
  );
}

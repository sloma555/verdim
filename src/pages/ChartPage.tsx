import { useFinance } from '@/contexts/FinanceContext';
import { MonthSelector } from '@/components/MonthSelector';
import { EmptyState } from '@/components/EmptyState';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export function ChartPage() {
  const { categories, getCategorySpent } = useFinance();

  const data = categories
    .map(cat => ({ name: cat.name, value: getCategorySpent(cat.id), color: cat.color, icon: cat.icon }))
    .filter(d => d.value > 0)
    .sort((a, b) => b.value - a.value);

  const total = data.reduce((s, d) => s + d.value, 0);

  const formatCurrency = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="space-y-4 animate-fade-in-up">
      <MonthSelector />

      {data.length === 0 ? (
        <EmptyState icon="📊" title="Sem dados" description="Adicione gastos para ver a distribuição por categoria." />
      ) : (
        <>
          <div className="glass-card p-4">
            <div className="relative" style={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {data.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-lg font-bold">{formatCurrency(total)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            {data.map((d, i) => (
              <div key={i} className="glass-card p-3 flex items-center gap-3">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                <span className="text-xs">{d.icon}</span>
                <span className="text-sm font-medium flex-1">{d.name}</span>
                <div className="text-right">
                  <p className="text-sm font-bold">{formatCurrency(d.value)}</p>
                  <p className="text-[10px] text-muted-foreground">{((d.value / total) * 100).toFixed(1)}%</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

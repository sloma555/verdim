import { LayoutDashboard, Grid3X3, PieChart, CalendarClock, Settings, Shield, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

export type TabId = 'overview' | 'income' | 'categories' | 'chart' | 'fixed' | 'settings' | 'admin';

const tabs: { id: TabId; label: string; icon: React.ElementType; adminOnly?: boolean }[] = [
  { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
  { id: 'income', label: 'Rendas', icon: Wallet },
  { id: 'categories', label: 'Categorias', icon: Grid3X3 },
  { id: 'chart', label: 'Gráfico', icon: PieChart },
  { id: 'fixed', label: 'Fixos', icon: CalendarClock },
  { id: 'settings', label: 'Config', icon: Settings },
  { id: 'admin', label: 'Admin', icon: Shield, adminOnly: true },
];

interface BottomNavProps {
  active: TabId;
  onChange: (tab: TabId) => void;
}

export function BottomNav({ active, onChange }: BottomNavProps) {
  const { isAdmin } = useAuth();

  const visibleTabs = tabs.filter(t => !t.adminOnly || isAdmin);

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50 glass-card border border-glass-border shadow-2xl safe-area-bottom overflow-hidden">
      <div className="flex items-center justify-around max-w-lg mx-auto px-2 py-1">
        {visibleTabs.map(tab => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                "flex flex-col items-center gap-1 py-2 px-2 rounded-xl transition-all duration-300 min-w-[56px] relative",
                isActive
                  ? "text-primary scale-105"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-lg transition-colors",
                isActive ? "bg-primary/10" : "bg-transparent"
              )}>
                <tab.icon className={cn("w-5 h-5 transition-transform", isActive && "stroke-[2.5px]")} />
              </div>
              <span className={cn(
                "text-[9px] font-bold leading-none uppercase tracking-tighter",
                isActive ? "opacity-100" : "opacity-70"
              )}>
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute -bottom-1 w-6 h-1 rounded-full bg-primary glow-primary animate-scale-in" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}


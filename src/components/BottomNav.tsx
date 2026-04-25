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
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-border/50 safe-area-bottom">
      <div className="flex items-center justify-around max-w-lg mx-auto px-2 py-1">
        {visibleTabs.map(tab => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                "flex flex-col items-center gap-0.5 py-2 px-3 rounded-lg transition-all duration-200 min-w-[56px]",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className={cn("w-5 h-5 transition-transform", isActive && "scale-110")} />
              <span className="text-[10px] font-medium leading-none">{tab.label}</span>
              {isActive && (
                <div className="w-4 h-0.5 rounded-full bg-primary mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

import { LayoutDashboard, Grid3X3, PieChart, CalendarClock, Settings, Shield, Wallet, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

export type TabId = 'overview' | 'income' | 'categories' | 'chart' | 'fixed' | 'settings' | 'admin';

const tabs: { id: TabId; label: string; icon: React.ElementType; adminOnly?: boolean }[] = [
  { id: 'overview', label: 'Home', icon: LayoutDashboard },
  { id: 'income', label: 'Income', icon: Wallet },
  { id: 'categories', label: 'Cats', icon: Grid3X3 },
  { id: 'chart', label: 'Stats', icon: PieChart },
  { id: 'fixed', label: 'Fixed', icon: CalendarClock },
  { id: 'settings', label: 'Config', icon: Settings },
];

interface BottomNavProps {
  active: TabId;
  onChange: (tab: TabId) => void;
  onAddClick?: () => void;
}

export function BottomNav({ active, onChange, onAddClick }: BottomNavProps) {
  const { isAdmin } = useAuth();
  const visibleTabs = tabs.filter(t => !t.adminOnly || isAdmin);

  return (
    <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      {/* Main Nav Pill */}
      <nav className="pointer-events-auto glass-panel p-1.5 rounded-[2rem] flex items-center gap-1 shadow-2xl">
        {visibleTabs.map(tab => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                "icon-btn w-12 h-12 rounded-[1.2rem] flex flex-col gap-0.5 items-center justify-center",
                isActive ? "active text-white" : "text-white/40 hover:text-white"
              )}
            >
              <tab.icon className={cn("w-5 h-5 transition-transform", isActive && "scale-110")} />
              <span className="text-[7px] font-mono tracking-widest uppercase opacity-70">{tab.label}</span>
            </button>
          );
        })}

        <div className="w-[1px] h-8 bg-white/10 mx-1"></div>

        {/* FAB - Integrated inside nav */}
        <button 
          onClick={onAddClick}
          className="w-12 h-12 rounded-[1.2rem] bg-indigo-500 hover:bg-indigo-600 text-white flex flex-col items-center justify-center shadow-[0_5px_15px_-3px_rgba(79,70,229,0.5)] transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span className="text-[7px] font-mono tracking-widest uppercase opacity-90">Novo</span>
        </button>
      </nav>
    </div>
  );
}



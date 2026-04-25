import { useFinance } from '@/contexts/FinanceContext';
import { useAuth } from '@/contexts/AuthContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Moon, Sun, Trash2, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SettingsPage() {
  const { user, signOut } = useAuth();
  const { settings, updateSettings, categories, setLimit, getLimit, selectedMonth, addCategory, deleteCategory } = useFinance();
  const [newCatName, setNewCatName] = useState('');

  const isDark = settings.theme === 'dark';

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h1 className="text-lg font-bold">Configurações</h1>

      {/* Theme */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isDark ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-warning" />}
            <div>
              <p className="text-sm font-semibold">Modo Escuro</p>
              <p className="text-xs text-muted-foreground">Alterne entre claro e escuro</p>
            </div>
          </div>
          <Switch checked={isDark} onCheckedChange={(v) => updateSettings({ theme: v ? 'dark' : 'light' })} />
        </div>
      </div>

      {/* Limits */}
      <div className="glass-card p-4 space-y-3">
        <h2 className="text-sm font-semibold">Limites por Categoria ({selectedMonth})</h2>
        <p className="text-xs text-muted-foreground">Defina quanto deseja gastar no máximo em cada categoria neste mês.</p>
        <div className="space-y-2">
          {categories.map(cat => {
            const currentLimit = getLimit(cat.id, selectedMonth);
            return (
              <div key={cat.id} className="flex items-center gap-2">
                <span className="text-sm w-6">{cat.icon}</span>
                <span className="text-xs font-medium flex-1 truncate">{cat.name}</span>
                <Input
                  type="number"
                  min="0"
                  step="50"
                  placeholder="0"
                  className="w-24 h-8 text-xs"
                  defaultValue={currentLimit || ''}
                  onBlur={e => {
                    const val = parseFloat(e.target.value) || 0;
                    setLimit(cat.id, selectedMonth, val);
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Categories */}
      <div className="glass-card p-4 space-y-3">
        <h2 className="text-sm font-semibold">Gerenciar Categorias</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Nova categoria"
            value={newCatName}
            onChange={e => setNewCatName(e.target.value)}
            className="h-8 text-xs"
          />
          <Button
            size="sm"
            onClick={() => {
              if (newCatName.trim()) {
                addCategory({ name: newCatName.trim(), color: '#64748b', icon: '📌', isDefault: false });
                setNewCatName('');
              }
            }}
            className="gradient-primary text-primary-foreground h-8 text-xs"
          >
            Adicionar
          </Button>
        </div>
        <div className="space-y-1">
          {categories.filter(c => !c.isDefault).map(cat => (
            <div key={cat.id} className="flex items-center justify-between py-1">
              <span className="text-sm">{cat.icon} {cat.name}</span>
              <button onClick={() => deleteCategory(cat.id)} className="p-1 rounded hover:bg-destructive/20 transition-colors">
                <Trash2 className="w-3.5 h-3.5 text-destructive" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* User & Logout */}
      <div className="glass-card p-4 space-y-3">
        <div className="flex items-center gap-3">
          {user?.photoURL && (
            <img src={user.photoURL} alt="Avatar" className="w-8 h-8 rounded-full" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{user?.displayName}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <Button
          variant="destructive"
          className="w-full h-9 text-xs gap-2"
          onClick={signOut}
        >
          <LogOut className="w-4 h-4" />
          Sair da conta
        </Button>
      </div>

      {/* Info */}
      <div className="glass-card p-4">
        <p className="text-xs text-muted-foreground">Moeda: BRL · Início do mês: dia 1</p>
      </div>
    </div>
  );
}

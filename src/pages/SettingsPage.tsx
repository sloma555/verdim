import { useFinance } from '@/contexts/FinanceContext';
import { useAuth } from '@/contexts/AuthContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Moon, Sun, Trash2, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DynamicIcon } from '@/components/DynamicIcon';

// ... inside the component
      {/* Limits */}
      <div className="glass-panel p-6 space-y-4">
        <h2 className="text-sm font-mono text-white/40 uppercase tracking-widest">Limites por Categoria ({selectedMonth})</h2>
        <div className="space-y-3">
          {categories.map(cat => {
            const currentLimit = getLimit(cat.id, selectedMonth);
            return (
              <div key={cat.id} className="flex items-center gap-4 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/60">
                  <DynamicIcon name={cat.icon} className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium flex-1 text-white/80">{cat.name}</span>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-white/20 font-mono">R$</span>
                  <Input
                    type="number"
                    min="0"
                    step="50"
                    placeholder="0"
                    className="w-28 h-9 pl-8 bg-white/5 border-white/10 text-white text-xs font-mono"
                    defaultValue={currentLimit || ''}
                    onBlur={e => {
                      const val = parseFloat(e.target.value) || 0;
                      setLimit(cat.id, selectedMonth, val);
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Categories */}
      <div className="glass-panel p-6 space-y-4">
        <h2 className="text-sm font-mono text-white/40 uppercase tracking-widest">Gerenciar Categorias</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Nova categoria"
            value={newCatName}
            onChange={e => setNewCatName(e.target.value)}
            className="h-10 bg-white/5 border-white/10 text-white text-sm"
          />
          <Button
            onClick={() => {
              if (newCatName.trim()) {
                addCategory({ name: newCatName.trim(), color: '#6366f1', icon: 'pin', isDefault: false });
                setNewCatName('');
              }
            }}
            className="bg-indigo-500 hover:bg-indigo-600 text-white h-10 px-6 rounded-xl"
          >
            Adicionar
          </Button>
        </div>
        <div className="space-y-2 pt-2">
          {categories.filter(c => !c.isDefault).map(cat => (
            <div key={cat.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 group">
              <div className="flex items-center gap-3">
                <DynamicIcon name={cat.icon} className="text-white/40 group-hover:text-white transition-colors" />
                <span className="text-sm text-white/80">{cat.name}</span>
              </div>
              <button onClick={() => deleteCategory(cat.id)} className="p-2 rounded-lg hover:bg-red-500/10 transition-colors">
                <Trash2 className="w-4 h-4 text-red-500/40 hover:text-red-500" />
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

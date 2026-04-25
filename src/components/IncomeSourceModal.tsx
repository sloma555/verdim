import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IncomeSource } from '@/types/finance';
import { cn } from '@/lib/utils';
import { DynamicIcon } from '@/components/DynamicIcon';

const ICON_OPTIONS = ['wallet', 'banknote', 'credit-card', 'briefcase', 'monitor', 'shopping-cart', 'truck', 'home', 'coins', 'trending-up', 'smartphone', 'gift', 'utensils'];
const COLOR_OPTIONS = ['#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#ef4444', '#14b8a6', '#f97316'];

interface IncomeSourceModalProps {
  open: boolean;
  onClose: () => void;
  editSource?: IncomeSource | null;
  onSave: (data: Omit<IncomeSource, 'id'>) => void;
}

export function IncomeSourceModal({ open, onClose, editSource, onSave }: IncomeSourceModalProps) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('wallet');
  const [color, setColor] = useState('#22c55e');

  useEffect(() => {
    if (editSource) {
      setName(editSource.name);
      setIcon(editSource.icon);
      setColor(editSource.color);
    } else {
      setName('');
      setIcon('wallet');
      setColor('#22c55e');
    }
  }, [editSource, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim(), icon, color });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="glass-panel max-w-[95vw] sm:max-w-md border-none">
        <DialogHeader>
          <DialogTitle className="text-white">{editSource ? 'Editar Fonte' : 'Nova Fonte de Renda'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-white/60">Nome</Label>
            <Input placeholder="Ex: Motoboy, Freelance..." value={name} onChange={e => setName(e.target.value)} required className="bg-white/5 border-white/10 text-white" />
          </div>

          <div>
            <Label className="text-white/60">Ícone</Label>
            <div className="grid grid-cols-6 gap-2 mt-2">
              {ICON_OPTIONS.map(e => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setIcon(e)}
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                    icon === e ? "bg-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]" : "bg-white/5 text-white/40 hover:bg-white/10"
                  )}
                >
                  <DynamicIcon name={e} className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>Cor</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {COLOR_OPTIONS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={cn(
                    "w-8 h-8 rounded-full transition-all",
                    color === c ? "ring-2 ring-offset-2 ring-offset-background ring-primary scale-110" : ""
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full gradient-primary text-primary-foreground">
            {editSource ? 'Salvar' : 'Criar Fonte'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useFinance } from '@/contexts/FinanceContext';
import { FixedExpense, PAYMENT_METHODS } from '@/types/finance';
import { format } from 'date-fns';

interface FixedExpenseModalProps {
  open: boolean;
  onClose: () => void;
  editExpense?: FixedExpense | null;
}

export function FixedExpenseModal({ open, onClose, editExpense }: FixedExpenseModalProps) {
  const { categories, addFixedExpense, updateFixedExpense } = useFinance();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [dueDate, setDueDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    if (editExpense) {
      setName(editExpense.name);
      setAmount(editExpense.amount.toString());
      setCategoryId(editExpense.categoryId);
      setPaymentMethod(editExpense.paymentMethod);
      setDueDate(editExpense.dueDate.substring(0, 10));
      setPaid(editExpense.paid);
    } else {
      setName(''); setAmount(''); setCategoryId(''); setPaymentMethod('');
      setDueDate(format(new Date(), 'yyyy-MM-dd')); setPaid(false);
    }
  }, [editExpense, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name,
      amount: parseFloat(amount) || 0,
      categoryId,
      paymentMethod,
      dueDate,
      recurrence: 'monthly' as const,
      paid,
    };
    if (editExpense) {
      updateFixedExpense(editExpense.id, data);
    } else {
      addFixedExpense(data);
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="glass-card max-w-[95vw] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editExpense ? 'Editar Gasto Fixo' : 'Novo Gasto Fixo'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nome</Label>
            <Input placeholder="Ex: Netflix" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div>
            <Label>Valor (R$)</Label>
            <Input type="number" step="0.01" min="0" placeholder="0,00" value={amount} onChange={e => setAmount(e.target.value)} required />
          </div>
          <div>
            <Label>Categoria</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {categories.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.icon} {c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Forma de Pagamento</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map(m => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Vencimento</Label>
            <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} required />
          </div>
          <div className="flex items-center justify-between">
            <Label>Pago</Label>
            <Switch checked={paid} onCheckedChange={setPaid} />
          </div>
          <Button type="submit" className="w-full gradient-primary text-primary-foreground">
            {editExpense ? 'Salvar' : 'Adicionar'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

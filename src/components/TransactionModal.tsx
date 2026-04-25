import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFinance } from '@/contexts/FinanceContext';
import { Transaction, PAYMENT_METHODS } from '@/types/finance';
import { format } from 'date-fns';

interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
  editTransaction?: Transaction | null;
}

export function TransactionModal({ open, onClose, editTransaction }: TransactionModalProps) {
  const { categories, incomeSources, addTransaction, updateTransaction, selectedMonth } = useFinance();
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [incomeSourceId, setIncomeSourceId] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    if (editTransaction) {
      setType(editTransaction.type);
      setAmount(editTransaction.amount.toString());
      setDescription(editTransaction.description);
      setCategoryId(editTransaction.categoryId || '');
      setPaymentMethod(editTransaction.paymentMethod || '');
      setIncomeSourceId(editTransaction.incomeSourceId || '');
      setDate(editTransaction.date.substring(0, 10));
    } else {
      setType('expense');
      setAmount('');
      setDescription('');
      setCategoryId('');
      setPaymentMethod('');
      setIncomeSourceId('');
      setDate(format(new Date(), 'yyyy-MM-dd'));
    }
  }, [editTransaction, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      type,
      amount: parseFloat(amount) || 0,
      description,
      categoryId: type === 'expense' ? categoryId : null,
      paymentMethod: type === 'expense' ? paymentMethod : null,
      incomeSourceId: type === 'income' ? (incomeSourceId || null) : null,
      date: date,
    };
    if (editTransaction) {
      updateTransaction(editTransaction.id, data);
    } else {
      addTransaction(data);
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="glass-card max-w-[95vw] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editTransaction ? 'Editar Transação' : 'Nova Transação'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <Button
              type="button"
              variant={type === 'income' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => setType('income')}
            >
              Entrada
            </Button>
            <Button
              type="button"
              variant={type === 'expense' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => setType('expense')}
            >
              Saída
            </Button>
          </div>

          <div>
            <Label>Valor (R$)</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Descrição</Label>
            <Input
              placeholder="Ex: Compras do mês"
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Data</Label>
            <Input type="date" value={date} onChange={e => setDate(e.target.value)} required />
          </div>

          {type === 'income' && incomeSources.length > 0 && (
            <div>
              <Label>Fonte de Renda</Label>
              <Select value={incomeSourceId} onValueChange={setIncomeSourceId}>
                <SelectTrigger><SelectValue placeholder="Selecione (opcional)" /></SelectTrigger>
                <SelectContent>
                  {incomeSources.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.icon} {s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {type === 'expense' && (
            <>
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
            </>
          )}

          <Button type="submit" className="w-full gradient-primary text-primary-foreground">
            {editTransaction ? 'Salvar' : 'Adicionar'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

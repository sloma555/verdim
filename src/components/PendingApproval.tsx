import { Clock, ShieldX, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface PendingApprovalProps {
  status: 'pending' | 'suspended';
}

export function PendingApproval({ status }: PendingApprovalProps) {
  const { signOut } = useAuth();

  const isPending = status === 'pending';
  const Icon = isPending ? Clock : ShieldX;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="glass-card p-8 max-w-sm w-full text-center space-y-6 animate-fade-in-up">
        <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
          <Icon className={`w-8 h-8 ${isPending ? 'text-yellow-500' : 'text-destructive'}`} />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-foreground">
            {isPending ? 'Aguardando aprovação' : 'Conta suspensa'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isPending
              ? 'Sua conta foi criada e está aguardando a aprovação de um administrador. Você será notificado quando sua conta for ativada.'
              : 'Sua conta foi suspensa por um administrador. Entre em contato para mais informações.'}
          </p>
        </div>
        <Button variant="outline" onClick={signOut} className="w-full gap-2">
          <LogOut className="w-4 h-4" />
          Sair da conta
        </Button>
      </div>
    </div>
  );
}

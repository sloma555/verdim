import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

export function LoginPage() {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="glass-card p-8 max-w-sm w-full text-center space-y-6 animate-fade-in-up">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold gradient-text">Verdin</h1>
          <p className="text-sm text-muted-foreground">Controle financeiro inteligente</p>
        </div>

        <div className="w-16 h-16 mx-auto rounded-2xl gradient-primary flex items-center justify-center text-3xl shadow-lg">
          💰
        </div>

        <p className="text-xs text-muted-foreground">
          Faça login para sincronizar seus dados em todos os dispositivos.
        </p>

        <Button
          onClick={signInWithGoogle}
          className="w-full h-12 gradient-primary text-primary-foreground font-semibold text-sm gap-2"
        >
          <LogIn className="w-5 h-5" />
          Entrar com Google
        </Button>

        <p className="text-[10px] text-muted-foreground/60">
          Seus dados ficam protegidos e sincronizados via Firebase.
        </p>
      </div>
    </div>
  );
}

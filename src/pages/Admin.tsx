import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAccounts } from '@/hooks/useAccounts';
import { isSuperAdmin } from '@/lib/constants';
import { Account } from '@/types/account';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Check, Ban, RotateCcw, Loader2, Calendar as CalendarIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

function getInitials(name: string | null): string {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

function formatTimestamp(ts: any): string {
  if (!ts?.toDate) return '—';
  return format(ts.toDate(), "dd/MM/yyyy", { locale: ptBR });
}

function AccountCard({ account, actions }: { account: Account; actions: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-4">
        <Avatar className="h-12 w-12">
          {account.photoURL && <AvatarImage src={account.photoURL} alt={account.displayName || ''} />}
          <AvatarFallback className="text-sm font-semibold">{getInitials(account.displayName)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0 space-y-0.5">
          <p className="font-medium text-sm truncate">{account.displayName || 'Sem nome'}</p>
          <p className="text-xs text-muted-foreground truncate">{account.email}</p>
          <p className="text-xs text-muted-foreground">Criado em: {formatTimestamp(account.createdAt)}</p>
          {account.renewalDate && (
            <p className="text-xs text-muted-foreground">Renovação: {formatTimestamp(account.renewalDate)}</p>
          )}
        </div>
        <div className="flex flex-col gap-2 shrink-0">{actions}</div>
      </CardContent>
    </Card>
  );
}

export function Admin() {
  const { user, isAdmin } = useAuth();
  const { accounts, loading, approveAccount, suspendAccount, reactivateAccount, updateRenewalDate } = useAccounts();

  // Redirect if not admin (handled via tab visibility, but safety check)
  if (!isAdmin) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Acesso não autorizado.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const pending = accounts.filter(a => a.status === 'pending');
  const active = accounts.filter(a => a.status === 'active');
  const suspended = accounts.filter(a => a.status === 'suspended');

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Gerenciamento de Contas</h1>

      <Tabs defaultValue="pending">
        <TabsList className="w-full">
          <TabsTrigger value="pending" className="flex-1 gap-1">
            Pendentes <Badge variant="secondary" className="ml-1 text-xs">{pending.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="active" className="flex-1 gap-1">
            Ativas <Badge variant="secondary" className="ml-1 text-xs">{active.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="suspended" className="flex-1 gap-1">
            Suspensas <Badge variant="secondary" className="ml-1 text-xs">{suspended.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-3 mt-3">
          {pending.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">Nenhuma conta pendente.</p>}
          {pending.map(acc => (
            <AccountCard
              key={acc.uid}
              account={acc}
              actions={
                <>
                  <Button size="sm" className="gap-1" onClick={() => approveAccount(acc.uid, user!.uid)}>
                    <Check className="w-4 h-4" /> Aprovar
                  </Button>
                  <Button size="sm" variant="destructive" className="gap-1" onClick={() => suspendAccount(acc.uid)}>
                    <Ban className="w-4 h-4" /> Rejeitar
                  </Button>
                </>
              }
            />
          ))}
        </TabsContent>

        <TabsContent value="active" className="space-y-3 mt-3">
          {active.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">Nenhuma conta ativa.</p>}
          {active.map(acc => (
            <AccountCard
              key={acc.uid}
              account={acc}
              actions={
                <>
                  <Button size="sm" variant="outline" className="gap-1" onClick={() => suspendAccount(acc.uid)}>
                    <Ban className="w-4 h-4" /> Suspender
                  </Button>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button size="sm" variant="outline" className="gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        {acc.renewalDate ? formatTimestamp(acc.renewalDate) : 'Renovação'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="single"
                        selected={acc.renewalDate?.toDate?.() || undefined}
                        onSelect={(date) => date && updateRenewalDate(acc.uid, date)}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </>
              }
            />
          ))}
        </TabsContent>

        <TabsContent value="suspended" className="space-y-3 mt-3">
          {suspended.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">Nenhuma conta suspensa.</p>}
          {suspended.map(acc => (
            <AccountCard
              key={acc.uid}
              account={acc}
              actions={
                <Button size="sm" variant="outline" className="gap-1" onClick={() => reactivateAccount(acc.uid)}>
                  <RotateCcw className="w-4 h-4" /> Reativar
                </Button>
              }
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

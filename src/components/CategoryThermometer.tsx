import { cn } from '@/lib/utils';
import { getThermometerStatus } from '@/types/finance';

interface CategoryThermometerProps {
  spent: number;
  limit: number;
  compact?: boolean;
}

export function CategoryThermometer({ spent, limit, compact }: CategoryThermometerProps) {
  if (limit <= 0) {
    return compact ? null : (
      <span className="text-xs text-muted-foreground">Sem limite definido</span>
    );
  }

  const pct = Math.min((spent / limit) * 100, 120);
  const displayPct = Math.round((spent / limit) * 100);
  const status = getThermometerStatus(displayPct);

  const barColor = {
    safe: 'bg-safe',
    warning: 'bg-warning',
    critical: 'bg-critical',
    exceeded: 'bg-critical',
  }[status];

  const glowClass = {
    safe: 'glow-safe',
    warning: 'glow-warning',
    critical: 'glow-critical',
    exceeded: 'glow-critical',
  }[status];

  return (
    <div className="w-full">
      <div className={cn("w-full rounded-full overflow-hidden", compact ? "h-1.5" : "h-2.5", "bg-secondary")}>
        <div
          className={cn("h-full rounded-full transition-all duration-700 ease-out", barColor, !compact && glowClass)}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      {!compact && (
        <div className="flex justify-between mt-1">
          <span className="text-xs text-muted-foreground">
            R$ {spent.toFixed(0)} / R$ {limit.toFixed(0)}
          </span>
          <span className={cn("text-xs font-semibold", {
            'text-safe': status === 'safe',
            'text-warning': status === 'warning',
            'text-critical': status === 'critical' || status === 'exceeded',
          })}>
            {displayPct}%{status === 'exceeded' && ' — Ultrapassado!'}
          </span>
        </div>
      )}
    </div>
  );
}

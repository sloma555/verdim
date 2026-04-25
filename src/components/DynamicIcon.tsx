import React from 'react';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';

interface DynamicIconProps {
  name: string | undefined;
  className?: string;
  fallback?: React.ReactNode;
}

export function DynamicIcon({ name, className, fallback }: DynamicIconProps) {
  if (!name) return <>{fallback}</>;

  // Check if it's an emoji
  if (/\p{Emoji}/u.test(name) && name.length <= 4) {
    return <span className={cn("inline-flex items-center justify-center", className)}>{name}</span>;
  }

  // Try to find Lucide icon
  // Handle kebab-case (e.g., 'shopping-cart' -> 'ShoppingCart')
  const camelName = name
    .split('-')
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join('') as keyof typeof Icons;

  const Icon = Icons[camelName] as React.ElementType;

  if (Icon) {
    return <Icon className={cn("w-4 h-4", className)} />;
  }

  return <>{fallback}</>;
}

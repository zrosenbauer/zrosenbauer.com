import { cn } from '@utils/cn';
import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

const badgeVariants = cva(
  'inline-flex items-center gap-1 border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider transition-colors',
  {
    variants: {
      variant: {
        default: 'border-primary/40 bg-primary/15 text-primary',
        secondary: 'border-border bg-secondary text-secondary-foreground',
        destructive: 'border-destructive/40 bg-destructive/15 text-destructive',
        outline: 'border-border text-foreground',
        accent: 'border-accent/40 bg-accent/15 text-accent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

const Badge = ({ className, variant, ...props }: BadgeProps) => (
  <div className={cn(badgeVariants({ variant }), className)} {...props} />
);

export { Badge, badgeVariants };

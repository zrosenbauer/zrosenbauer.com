'use client';

import React from 'react';
import cn from 'classnames';

export const Popout: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ children, className }) => {
  return (
    <article className={cn('p-4 border rounded-xl border-zinc-600', className)}>
      {children}
    </article>
  );
};

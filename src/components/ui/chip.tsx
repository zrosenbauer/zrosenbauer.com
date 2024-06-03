'use client';

import cn from 'classnames';
import React from 'react';

export function Chip(props: {
  label: React.ReactNode;
  icon?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  dark?: boolean;
}) {
  return (
    <span
      onClick={props.onClick}
      className={cn('px-2.5 py-0.5 rounded-full text-xs font-medium', {
        'inline-flex items-center space-x-1': !!props.icon,
        'bg-zinc-100 text-zinc-800': !props.dark,
        'bg-zinc-400 text-zinc-900': props.active && !props.dark,
        'bg-zinc-800 text-zinc-200': props.dark,
        'bg-zinc-700 text-zinc-200': props.active && props.dark,
        'cursor-pointer': !!props.onClick,
        'hover:bg-zinc-400 hover:text-zinc-900': !!props.onClick && !props.dark,
        'hover:bg-zinc-700 hover:text-zinc-200': !!props.onClick && props.dark,
      })}
    >
      {props.icon && <span className='text-xs'>{props.icon}</span>}
      <span className='text-base'>{props.label}</span>
    </span>
  );
}

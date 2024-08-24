'use client';

import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconMail,
} from '@tabler/icons-react';
import Link from 'next/link';
import React from 'react';

const socialLinks = [
  {
    href: 'https://linkedin.com/in/zacrosenbauer',
    icon: IconBrandLinkedin,
  },
  {
    icon: IconMail,
    href: 'mailto:me@zrosenbauer.com',
  },
  {
    href: 'https://github.com/zrosenbauer',
    icon: IconBrandGithub,
  },
];

// biome-ignore lint/complexity/noBannedTypes: needed for future
export type NavigationProps = {};

export const Footer: React.FC = () => {
  return (
    <footer
    // className={`fixed inset-x-0 top-0 z-50 backdrop-blur  duration-200 border-b  ${
    //   isIntersecting ?
    //     'bg-zinc-900/0 border-transparent'
    //   : 'bg-zinc-900/500  border-zinc-800 '
    // }`}
    >
      <div className='container flex flex-row items-center justify-between p-6 mx-auto'>
        <div>@zrosenbauer All Rights Reserved.</div>
        <div className='flex-grow' />
        <div className='flex justify-between gap-8'>
          {socialLinks.map(({ href, icon: Icon }) => (
            <Link
              key={href}
              target='_blank'
              rel='noopener noreferrer'
              href={href}
            >
              <Icon className='w-6 h-6 duration-200 hover:font-medium' />
              {/* <Icon className={`w-6 h-6 duration-200 hover:font-medium ${isIntersecting ?
                    ' text-zinc-400 hover:text-zinc-100'
                    : 'text-zinc-600 hover:text-zinc-900'
                  } `}
                /> */}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

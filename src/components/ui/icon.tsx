import dynamic from 'next/dynamic'
import dynamicIconImports from 'lucide-react/dynamicIconImports';
import { IconBrandDocker, IconBrandGithub, IconBrandNextjs } from '@tabler/icons-react';

const tablerIcons = ['brand-docker', 'brand-github', 'brand-nextjs'] as const;

type TablerIcon = typeof tablerIcons[number];

type LucideIcon = keyof typeof dynamicIconImports;

export interface IconProps {
  name: LucideIcon | TablerIcon;
  size?: number;
}

export const Icon = ({ name, ...props }: IconProps) => {
  if (tablerIcons.find((icon) => icon === name)) {
    switch (name) {
      case 'brand-docker':
        return <IconBrandDocker {...props} />;
      case 'brand-github':
        return <IconBrandGithub {...props} />;
      case 'brand-nextjs':
        return <IconBrandNextjs {...props} />;
      default:
        throw new Error(`Unknown tabler icon: ${name}`);
    }
  } else {
    const LucideIcon = dynamic(dynamicIconImports[name as LucideIcon])
    return <LucideIcon {...props} />;
  }
};

import {
  IconBrandDocker,
  IconBrandGithub,
  IconBrandNextjs,
  IconBrandReact,
  IconBrandX,
  IconBuildingCarousel,
  IconExclamationCircle,
  IconTools,
} from '@tabler/icons-react';

const tablerIcons = [
  'brand-x',
  'brand-docker',
  'brand-github',
  'brand-nextjs',
  'brand-react',
  'tools',
  'exclamation-circle',
  'building-carousel',
] as const;

type TablerIcon = (typeof tablerIcons)[number];

export interface IconProps {
  name: TablerIcon;
  size?: number;
}

export const Icon = ({ name, ...props }: IconProps) => {
  switch (name) {
    case 'exclamation-circle':
      return <IconExclamationCircle {...props} />;
    case 'tools':
      return <IconTools {...props} />;
    case 'building-carousel':
      return <IconBuildingCarousel {...props} />;
    case 'brand-x':
      return <IconBrandX {...props} />;
    case 'brand-docker':
      return <IconBrandDocker {...props} />;
    case 'brand-github':
      return <IconBrandGithub {...props} />;
    case 'brand-nextjs':
      return <IconBrandNextjs {...props} />;
    case 'brand-react':
      return <IconBrandReact {...props} />;
    default:
      throw new Error(`Unknown tabler icon: ${name}`);
  }
};

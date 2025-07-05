import React from 'react';
import { Code, Github } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

export const Logo = ({ size = 'md', animated = true, className }: LogoProps) => {
  const sizeClasses = {
    sm: {
      container: 'w-8 h-8',
      icon: 'w-4 h-4',
      badge: 'w-3 h-3',
      badgeIcon: 'w-1.5 h-1.5',
      text: 'text-sm'
    },
    md: {
      container: 'w-12 h-12',
      icon: 'w-6 h-6',
      badge: 'w-4 h-4',
      badgeIcon: 'w-2 h-2',
      text: 'text-lg'
    },
    lg: {
      container: 'w-16 h-16',
      icon: 'w-8 h-8',
      badge: 'w-6 h-6',
      badgeIcon: 'w-3 h-3',
      text: 'text-2xl'
    }
  };

  const classes = sizeClasses[size];

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className={cn('font-bold text-white', classes.text)}>
        Repo<strong className="bg-green-500 text-white px-1 rounded">Mind</strong>
      </div>
    </div>
  );
};

export const LogoText = ({ size = 'md', className }: Omit<LogoProps, 'animated'>) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl'
  };

  return (
    <div className={cn('font-bold text-white', sizeClasses[size], className)}>
      Repo<strong className="bg-green-500 text-white px-1 rounded">Mind</strong>
    </div>
  );
}; 
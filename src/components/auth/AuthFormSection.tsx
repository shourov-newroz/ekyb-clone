import { cn } from '@/lib/utils';

interface AuthFormSectionProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'grid' | 'column';
}

export const AuthFormSection = ({
  children,
  className,
  variant = 'column',
}: AuthFormSectionProps) => {
  return (
    <div
      className={cn(
        {
          'grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6': variant === 'grid',
          'grid grid-cols-1 gap-4 sm:gap-6': variant === 'column',
        },
        className
      )}
    >
      {children}
    </div>
  );
};

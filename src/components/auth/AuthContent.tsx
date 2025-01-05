import { cn } from '@/lib/utils';

interface AuthContentProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export const AuthContent = ({
  title,
  description,
  children,
  className,
}: AuthContentProps) => {
  return (
    <div className={cn('space-y-4', className)}>
      <h1 className='text-pretty font-bukra-semibold text-2xl font-semibold leading-normal sm:text-3xl'>
        {title}
      </h1>
      {description && (
        <p className='text-pretty font-bukra-semibold text-xs text-gray-700 sm:text-base'>
          {description}
        </p>
      )}
      {children}
    </div>
  );
};

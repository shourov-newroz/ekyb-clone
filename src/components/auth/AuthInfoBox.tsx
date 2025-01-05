import { cn } from '@/lib/utils';

interface AuthInfoBoxProps {
  children: React.ReactNode;
  className?: string;
}

export const AuthInfoBox = ({ children, className }: AuthInfoBoxProps) => {
  return (
    <p
      className={cn(
        'p-3 text-xs sm:text-sm font-medium rounded-md bg-[#f5f7fb] text-[#213c81] font-bukra-semibold',
        className
      )}
    >
      {children}
    </p>
  );
};

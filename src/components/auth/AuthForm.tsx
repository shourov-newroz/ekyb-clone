import LoadingSvg from '@/components/loading/LoadingSvg';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AuthFormProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
  submitText?: string;
  disabled?: boolean;
  className?: string;
}

export const AuthForm = ({
  children,
  onSubmit,
  isLoading,
  submitText = 'Next',
  disabled,
  className,
}: AuthFormProps) => {
  return (
    <form onSubmit={onSubmit} className={cn('w-full mt-8 sm:mt-10', className)}>
      <div className='space-y-6'>{children}</div>

      <div className='mt-8 flex w-full justify-end border-t border-gray-300 sm:mt-10'>
        <Button type='submit' className='mt-4' size='lg' disabled={disabled}>
          {isLoading ? (
            <LoadingSvg className='size-6 text-white sm:size-8' />
          ) : (
            submitText
          )}
        </Button>
      </div>
    </form>
  );
};

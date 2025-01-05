import LoadingSvg from '@/components/loading/LoadingSvg';

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner = ({
  className = 'text-gray-700',
  size = 'md',
}: LoadingSpinnerProps) => {
  const sizeMap = {
    sm: 'size-8',
    md: 'size-12',
    lg: 'size-16',
  };

  return (
    <div className='flex w-full flex-1 items-center justify-center'>
      <LoadingSvg className={`${className} ${sizeMap[size]}`} />
    </div>
  );
};

export default LoadingSpinner;

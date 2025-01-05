import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { RightArrowIcon } from '@/utils/Icons';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface MenuGroupProps {
  id: string;
  name: string;
  description: string;
  link: string;
  complete: number;
  disabled: boolean;
}

const MenuCard: React.FC<MenuGroupProps> = ({
  id,
  name,
  description,
  link,
  complete,
  disabled,
}) => {
  const navigate = useNavigate();

  return (
    <div
      key={id}
      className={cn(
        'bg-white rounded-lg p-4 sm:p-6 flex flex-col h-full transition-all duration-200 ease-in-out shadow-md border-gray-200',
        {
          'opacity-60': disabled,
          'cursor-pointer hover:shadow-lg': !disabled,
        }
      )}
      aria-disabled={disabled}
      onClick={() => {
        if (!disabled) {
          navigate(link);
        }
      }}
    >
      <div className='mb-4 flex items-center justify-between gap-4 border-b border-gray-300 pb-4'>
        <h3
          className={cn(
            'text-base md:text-lg font-bukra-semibold',
            disabled ? 'text-gray-400' : 'text-gray-900'
          )}
        >
          {name}
        </h3>

        <RightArrowIcon
          className={cn(
            'size-10 md:size-12 p-4 rounded-full flex-shrink-0',
            disabled
              ? 'bg-primary/10 text-gray-500'
              : 'bg-primary/20 text-primary'
          )}
        />
      </div>
      <p
        className={cn(
          'text-xs md:text-sm font-medium',
          disabled ? 'text-gray-400' : 'text-gray-600'
        )}
      >
        {description}
      </p>
      <div className='mt-auto flex items-center gap-4'>
        {/* <div className='relative w-full h-2 overflow-hidden bg-gray-200 rounded-full'>
          <div
            className={cn(
              'h-full bg-primary rounded-full transition-all duration-500 ease-in-out',
              disabled ? 'w-full bg-gray-400' : `w-[${complete}%]`
            )}
          />
        </div> */}
        <Progress value={complete} />
        <div className='flex items-center justify-end'>
          <span
            className={cn(
              'flex items-center justify-center text-xs md:text-base rounded-full font-bold size-10 md:size-14 flex-shrink-0',
              disabled
                ? 'bg-primary/10 text-gray-500'
                : 'bg-primary/20 text-primary'
            )}
          >
            {complete}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;

import { cn } from '@/lib/utils';
import React from 'react';

interface CardItemProps {
  title: string;
  value: string;
  titleClass?: string;
  valueClass?: string;
}

const CardItem: React.FC<CardItemProps> = ({
  title,
  value,
  titleClass,
  valueClass,
}) => {
  return (
    <div className='space-y-0.5'>
      <p className={cn('text-xs font-medium text-gray-400', titleClass)}>
        {title}
      </p>
      <p className={cn('text-sm font-semibold text-gray-700', valueClass)}>
        {value}
      </p>
    </div>
  );
};

CardItem.displayName = 'CardItem';

const CardItemContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return <div className={cn('space-y-3', className)}>{children}</div>;
};

CardItemContainer.displayName = 'CardItemContainer';

export { CardItem, CardItemContainer };

import { IconType } from '@/utils/Icons';
import React from 'react';

interface IFormContainerProps {
  children: React.ReactNode;
  Icon?: IconType;
  menuTitle: string;
  subMenuGirding?: string;
  subMenuTitle: string;
  subMenuDescription?: string;
}

const FormContainer: React.FC<IFormContainerProps> = ({
  children,
  Icon,
  menuTitle,
  subMenuGirding = "Let's fill your",
  subMenuTitle,
  subMenuDescription,
}) => {
  return (
    <div className='flex flex-1 flex-col gap-4 md:gap-8'>
      {/* Header Section */}
      <div className='flex w-full items-center gap-3'>
        {Icon && (
          <div className='flex size-9 items-center justify-center rounded-full bg-secondary/15 p-2 sm:size-10 lg:size-12'>
            <Icon className='size-5 text-primary sm:size-6' />
          </div>
        )}
        <h2 className='text-pretty font-bukra-semibold text-sm sm:text-base'>
          {menuTitle}
        </h2>
      </div>

      {/* Main Content */}
      <main className='flex w-full flex-col gap-6 md:gap-10'>
        <div className='space-y-4 md:space-y-6'>
          <h1 className='heading-underline text-pretty font-bukra-semibold text-2xl font-semibold leading-normal sm:text-3xl'>
            {subMenuGirding}{' '}
            <span className='text-primary'>{subMenuTitle}</span>
          </h1>
          {subMenuDescription && (
            <p className='text-pretty font-bukra-semibold text-xs text-gray-700 sm:text-base'>
              {subMenuDescription}
            </p>
          )}
        </div>

        {/* Form Content */}
        <div className='w-full transition-all duration-300 lg:w-2/3'>
          {children}
        </div>
      </main>
    </div>
  );
};

export default FormContainer;

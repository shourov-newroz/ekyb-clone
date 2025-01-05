import { cn } from '@/lib/utils';
import { IMenus } from '@/types/common';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: IMenus['subMenus'];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const navRef = React.useRef<HTMLDivElement>(null);
  const [progressHeight, setProgressHeight] = React.useState(0);
  const [progressWidth, setProgressWidth] = React.useState(0);

  const handleNavigate = (item: IMenus['subMenus'][0]) => {
    if (!item.disabled) {
      navigate(item.href);
    }
  };

  const activeIndex = items.findIndex((item) => item.href === pathname);

  React.useEffect(() => {
    const updateProgress = () => {
      if (navRef.current) {
        const items = navRef.current.querySelectorAll('.nav-item');
        if (activeIndex >= 0 && items[activeIndex]) {
          const activeItem = items[activeIndex] as HTMLElement;

          // Vertical progress bar height for desktop
          const itemBottom = activeItem.offsetTop + activeItem.offsetHeight;
          setProgressHeight(itemBottom);

          // Horizontal progress bar width for mobile
          const itemWidth = activeItem.offsetLeft + activeItem.offsetWidth;
          setProgressWidth(itemWidth);
        }
      }
    };

    updateProgress();
    window.addEventListener('resize', updateProgress);
    return () => window.removeEventListener('resize', updateProgress);
  }, [activeIndex]);

  return (
    <nav
      ref={navRef}
      className={cn('flex flex-col w-full relative', '', className)}
      {...props}
    >
      <div
        className={cn(
          'flex flex-row gap-2 w-full',
          'lg:flex-col md:gap-1',
          'overflow-x-auto',
          'mb-3 lg:mb-0'
        )}
      >
        {items.map((item, index) => (
          <div
            key={item.href}
            className='nav-item relative flex w-full items-center'
          >
            <div
              onClick={() => handleNavigate(item)}
              className={cn(
                'justify-center lg:justify-start font-bukra-semibold whitespace-nowrap',
                'w-auto lg:w-full',
                'text-xs sm:text-sm',
                'px-3 py-2 lg:py-2.5 lg:px-4 lg:pl-5',
                item.disabled && 'opacity-50 cursor-default',
                !item.disabled && 'cursor-pointer hover:text-secondary',
                index <= activeIndex ? 'text-secondary' : 'text-gray-600'
              )}
            >
              {item.title}
            </div>
          </div>
        ))}
      </div>

      {/* Progress Bars */}
      {/* Horizontal Progress Bar for Mobile */}
      <div className='absolute inset-x-0 bottom-0 h-1.5 rounded-full bg-gray-200 lg:hidden ' />
      <div
        className='absolute bottom-0 left-0 h-1.5 rounded-full bg-secondary transition-all duration-300 ease-in-out lg:hidden '
        style={{
          width: `${progressWidth}px`,
        }}
      />

      {/* Vertical Progress Bar for Desktop */}
      <div className='absolute inset-y-1 left-1 hidden w-1.5 rounded-full bg-gray-200 lg:block ' />
      <div
        className='absolute left-1 top-0 hidden w-1.5 rounded-full bg-secondary from-secondary transition-all duration-300 ease-in-out lg:block '
        style={{
          height: `${progressHeight}px`,
        }}
      />
    </nav>
  );
}

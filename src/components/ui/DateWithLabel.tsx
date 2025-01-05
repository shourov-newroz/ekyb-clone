import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ERROR_CLASS } from '@/config/config';
import { cn } from '@/lib/utils';
import { CalendarIcon } from '@/utils/Icons';
import { format } from 'date-fns';
import React, { useState } from 'react';
import { BiError } from 'react-icons/bi';
import { useFormField } from './form';
import { Label } from './label';

interface DateWithLabelProps {
  label: string;
  disabled?: boolean;
  value: Date | null; // Value from the form
  onChange: (date: Date | null) => void; // onChange handler from the form
  error?: string; // Error message for validation
  name: string;
}

const DateWithLabel = React.forwardRef<HTMLDivElement, DateWithLabelProps>(
  ({ label, disabled, value, onChange }, ref) => {
    const { error } = useFormField();

    const [popoverOpen, setPopoverOpen] = useState(false);

    const handleDateChange = (date: Date | undefined) => {
      setPopoverOpen(false);
      onChange(date || null); // Convert undefined back to null for form state
    };

    return (
      <div ref={ref}>
        <div
          className={cn(
            'relative flex items-center bg-lightBG ring-[1px] rounded-lg overflow-hidden',
            disabled
              ? 'ring-gray-300 bg-gray-200'
              : error
              ? 'ring-[1px] ring-error outline outline-2 outline-error'
              : popoverOpen
              ? 'ring-[1px] ring-black outline-black'
              : 'ring-input'
          )}
        >
          <Popover
            open={popoverOpen}
            onOpenChange={(open) => setPopoverOpen(open)}
          >
            <PopoverTrigger asChild id={label}>
              <button
                type='button'
                disabled={disabled}
                className={cn(
                  'w-full pt-7 pb-3 pr-20 px-3 md:px-4 text-base font-semibold text-gray-900 outline-none h-16 flex items-center justify-between',
                  disabled ? 'text-gray-500 bg-gray-200' : 'bg-lightBG'
                )}
                aria-invalid={!!error}
              >
                {value && format(new Date(value), 'PPP')}
              </button>
            </PopoverTrigger>
            <PopoverContent
              className='w-auto border-gray-300 p-0'
              align='start'
            >
              <Calendar
                mode='single'
                selected={value || undefined} // Convert null to undefined
                onSelect={handleDateChange}
                disabled={(date) =>
                  date > new Date() || date < new Date('1900-01-01')
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* Label */}
          <Label
            htmlFor={label} // Associate the label with the SelectTrigger using htmlFor
            className={cn(
              'absolute text-sm duration-300 transform transition-all top-[12px] z-10 origin-[0] left-3 font-bukra font-medium',
              popoverOpen || value
                ? 'scale-90 -translate-y-1'
                : 'scale-100 translate-y-2.5',
              !disabled && error ? 'text-error' : 'text-gray-800',
              disabled ? 'opacity-80' : 'cursor-pointer',
              'peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1 -translate-x-0.5'
            )}
          >
            {label}
          </Label>

          <div
            className={cn(
              'flex items-center absolute right-3 md:right-4 gap-2',
              disabled ? 'bg-gray-200' : 'bg-transparent'
            )}
          >
            {/* Error icon */}
            {error && !disabled && (
              <BiError
                className={cn(
                  'size-6 md:size-7 text-red-600 flex-shrink-0',
                  ERROR_CLASS
                )}
                aria-hidden='true'
              />
            )}

            {/* Down arrow icon */}
            <CalendarIcon
              className={cn(
                'size-6 md:size-7 flex-shrink-0',
                error ? 'text-error' : '',
                disabled ? 'text-gray-500' : 'text-gray-800'
              )}
            />
          </div>
        </div>
      </div>
    );
  }
);

export default DateWithLabel;

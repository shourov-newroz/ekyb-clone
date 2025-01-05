import { ERROR_CLASS } from '@/config/config';
import { cn } from '@/lib/utils';
import React from 'react';
import { BiError } from 'react-icons/bi';
import { useFormField } from './form';
import { Input } from './input';
import { Label } from './label';

interface InputWithPrefixProps extends React.ComponentPropsWithoutRef<'input'> {
  label: string;
  prefix: string;
}

const InputWithPrefix = React.forwardRef<
  HTMLInputElement,
  InputWithPrefixProps
>(({ label, prefix, className, disabled, placeholder, ...props }, ref) => {
  const { error } = useFormField();

  return (
    <div>
      <div
        className={cn(
          'relative flex items-center bg-lightBG',
          'ring-[1px] rounded-lg focus-within:ring-[1px] overflow-hidden',
          disabled
            ? ' ring-gray-300 bg-gray-200'
            : error
            ? 'ring-[1px] ring-error outline outline-2 outline-error'
            : 'ring-input focus-within:ring-black focus-within:outline-black',
          className
        )}
      >
        <span
          className={cn(
            'mt-4 pl-3 text-base font-semibold text-gray-600 md:pl-4',
            placeholder ? 'mt-4' : '3.5'
          )}
        >
          {prefix}
        </span>
        <Input
          aria-invalid={error ? 'true' : 'false'}
          className={cn(
            'peer block w-full pt-7 pb-3 text-base font-semibold text-gray-900 outline-none',
            placeholder ? 'px-1' : 'px-3 md:px-4',
            disabled
              ? 'text-gray-500 bg-gray-200 cursor-default'
              : 'bg-lightBG cursor-pointer',
            'focus:text-black'
          )}
          ref={ref}
          {...props}
          id={props.name}
          disabled={disabled}
          placeholder={placeholder}
        />
        <Label
          className={cn(
            'absolute text-sm duration-300 transform transition-all -translate-y-2.5 scale-90 top-[18px] z-10 origin-[0] left-3 md:left-4 font-bukra font-medium',

            !disabled && error
              ? 'text-error peer-focus:text-error'
              : 'text-gray-800 peer-focus:text-foreground',
            '-translate-x-px',
            disabled ? 'opacity-70' : 'cursor-pointer'
          )}
          htmlFor={props.name}
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
        </div>
      </div>
    </div>
  );
});

export default InputWithPrefix;

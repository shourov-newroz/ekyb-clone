import { ERROR_CLASS } from '@/config/config';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import { BiError, BiHide, BiShow } from 'react-icons/bi';
import { Input } from './input';
import { Label } from './label';

interface InputWithLabelProps extends React.ComponentPropsWithoutRef<'input'> {
  label: string;
  placeholder?: never;
  error?: string;
}

const InputWithLabel = React.forwardRef<HTMLInputElement, InputWithLabelProps>(
  ({ label, className, error, disabled, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    // Toggles password visibility
    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    return (
      <div className=''>
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
            <Input
              aria-invalid={error ? 'true' : 'false'}
              className={cn(
                'peer pr-20 block w-full peer pt-7 pb-3 px-3 md:px-4 text-base font-semibold text-gray-900 outline-none focus:text-black',
                disabled
                  ? 'text-gray-500 bg-gray-200 cursor-default'
                  : 'bg-lightBG cursor-pointer',
                type === 'password' && !showPassword && 'tracking-[4px]'
              )}
              ref={ref}
              placeholder=''
              {...props}
              id={props.name}
              disabled={disabled}
              type={type === 'password' && showPassword ? 'text' : type}
            />
            <Label
              className={cn(
                'absolute text-sm duration-300 transform transition-all -translate-y-2.5 scale-90 top-[18px] z-10 origin-[0] left-3 md:left-4 font-bukra font-medium',

                !disabled && error
                  ? 'text-error peer-focus:text-error'
                  : 'text-gray-800 peer-focus:text-foreground',
                'peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1 peer-focus:scale-90 peer-focus:-translate-y-2.5 -translate-x-px',
                disabled ? 'opacity-80' : 'cursor-pointer'
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
              {/* Password toggle icon */}
              {type === 'password' && !disabled && (
                <button
                  type='button'
                  onClick={togglePasswordVisibility}
                  className='size-6 shrink-0 text-gray-500 hover:text-gray-700 focus:outline-none md:size-8'
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <BiHide className='size-6 md:size-7' />
                  ) : (
                    <BiShow className='size-6 md:size-7' />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {error && (
          <p className='mt-2 text-xs font-medium text-error'>{error}</p>
        )}
      </div>
    );
  }
);

export default InputWithLabel;

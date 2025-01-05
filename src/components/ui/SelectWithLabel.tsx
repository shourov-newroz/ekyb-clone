import { ERROR_CLASS } from '@/config/config';
import { cn } from '@/lib/utils';
import { IApiResponse, IOptionResponse } from '@/types/common';
import { DownArrowIcon } from '@/utils/Icons';
import React, { useState } from 'react';
import { BiError } from 'react-icons/bi';
import useSWR from 'swr';
import LoadingSvg from '../loading/LoadingSvg';
import { useFormField } from './form';
import { Label } from './label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';

interface SelectWithLabelPropsBase {
  label: string;
  className?: string;
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

interface SelectWithLabelPropsWithOptions extends SelectWithLabelPropsBase {
  options: { value: string; label: string }[];
  optionsUrl?: never;
}

interface SelectWithLabelPropsWithoutOptions extends SelectWithLabelPropsBase {
  options?: never;
  optionsUrl: string | null;
}

type SelectWithLabelProps =
  | SelectWithLabelPropsWithOptions
  | SelectWithLabelPropsWithoutOptions;

const SelectWithLabel = React.forwardRef<
  HTMLButtonElement,
  SelectWithLabelProps
>(
  (
    { label, options, optionsUrl, className, disabled, value, onChange },
    ref
  ) => {
    const { error } = useFormField();
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    const { data, isLoading: isDataLoading } = useSWR<
      IApiResponse<IOptionResponse>
    >(optionsUrl ? optionsUrl : null);

    const optionsData =
      options ||
      data?.data.data.map((item) => ({
        value: item.id.toString(),
        label: item.value,
      })) ||
      [];

    const disabledOptions = disabled || isDataLoading;

    return (
      <div className='relative'>
        <div
          className={cn(
            'relative flex items-center bg-lightBG ring-[1px] rounded-lg overflow-hidden',
            disabledOptions
              ? 'ring-gray-300 bg-gray-200'
              : error
              ? 'ring-[1px] ring-error outline outline-2 outline-error'
              : isFocused
              ? 'ring-[1px] ring-black outline-black'
              : 'ring-input',
            className
          )}
        >
          <Select
            onValueChange={onChange}
            defaultValue={value}
            value={value}
            onOpenChange={(open) => {
              if (open) handleFocus();
              else handleBlur();
            }}
            disabled={disabledOptions}
          >
            <SelectTrigger
              id={label} // Set an id for the SelectTrigger
              ref={ref}
              className={cn(
                'w-full pt-7 pb-3 pr-20 px-3 md:px-4 text-base font-semibold text-gray-900 outline-none h-16',
                disabledOptions ? 'text-gray-500 bg-gray-200' : 'bg-lightBG'
              )}
            >
              <SelectValue placeholder=' ' />
            </SelectTrigger>
            <SelectContent>
              {optionsData.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Label
            htmlFor={label} // Associate the label with the SelectTrigger using htmlFor
            className={cn(
              'absolute text-sm duration-300 transform transition-all top-[12px] z-10 origin-[0] left-3 md:left-4 font-bukra font-medium',
              isFocused || value
                ? 'scale-90 -translate-y-1'
                : 'scale-100 translate-y-2.5',
              !disabledOptions && error ? 'text-error' : 'text-gray-800',
              disabledOptions ? 'opacity-80' : 'cursor-pointer',
              'peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1 -translate-x-0.5'
            )}
          >
            {label}
          </Label>
          <div
            className={cn(
              'flex items-center absolute right-3 md:right-4 gap-2',
              disabledOptions ? 'bg-gray-200' : 'bg-transparent'
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
            {isDataLoading && (
              <LoadingSvg className='size-4 text-gray-500 md:size-5' />
            )}
            {/* Down arrow icon */}
            <DownArrowIcon
              className={cn(
                'size-3 md:size-4 focus:outline-none flex-shrink-0',
                disabledOptions ? 'text-gray-500' : 'text-gray-800'
              )}
            />
          </div>
        </div>
      </div>
    );
  }
);

export default SelectWithLabel;

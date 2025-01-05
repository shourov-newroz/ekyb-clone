import { buttonVariants } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { IApiResponse, IOptionResponse } from '@/types/common';
import React from 'react';
import useSWR from 'swr';
import LoadingSvg from '../loading/LoadingSvg';
import { useFormField } from './form';

interface TabsWithLabelPropsBase {
  label: string;
  value: string; // Current value from the form
  onChange: (value: string) => void; // onChange handler
  name: string; // Form field name
  disabled?: boolean; // Whether the component is disabled
}

interface TabsWithLabelPropsWithOptions extends TabsWithLabelPropsBase {
  options: { value: string; label: string }[];
  optionsUrl?: never;
}

interface TabsWithLabelPropsWithoutOptions extends TabsWithLabelPropsBase {
  options?: never;
  optionsUrl: string | null;
}

type TabsWithLabelProps =
  | TabsWithLabelPropsWithOptions
  | TabsWithLabelPropsWithoutOptions;

const RadioWithLabel = React.forwardRef<HTMLDivElement, TabsWithLabelProps>(
  ({ label, options, optionsUrl, value, onChange, name, disabled }, ref) => {
    const { error } = useFormField();

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
      <div ref={ref} className='space-y-2 md:space-y-2'>
        <Label
          htmlFor={name}
          className={cn(
            'text-sm scale-90 z-10 font-bukra-semibold font-medium',
            !disabledOptions && error
              ? 'text-error peer-focus:text-error'
              : 'text-gray-800 peer-focus:text-foreground',
            disabledOptions ? '' : 'cursor-pointer'
          )}
        >
          {label}
        </Label>
        {isDataLoading ? (
          <div className='flex items-center gap-2 text-sm text-gray-500'>
            <LoadingSvg className='size-4' />
            <span className=''>Loading...</span>
          </div>
        ) : (
          <div className='flex flex-wrap gap-2 md:gap-4'>
            {optionsData.map((option) => (
              <button
                type='button'
                key={option.value}
                className={cn(
                  buttonVariants({
                    variant: value === option.value ? 'default' : 'outline',
                  }),
                  value === option.value
                    ? 'border-primary bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'border-input bg-lightBG hover:bg-accent enabled:hover:text-accent-foreground',
                  value === option.value
                    ? {
                        'hover:bg-primary/60 bg-primary/60 ': disabledOptions,
                        border: !disabledOptions,
                      }
                    : {
                        ' bg-gray-200 hover:bg-gray-200 text-gray-500':
                          disabledOptions,
                        border: !disabledOptions,
                      },
                  'cursor-pointer',
                  disabledOptions ? 'cursor-default disabled:opacity-100' : '',
                  !disabledOptions && error
                    ? 'border-error border-2 text-error'
                    : '',
                  'px-6'
                )}
                onClick={() => !disabledOptions && onChange(option.value)}
                disabled={disabledOptions}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
);

RadioWithLabel.displayName = 'RadioWithLabel';

export default RadioWithLabel;

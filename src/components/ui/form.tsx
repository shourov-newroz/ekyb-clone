import * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from 'react-hook-form';

import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { BackIcon } from '@/utils/Icons';
import { PencilIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import LoadingSvg from '../loading/LoadingSvg';
import { Button } from './button';

const Form = FormProvider;

const FormStyle = React.forwardRef<
  HTMLFormElement,
  React.HTMLAttributes<HTMLFormElement>
>(({ className, ...props }, ref) => {
  return (
    <form
      ref={ref}
      className={cn('space-y-4 md:space-y-6', className)}
      {...props}
    />
  );
});
FormStyle.displayName = 'FormStyle';

interface FormSubmitButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  isLoading?: boolean;
  notVisible?: boolean;
  previousFormHref?: string;
  text?: string;
  isEditMode?: boolean;
  isSubmitted?: boolean;
  setIsEditMode?: (isEditMode: boolean) => void;
}

const FormSubmitButton = React.forwardRef<
  HTMLButtonElement,
  FormSubmitButtonProps
>(
  (
    {
      children,
      className,
      isLoading = false,
      previousFormHref,
      isEditMode = false,
      isSubmitted = false,
      setIsEditMode,
      ...props
    },
    ref
  ) => {
    const showBackButton = Boolean(previousFormHref);
    const showEditButton = isSubmitted && !isEditMode;
    const showSubmitButton = isEditMode || !isSubmitted;

    const handleEditClick = () => {
      setIsEditMode?.(true);
    };

    return (
      <div
        className={cn(
          'flex w-full border-t border-gray-300 pt-4 items-center',
          showBackButton ? 'justify-between' : 'justify-end'
        )}
      >
        {/* Back Button */}
        {showBackButton && (
          <Link to={previousFormHref || ''}>
            <Button
              type='button'
              variant='link'
              className='gap-1 px-0 font-bukra-semibold'
            >
              <BackIcon />
              Back
            </Button>
          </Link>
        )}

        {/* Edit Button */}
        {showEditButton && (
          <Button
            type='button'
            variant='outline'
            onClick={handleEditClick}
            className='flex items-center gap-2'
          >
            <PencilIcon className='size-4' />
            Edit Information
          </Button>
        )}

        {/* Submit Button */}
        {showSubmitButton && (
          <Button
            type='submit'
            className={cn('flex items-center gap-2', className)}
            size='lg'
            ref={ref}
            aria-busy={isLoading}
            disabled={isLoading}
            {...props}
          >
            {isLoading ? (
              <LoadingSvg className='size-8 text-white' />
            ) : (
              children || (isEditMode ? 'Update Information' : 'Submit')
            )}
          </Button>
        )}
      </div>
    );
  }
);

FormSubmitButton.displayName = 'FormSubmitButton';

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
);

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn('space-y-2', className)} {...props} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = 'FormItem';

const ItemGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { error } = useFormField();

  return (
    <div
      ref={ref}
      className={cn(
        'space-y-2',
        'relative bg-lightBG',
        'ring-[1px] rounded-lg focus-within:ring-[1px] overflow-hidden',
        // disabled
        //   ? ' ring-gray-300 bg-gray-200'
        //   :
        error
          ? 'ring-[1px] ring-error outline outline-2 outline-error'
          : 'ring-input focus-within:ring-black focus-within:outline-black',
        className
      )}
      {...props}
    />
  );
});
ItemGroup.displayName = 'ItemGroup';

{
  /* <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <ItemGroup>
                <FormControl>
                  <InputWithLabel2 {...field} className='peer' />
                </FormControl>
                <FormLabel>Username</FormLabel>
              </ItemGroup>
              <FormMessage />
            </FormItem>
          )}
        /> */
}

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { formItemId, error } = useFormField();

  return (
    <Label
      ref={ref}
      className={cn(
        // 'absolute text-sm duration-300 transform transition-all -translate-y-2.5 -translate-x-px scale-90 top-[10px] z-10 origin-[0] left-3 md:left-4 font-medium ',
        // 'peer-focus:scale-90 peer-focus:-translate-y-2.5',
        // 'peer-placeholder-shown:translate-y-1 peer-placeholder-shown:scale-90',
        error
          ? 'text-error peer-focus:text-error'
          : 'text-gray-800 peer-focus:text-foreground',
        className
      )}
      htmlFor={formItemId}
      {...props}
    />
  );
});
FormLabel.displayName = 'FormLabel';

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
});
FormControl.displayName = 'FormControl';

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
});
FormDescription.displayName = 'FormDescription';

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message) : children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn('text-xs font-medium text-error', className)}
      {...props}
    >
      {body}
    </p>
  );
});
FormMessage.displayName = 'FormMessage';

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormStyle,
  FormSubmitButton,
  ItemGroup,
  useFormField,
};

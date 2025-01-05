import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { ElementType, forwardRef } from 'react';

const typographyVariants = cva('', {
  variants: {
    variant: {
      h1: 'scroll-m-20 font-bukra text-4xl font-extrabold tracking-tight lg:text-5xl',
      h2: 'scroll-m-20 font-bukra text-3xl font-semibold tracking-tight',
      h3: 'scroll-m-20 font-bukra text-2xl font-semibold tracking-tight',
      h4: 'scroll-m-20 font-bukra text-xl font-semibold tracking-tight',
      h5: 'scroll-m-20 font-bukra text-lg font-semibold tracking-tight',
      h6: 'scroll-m-20 font-bukra text-base font-semibold tracking-tight',
      'form-label': 'font-bukra text-sm font-medium',
      'form-label-floating':
        'absolute left-3 top-[18px] z-10 origin-[0] -translate-x-px -translate-y-2.5 scale-90 transform font-bukra text-sm font-medium transition-all duration-300 peer-placeholder-shown:translate-y-1 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2.5 peer-focus:scale-90 md:left-4',
      'form-message': 'text-xs font-medium',
      'form-description': 'text-sm',
      base: 'text-base font-semibold',
      small: 'text-sm font-medium',
      caption: 'text-xs',
    },
    textColor: {
      primary: 'text-primary',
      secondary: 'text-secondary',
      muted: 'text-muted-foreground',
      error: 'text-error',
      'gray-500': 'text-gray-500',
      'gray-600': 'text-gray-600',
      'gray-800': 'text-gray-800',
      'gray-900': 'text-gray-900',
      foreground: 'text-foreground',
    },
    state: {
      error: 'text-error peer-focus:text-error',
      disabled: 'cursor-default opacity-80',
      default: 'cursor-pointer text-gray-800 peer-focus:text-foreground',
    },
  },
  defaultVariants: {
    variant: 'base',
    textColor: 'gray-900',
  },
});

type TypographyVariantProps = VariantProps<typeof typographyVariants>;

export interface TypographyProps
  extends Omit<
    React.HTMLAttributes<HTMLElement>,
    keyof TypographyVariantProps
  > {
  as?: ElementType;
  variant?: TypographyVariantProps['variant'];
  textColor?: TypographyVariantProps['textColor'];
  state?: TypographyVariantProps['state'];
}

/**
 * Typography component that matches the project's existing text styles.
 * @component
 * @example
 * ```tsx
 * // Regular text
 * <Typography variant="base">Regular text</Typography>
 *
 * // Form label (static)
 * <Typography variant="form-label" state={error ? "error" : "default"}>
 *   Label text
 * </Typography>
 *
 * // Form label (floating)
 * <Typography variant="form-label-floating" state={error ? "error" : "default"}>
 *   Floating label
 * </Typography>
 *
 * // Form message
 * <Typography variant="form-message" textColor="error">
 *   Error message
 * </Typography>
 * ```
 */
const Typography = forwardRef<HTMLElement, TypographyProps>(
  (
    {
      as: Component = 'p',
      children,
      variant,
      textColor,
      state,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <Component
        ref={ref}
        className={cn(
          typographyVariants({ variant, textColor, state }),
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Typography.displayName = 'Typography';

export { Typography, typographyVariants };

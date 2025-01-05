import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { ElementType, forwardRef } from 'react';

const containerVariants = cva('', {
  variants: {
    layout: {
      form: 'space-y-4 md:space-y-6',
      'form-group': 'space-y-2',
      'form-item': 'relative flex items-center bg-lightBG',
      'form-submit': 'flex w-full items-center border-t border-gray-300 pt-4',
      'form-error': 'mt-2',
      'input-group':
        'relative flex items-center overflow-hidden rounded-lg bg-lightBG ring-[1px] focus-within:ring-[1px]',
      'button-group': 'flex flex-wrap gap-2 md:gap-4',
      'icon-group': 'absolute right-3 flex items-center gap-2 md:right-4',
    },
    spacing: {
      none: '',
      xs: 'space-y-2',
      sm: 'space-y-4',
      md: 'space-y-6',
      lg: 'space-y-8',
    },
    padding: {
      none: '',
      xs: 'p-2',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
    border: {
      none: '',
      input: 'ring-input focus-within:outline-black focus-within:ring-black',
      error: 'outline outline-2 outline-error ring-[1px] ring-error',
      disabled: 'ring-gray-300',
    },
    background: {
      none: '',
      light: 'bg-lightBG',
      white: 'bg-background',
      gray: 'bg-gray-200',
      transparent: 'bg-transparent',
    },
    state: {
      default: '',
      error: 'outline outline-2 outline-error ring-[1px] ring-error',
      disabled: 'cursor-default bg-gray-200',
    },
    display: {
      none: '',
      flex: 'flex',
      'flex-col': 'flex flex-col',
      grid: 'grid',
    },
    align: {
      none: '',
      center: 'items-center',
      start: 'items-start',
      end: 'items-end',
    },
    justify: {
      none: '',
      center: 'justify-center',
      between: 'justify-between',
      start: 'justify-start',
      end: 'justify-end',
    },
    rounded: {
      none: '',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
    },
    width: {
      none: '',
      full: 'w-full',
      auto: 'w-auto',
    },
  },
  defaultVariants: {
    layout: undefined,
    spacing: 'none',
    padding: 'none',
    border: 'none',
    background: 'none',
    state: 'default',
    display: 'none',
    align: 'none',
    justify: 'none',
    rounded: 'none',
    width: 'none',
  },
});

type ContainerVariantProps = VariantProps<typeof containerVariants>;

export interface ContainerProps
  extends Omit<React.HTMLAttributes<HTMLElement>, keyof ContainerVariantProps> {
  as?: ElementType;
  layout?: ContainerVariantProps['layout'];
  spacing?: ContainerVariantProps['spacing'];
  padding?: ContainerVariantProps['padding'];
  border?: ContainerVariantProps['border'];
  background?: ContainerVariantProps['background'];
  state?: ContainerVariantProps['state'];
  display?: ContainerVariantProps['display'];
  align?: ContainerVariantProps['align'];
  justify?: ContainerVariantProps['justify'];
  rounded?: ContainerVariantProps['rounded'];
  width?: ContainerVariantProps['width'];
}

/**
 * Container component that matches the project's existing layout patterns.
 * @component
 * @example
 * ```tsx
 * // Form layout
 * <Container layout="form">
 *   <Container layout="form-group">
 *     <Container
 *       layout="input-group"
 *       state={error ? "error" : "default"}
 *       background="light"
 *     >
 *       {children}
 *     </Container>
 *   </Container>
 * </Container>
 *
 * // Button group
 * <Container
 *   layout="button-group"
 *   display="flex"
 *   justify="between"
 * >
 *   <Button>Cancel</Button>
 *   <Button>Submit</Button>
 * </Container>
 * ```
 */
const Container = forwardRef<HTMLElement, ContainerProps>(
  (
    {
      as: Component = 'div',
      children,
      className,
      layout,
      spacing,
      padding,
      border,
      background,
      state,
      display,
      align,
      justify,
      rounded,
      width,
      ...props
    },
    ref
  ) => {
    return (
      <Component
        ref={ref}
        className={cn(
          containerVariants({
            layout,
            spacing,
            padding,
            border,
            background,
            state,
            display,
            align,
            justify,
            rounded,
            width,
          }),
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Container.displayName = 'Container';

export { Container, containerVariants };

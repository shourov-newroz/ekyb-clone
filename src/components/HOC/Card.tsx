import { cn } from '@/lib/utils';

function Card(props: { className?: string; children?: React.ReactNode }) {
  const { className, children, ...rest } = props;
  return (
    <div
      className={cn(
        'dark:!bg-navy-800 relative flex flex-col rounded-lg border-[1px] border-gray-200 bg-white bg-clip-border px-5 py-7 shadow-md shadow-[#F3F3F3] dark:border-[#ffffff33] dark:text-white dark:shadow-none ',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

function CardTitle(props: { children: React.ReactNode; className?: string }) {
  return (
    <h3
      className={cn(
        'text-base font-semibold dark:text-white mb-4',
        props.className
      )}
    >
      {props.children}
    </h3>
  );
}

export { Card, CardTitle };

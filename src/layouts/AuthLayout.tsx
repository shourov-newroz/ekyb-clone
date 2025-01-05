import { cn } from '@/lib/utils';

interface AuthLayoutProps {
  children: React.ReactNode;
  showAside?: boolean;
  asideImage?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  showAside = true,
  asideImage = './aside.jpg',
}) => {
  return (
    <section
      className={cn(
        'container flex flex-col items-center flex-1 gap-8 px-4 mx-auto lg:flex-row lg:gap-24',
        showAside ? 'justify-center' : ''
      )}
    >
      {children}

      {showAside && (
        <aside className='hidden max-h-[80vh] flex-1 lg:block'>
          <img
            src={asideImage}
            alt='Business illustration'
            className='size-full rounded-lg object-cover'
          />
        </aside>
      )}
    </section>
  );
};

export default AuthLayout;

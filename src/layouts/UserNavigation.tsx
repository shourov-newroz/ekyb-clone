import { Button } from '@/components/ui/button';
import useAuth from '@/hooks/useAuth';
import { ROUTE_PATH } from '@/routes/routePaths';
import { LoginIcon } from '@/utils/Icons';
import { Link, useLocation } from 'react-router-dom';

const UserNavigation = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <>
        {location.pathname === ROUTE_PATH.signUp ? (
          <Link to={ROUTE_PATH.signIn}>
            <span className='flex items-center gap-2 font-bukra-semibold text-sm'>
              <LoginIcon className='size-5' />
              <span>Sign In</span>
            </span>
          </Link>
        ) : (
          <Link to={ROUTE_PATH.signUp}>
            <span className='flex items-center gap-2 font-bukra-semibold text-sm'>
              <LoginIcon className='size-5' />
              <span>Sign Up</span>
            </span>
          </Link>
        )}
      </>
    );
  }

  return (
    <div className='hidden md:block'>
      {location.pathname.includes(ROUTE_PATH.form) &&
        location.pathname !== ROUTE_PATH.form && (
          <Button asChild variant='link'>
            <Link to={ROUTE_PATH.signUp}>
              <span className='flex items-center gap-2 text-sm font-semibold'>
                <span>Back to Dashboard</span>
              </span>
            </Link>
          </Button>
        )}
    </div>
  );
};

export default UserNavigation;

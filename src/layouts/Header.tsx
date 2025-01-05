import useAuth from '@/hooks/useAuth';
import useCompanyData from '@/hooks/useCompanyData';
import { ROUTE_PATH } from '@/routes/routePaths';
import { useNavigate } from 'react-router-dom';
import UserNavigation from '../layouts/UserNavigation';
import UserProfile from './UserProfile';

const Header = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { companyData } = useCompanyData();

  const handleHomeNavigate = () => {
    if (!isAuthenticated) {
      navigate(ROUTE_PATH.signUp);
      return;
    }

    if (
      !companyData?.submissionStatus ||
      companyData?.submissionStatus === 'ON_PROCESS'
    ) {
      navigate(ROUTE_PATH.form);
    } else {
      navigate(ROUTE_PATH.dashboard);
    }
  };

  return (
    <header className='sticky top-0 z-20 w-full border-b border-gray-300 bg-gray-100'>
      <div className='container mx-auto flex h-16 items-center justify-between px-4 lg:h-20'>
        <div className='flex items-center'>
          <h2
            className='cursor-pointer font-bukra-semibold text-base font-semibold sm:text-lg lg:text-xl'
            onClick={handleHomeNavigate}
          >
            Newroz BIZ
          </h2>
        </div>
        <div className='flex items-center gap-2 sm:gap-3 lg:gap-4'>
          <UserNavigation />
          <UserProfile />
        </div>
      </div>
    </header>
  );
};

export default Header;

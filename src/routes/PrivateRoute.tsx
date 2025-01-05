import LoadingSpinner from '@/components/loading/LoadingSpinner';
import useAuth from '@/hooks/useAuth';
import { AUTH_STATUS } from '@/types/auth';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const { status } = useAuth();

  // Handling authentication states
  const renderContent = () => {
    switch (status) {
      case AUTH_STATUS.PENDING:
        return <LoadingSpinner />;

      case AUTH_STATUS.SUCCEEDED:
        return <Outlet />;

      default:
        return <Navigate to='/' replace />;
    }
  };

  return <>{renderContent()}</>;
};

export default PrivateRoute;

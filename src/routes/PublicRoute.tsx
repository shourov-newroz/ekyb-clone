import BACKEND_ENDPOINTS from '@/api/urls';
import LoadingSpinner from '@/components/loading/LoadingSpinner';
import api from '@/config/apiConfig';
import useAuth from '@/hooks/useAuth';
import { AUTH_STATUS } from '@/types/auth';
import { IApiResponse, ICompanyInfoResponse } from '@/types/common';
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { ROUTE_PATH } from './routePaths';

const PublicRoute = () => {
  const { status, isAuthenticated } = useAuth();
  const [companyData, setCompanyData] = useState<
    ICompanyInfoResponse['company'] | null
  >(null);
  const [isCompanyLoading, setIsCompanyLoading] = useState(false);

  // Fetch company data using Axios
  useEffect(() => {
    if (isAuthenticated) {
      setIsCompanyLoading(true);
      api
        .get<IApiResponse<ICompanyInfoResponse>>(BACKEND_ENDPOINTS.COMPANY_INFO)
        .then((response) => {
          setCompanyData(response.data.data.company);
        })
        .catch((error) => {
          console.error('Error fetching company data:', error);
        })
        .finally(() => {
          setIsCompanyLoading(false);
        });
    }
  }, [isAuthenticated]);

  // const { data, isLoading: isCompanyLoading } = useSWR<
  //   IApiResponse<ICompanyInfoResponse>
  // >(isAuthenticated ? BACKEND_ENDPOINTS.COMPANY_INFO : null, {});

  // const companyData = data?.data?.company;

  // Handle authentication and navigation logic
  const renderContent = () => {
    // Step 1: Show loading while authentication is pending
    if (
      status === AUTH_STATUS.PENDING ||
      (isAuthenticated && isCompanyLoading) ||
      (isAuthenticated && !companyData)
    ) {
      return <LoadingSpinner />;
    }

    // Step 2: Handle authenticated state
    if (status === AUTH_STATUS.SUCCEEDED) {
      if (
        companyData?.submissionStatus === null ||
        companyData?.submissionStatus === 'ON_PROCESS'
      ) {
        // Redirect to Form route if submission is in progress
        return <Navigate to={ROUTE_PATH.form} replace />;
      }
      // Redirect to user dashboard for other statuses
      return <Navigate to={ROUTE_PATH.dashboard} replace />;
    }

    // Step 3: Render the public route component for unauthenticated users
    return <Outlet />;
  };

  return <>{renderContent()}</>;
};

export default PublicRoute;

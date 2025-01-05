import { CompanyDataContext } from '@/contexts/companyDataContext';
import { useContext } from 'react';

const useCompanyData = () => {
  const context = useContext(CompanyDataContext);
  if (!context) {
    throw new Error('useCompanyData must be used within a CompanyDataProvider');
  }
  return context;
};

export default useCompanyData;

import PartnersManagementList from '@/components/pages/form/partners/PartnerManagmentList';
import { LOCAL_STORAGE_KEYS } from '@/config/config';
import { localStorageUtil } from '@/utils/localStorageUtil';
import { useEffect } from 'react';

const PartnersManagement = () => {
  // Clear form data when navigating to partner management
  useEffect(() => {
    localStorageUtil.removeItem(LOCAL_STORAGE_KEYS.PARTNER_FORM_STORAGE_KEY);
  }, []);
  return <PartnersManagementList />;
};

export default PartnersManagement;

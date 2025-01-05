import { ROUTE_PATH } from '@/routes/routePaths';
import { ICompanyData } from '@/types/common';

const getMenuHref = (companyData: ICompanyData, menuName: string) => {
  if (menuName === 'Company Profile') {
    if (companyData?.profileCompletion?.COMPANY_PROFILE?.COMPANY_CAPITAL) {
      return ROUTE_PATH.companyProfileInformation;
    } else if (
      companyData?.profileCompletion?.COMPANY_PROFILE?.COMPANY_ADDRESS
    ) {
      return ROUTE_PATH.companyProfileCapital;
    } else if (
      companyData?.profileCompletion?.COMPANY_PROFILE?.COMPANY_DOCUMENT
    ) {
      return ROUTE_PATH.companyProfileAddress;
    } else if (
      companyData?.profileCompletion?.COMPANY_PROFILE?.COMPANY_INFORMATION
    ) {
      return ROUTE_PATH.companyProfileDocument;
    } else {
      return ROUTE_PATH.companyProfileInformation;
    }
  } else if (menuName === 'Company Ownership Details') {
    if (
      companyData?.profileCompletion?.COMPANY_OWNERSHIP?.OWNER_PERMANENT_ADDRESS
    ) {
      return ROUTE_PATH.ownershipPersonalDocument;
    }
    // else if (
    //   companyData?.profileCompletion?.COMPANY_OWNERSHIP?.OWNER_PERMANENT_ADDRESS
    // ) {
    //   return ROUTE_PATH.ownershipAdditionalPartners;
    // }
    else if (
      companyData?.profileCompletion?.COMPANY_OWNERSHIP?.PERSONAL_INFORMATION
    ) {
      return ROUTE_PATH.ownershipPersonalAddress;
    } else if (
      companyData?.profileCompletion?.COMPANY_OWNERSHIP?.PERSONAL_DOCUMENT
    ) {
      return ROUTE_PATH.ownershipPersonalInformation;
    } else {
      return ROUTE_PATH.ownershipPersonalDocument;
    }
  }
  return '';
};

export default getMenuHref;

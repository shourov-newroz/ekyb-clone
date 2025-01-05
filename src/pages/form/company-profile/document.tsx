import CompanyDocumentForm from '@/components/pages/form/company-profile/CompanyDocumentForm';
import useCompanyData from '@/hooks/useCompanyData';
import { useLocation } from 'react-router-dom';

const CompanyDocument = () => {
  const { companyData, menus } = useCompanyData();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const organizationTypeFromQuery = queryParams.get('organizationType');

  const subMenu = menus?.find(
    (menu) => menu.name === 'Company Profile'
  )?.subMenus;

  const isFormSubmitted =
    !!companyData?.profileCompletion?.COMPANY_PROFILE?.COMPANY_DOCUMENT;

  return (
    <CompanyDocumentForm
      defaultValues={{
        tradeLicense: companyData?.tradeLicense || '',
        TINorBIN: companyData?.TINorBIN || '',
        partnershipDeedFirstPage: companyData?.partnershipDeedFirstPage || '',
        partnershipDeedSixthPage: companyData?.partnershipDeedSixthPage || '',
        MOA: companyData?.MOA || '',
        AOA: companyData?.AOA || '',
        certificateOfIncorporation:
          companyData?.certificateOfIncorporation || '',
        certificateOfCoOperation: companyData?.certificateOfCoOperation || '',
        chairmanRecommendationLetter:
          companyData?.chairmanRecommendationLetter || '',
      }}
      organizationType={
        companyData?.organizationType?.key.toString() ||
        organizationTypeFromQuery ||
        ''
      }
      isSubmitted={isFormSubmitted}
      nextFormHref={subMenu?.[2].href || ''}
      previousFormHref={subMenu?.[0]?.href || ''}
    />
  );
};

export default CompanyDocument;

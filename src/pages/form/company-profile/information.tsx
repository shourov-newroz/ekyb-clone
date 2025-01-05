import CompanyInformationForm from '@/components/pages/form/company-profile/CompanyInformationForm';
import useCompanyData from '@/hooks/useCompanyData';

const CompanyInformation = () => {
  const { companyData, menus } = useCompanyData();

  const subMenu = menus?.find(
    (menu) => menu.name === 'Company Profile'
  )?.subMenus;

  const isFormSubmitted =
    !!companyData?.profileCompletion?.COMPANY_PROFILE?.COMPANY_INFORMATION;

  return (
    <CompanyInformationForm
      defaultValues={{
        businessName: companyData?.businessName || '',
        accountType: companyData?.accountType?.key.toString() || '',
        organizationType: companyData?.organizationType?.key.toString() || '',
        businessCategory: companyData?.businessCategory?.key.toString() || '',
      }}
      isSubmitted={isFormSubmitted}
      nextFormHref={subMenu?.[1].href || ''}
    />
  );
};

export default CompanyInformation;

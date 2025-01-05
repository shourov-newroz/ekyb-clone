import CompanyAddressForm from '@/components/pages/form/company-profile/CompanyAddressForm';
import useCompanyData from '@/hooks/useCompanyData';

const CompanyAddress = () => {
  const { companyData, menus } = useCompanyData();

  const subMenu = menus?.find(
    (menu) => menu.name === 'Company Profile'
  )?.subMenus;

  const isFormSubmitted =
    !!companyData?.profileCompletion?.COMPANY_PROFILE?.COMPANY_ADDRESS;

  return (
    <CompanyAddressForm
      defaultValues={{
        officeType: companyData?.officeType?.key.toString() || '',
        addressProofDocumentType:
          companyData?.addressProofDocumentType?.key.toString() || '',
        addressProofDocument: companyData?.addressProofDocument || '',
        presentDivision:
          companyData?.presentCompanyAddress?.division.key.toString() || '',
        presentDistrict:
          companyData?.presentCompanyAddress?.district.key.toString() || '',
        presentThana:
          companyData?.presentCompanyAddress?.thana.key.toString() || '',
        presentVillage: companyData?.presentCompanyAddress?.village || '',
        presentAddress: companyData?.presentCompanyAddress?.address || '',
        presentPostCode:
          companyData?.presentCompanyAddress?.postCode.toString() || '',
        presentPostOffice: companyData?.presentCompanyAddress?.postOffice || '',
        presentLandlineNumber:
          companyData?.presentCompanyAddress?.landLineNumber || '',
        sameAsCompanyAddress: companyData?.sameAsCompanyAddress ? 'yes' : 'no',
        tradeDivision:
          companyData?.mailingAddress?.division.key.toString() || '',
        tradeDistrict:
          companyData?.mailingAddress?.district.key.toString() || '',
        tradeThana: companyData?.mailingAddress?.thana.key.toString() || '',
        tradeVillage: companyData?.mailingAddress?.village || '',
        tradeAddress: companyData?.mailingAddress?.address || '',
        tradePostCode: companyData?.mailingAddress?.postCode.toString() || '',
        tradePostOffice: companyData?.mailingAddress?.postOffice || '',
        tradeLandlineNumber: companyData?.mailingAddress?.landLineNumber || '',
      }}
      isSubmitted={isFormSubmitted}
      nextFormHref={subMenu?.[3]?.href || ''}
      previousFormHref={subMenu?.[1]?.href || ''}
    />
  );
};

export default CompanyAddress;

import OwnershipPersonalInformationForm from '@/components/pages/form/ownership/OwnershipPersonalInformation';
import useCompanyData from '@/hooks/useCompanyData';

const PersonalInformation = () => {
  const { companyData, menus } = useCompanyData();

  const subMenu = menus?.find(
    (menu) => menu.name === 'Company Ownership Details'
  )?.subMenus;

  const ownershipData = companyData;

  const isFormSubmitted =
    !!companyData?.profileCompletion?.COMPANY_OWNERSHIP?.PERSONAL_INFORMATION;

  return (
    <OwnershipPersonalInformationForm
      defaultValues={{
        fullName: ownershipData?.fullName || '',
        designation: ownershipData?.designation || '',
        fatherName: ownershipData?.fatherName || '',
        motherName: ownershipData?.motherName || '',
        husbandWifeName: ownershipData?.husbandWifeName || '',
        dateOfBirth: ownershipData?.dateOfBirth || new Date(),
        dateOfIssue: ownershipData?.dateOfIssue || new Date(),
        dateOfExpiry: ownershipData?.dateOfExpiry || new Date(),
        nationality: ownershipData?.nationality?.key.toString() || '',
        gender: ownershipData?.gender?.key.toString() || '',
        businessMobileNumber: ownershipData?.businessMobileNumber || '',
        sharePercent: ownershipData?.sharePercent || '',
        nidNumber: ownershipData?.nidNumber || '',
      }}
      isSubmitted={isFormSubmitted}
      nextFormHref={subMenu?.[2]?.href || ''}
      previousFormHref={subMenu?.[0]?.href || ''}
    />
  );
};

export default PersonalInformation;

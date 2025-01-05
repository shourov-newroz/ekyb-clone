import OwnershipPersonalAddressForm from '@/components/pages/form/ownership/OwnershipPersonalAddress';
import useCompanyData from '@/hooks/useCompanyData';
import { ROUTE_PATH } from '@/routes/routePaths';

const PersonalAddress = () => {
  const { companyData, menus } = useCompanyData();

  const subMenu = menus?.find(
    (menu) => menu.name === 'Company Ownership Details'
  )?.subMenus;

  const ownershipData = companyData;

  const isFormSubmitted =
    !!ownershipData?.profileCompletion?.COMPANY_OWNERSHIP
      ?.OWNER_PERMANENT_ADDRESS;

  return (
    <OwnershipPersonalAddressForm
      defaultValues={{
        presentDivision:
          ownershipData?.ownerPresentAddress?.division?.key.toString() || '',
        presentDistrict:
          ownershipData?.ownerPresentAddress?.district?.key.toString() || '',
        presentThana:
          ownershipData?.ownerPresentAddress?.thana?.key.toString() || '',
        presentVillage: ownershipData?.ownerPresentAddress?.village || '',
        presentAddress: ownershipData?.ownerPresentAddress?.address || '',
        presentPostCode:
          ownershipData?.ownerPresentAddress?.postCode?.toString() || '',
        presentPostOffice: ownershipData?.ownerPresentAddress?.postOffice || '',

        isSameAsPermanent: 'no',

        permanentDivision:
          ownershipData?.ownerPermanentAddress?.division?.key.toString() || '',
        permanentDistrict:
          ownershipData?.ownerPermanentAddress?.district?.key.toString() || '',
        permanentThana:
          ownershipData?.ownerPermanentAddress?.thana?.key.toString() || '',
        permanentVillage: ownershipData?.ownerPermanentAddress?.village || '',
        permanentAddress: ownershipData?.ownerPermanentAddress?.address || '',
        permanentPostCode:
          ownershipData?.ownerPermanentAddress?.postCode?.toString() || '',
        permanentPostOffice:
          ownershipData?.ownerPermanentAddress?.postOffice || '',
      }}
      isSubmitted={isFormSubmitted}
      nextFormHref={ROUTE_PATH.form}
      previousFormHref={subMenu?.[1]?.href || ''}
    />
  );
};

export default PersonalAddress;

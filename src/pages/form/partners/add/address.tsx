import PartnerAddressForm from '@/components/pages/form/partners/PartnerAddress';
import { usePartnerForm } from '@/context/PartnerFormContext';
import useCompanyData from '@/hooks/useCompanyData';

const AddPartnerAddress = () => {
  const { companyData, menus } = useCompanyData();
  const { formData } = usePartnerForm();

  const subMenu = menus?.find(
    (menu) => menu.name === 'Add New Partner'
  )?.subMenus;

  return (
    <PartnerAddressForm
      defaultValues={formData.address}
      disabled={
        !companyData?.profileCompletion?.COMPANY_OWNERSHIP
          ?.OWNER_PERMANENT_ADDRESS
      }
      nextFormHref={subMenu?.[2]?.href || ''}
      previousFormHref={subMenu?.[0]?.href || ''}
    />
  );
};

export default AddPartnerAddress;

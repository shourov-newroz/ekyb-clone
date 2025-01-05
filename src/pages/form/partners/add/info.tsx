import PartnerInformationForm from '@/components/pages/form/partners/PartnerInformation';
import { usePartnerForm } from '@/context/PartnerFormContext';
import useCompanyData from '@/hooks/useCompanyData';
import { ROUTE_PATH } from '@/routes/routePaths';

const AddPartnerInformation = () => {
  const { companyData, menus } = useCompanyData();
  const { formData } = usePartnerForm();

  const subMenu = menus?.find(
    (menu) => menu.name === 'Add New Partner'
  )?.subMenus;

  return (
    <PartnerInformationForm
      defaultValues={formData.information}
      disabled={
        !companyData?.profileCompletion?.COMPANY_OWNERSHIP
          ?.OWNER_PERMANENT_ADDRESS
      }
      nextFormHref={subMenu?.[1]?.href || ''}
      previousFormHref={ROUTE_PATH.partnerManagement}
    />
  );
};

export default AddPartnerInformation;

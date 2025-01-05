import PartnerDocumentForm from '@/components/pages/form/partners/PartnerDocument';
import { usePartnerForm } from '@/context/PartnerFormContext';
import useCompanyData from '@/hooks/useCompanyData';

const AddPartnerDocument = () => {
  const { companyData, menus } = useCompanyData();
  const { formData } = usePartnerForm();

  const subMenu = menus?.find(
    (menu) => menu.name === 'Add New Partner'
  )?.subMenus;

  return (
    <PartnerDocumentForm
      defaultValues={{
        ...formData.document,
        documentType: formData.information?.IDType,
        signature: formData.document?.signature || null,
      }}
      disabled={
        !companyData?.profileCompletion?.COMPANY_OWNERSHIP
          ?.OWNER_PERMANENT_ADDRESS
      }
      previousFormHref={subMenu?.[1]?.href || ''}
      subMenu={subMenu}
    />
  );
};

export default AddPartnerDocument;

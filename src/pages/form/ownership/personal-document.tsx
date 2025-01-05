import OwnershipPersonalDocumentForm from '@/components/pages/form/ownership/OwnershipPersonalDocuemnt';
import useCompanyData from '@/hooks/useCompanyData';

const PersonalDocument = () => {
  const { companyData, menus } = useCompanyData();

  const subMenu = menus?.find(
    (menu) => menu.name === 'Company Ownership Details'
  )?.subMenus;

  const ownershipData = companyData;

  const isFormSubmitted =
    !!companyData?.profileCompletion?.COMPANY_OWNERSHIP?.PERSONAL_DOCUMENT;

  return (
    <OwnershipPersonalDocumentForm
      defaultValues={{
        documentType: ownershipData?.documentType?.key.toString() || '',
        passportPhoto: ownershipData?.passportPhoto || null,
        workPermitPhoto: ownershipData?.workPermitPhoto || null,
        nidFrontPhoto: ownershipData?.nidFrontPhoto || null,
        nidBackPhoto: ownershipData?.nidBackPhoto || null,
        ownerPhoto: ownershipData?.ownerPhoto || null,
      }}
      isSubmitted={isFormSubmitted}
      nextFormHref={subMenu?.[1]?.href || ''}
    />
  );
};

export default PersonalDocument;

import OwnershipAdditionalPartnersForm from '@/components/pages/form/ownership/OwnershipAdditionalPartners';
import useCompanyData from '@/hooks/useCompanyData';
import { ROUTE_PATH } from '@/routes/routePaths';

const PersonalAdditionalPartners = () => {
  const { companyData, menus } = useCompanyData();

  // Find the relevant submenu
  const subMenu = menus?.find(
    (menu) => menu.name === 'Company Ownership Details'
  )?.subMenus;

  // Extract ownership data from companyData
  const additionalPartners = companyData?.additionalPartners || [];

  const partners = additionalPartners.map((partner) => ({
    documentType: partner?.documentType?.key.toString() || '',
    passportPhoto: partner?.passportPhoto || null,
    workPermitPhoto: partner?.workPermitPhoto || null,
    nidFrontPhoto: partner?.nidFrontPhoto || null,
    nidBackPhoto: partner?.nidBackPhoto || null,
    ownerPhoto: partner?.ownerPhoto || null,
    fullName: partner?.fullName || '',
    role: partner?.role || '',
    dateOfBirth: partner?.dateOfBirth || null,
    dateOfIssue: partner?.dateOfIssue || null,
    dateOfExpiry: partner?.dateOfExpiry || null,
    nationality: partner?.nationality?.key.toString() || '',
    gender: partner?.gender?.key.toString() || '',
    sharePercent: partner?.sharePercent || '',
    idNumber: partner?.idNumber || '',
  }));

  return (
    <OwnershipAdditionalPartnersForm
      defaultValues={{
        partners:
          partners.length > 0
            ? partners
            : [
                {
                  documentType: '',
                  passportPhoto: null,
                  workPermitPhoto: null,
                  nidFrontPhoto: null,
                  nidBackPhoto: null,
                  ownerPhoto: null,
                  fullName: '',
                  role: '',
                  dateOfBirth: null,
                  dateOfIssue: null,
                  dateOfExpiry: null,
                  nationality: '',
                  gender: '',
                  sharePercent: '',
                  idNumber: '',
                },
              ],
      }}
      disabled={!!additionalPartners[0]?.documentType?.value}
      nextFormHref={ROUTE_PATH.form}
      previousFormHref={subMenu?.[2]?.href || ''}
    />
  );
};

export default PersonalAdditionalPartners;

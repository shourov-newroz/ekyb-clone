import RegulatoryDeclarationsForm from '@/components/pages/form/regulatory/RegulatoryDeclarationsForm';
import useCompanyData from '@/hooks/useCompanyData';
import { ROUTE_PATH } from '@/routes/routePaths';

const RegulatoryDeclarations = () => {
  const { companyData } = useCompanyData();

  return (
    <RegulatoryDeclarationsForm
      defaultValues={{
        isOnProcess:
          companyData?.submissionStatus !== 'ON_PROCESS' ? true : false,
      }}
      disabled={!['ON_PROCESS'].includes(companyData?.submissionStatus || '')}
      nextFormHref={ROUTE_PATH.dashboard}
    />
  );
};

export default RegulatoryDeclarations;

import BankOperationDetailsForm from '@/components/pages/form/bank-operation/BankOperationDetails';
import useCompanyData from '@/hooks/useCompanyData';
import { ROUTE_PATH } from '@/routes/routePaths';

const BankOperationDetailsPage = () => {
  const { companyData } = useCompanyData();

  const bankData = companyData;

  return (
    <BankOperationDetailsForm
      defaultValues={{
        bank: bankData?.bankDetailsBank?.key.toString() || '',
        branch: bankData?.bankBranch?.key.toString() || '',
        accountName: bankData?.bankAccountName || '',
        accountNumber: bankData?.bankAccountNumber || '',
        autoSettlement: bankData?.bankAccountName
          ? bankData?.bankAutoSettlement
            ? 'yes'
            : 'no'
          : '',
      }}
      disabled={!!companyData?.profileCompletion?.BANK_DETAILS?.BANK_DETAILS}
      nextFormHref={ROUTE_PATH.form}
    />
  );
};

export default BankOperationDetailsPage;

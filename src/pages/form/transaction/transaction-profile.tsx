import TransactionProfileForm from '@/components/pages/form/transation/TransactionProfile';
import useCompanyData from '@/hooks/useCompanyData';
import { ROUTE_PATH } from '@/routes/routePaths';

const TransactionProfile = () => {
  const { companyData } = useCompanyData();

  const isFormSubmitted =
    !!companyData?.profileCompletion?.TRANSACTION_DETAILS?.TRANSACTION_DETAILS;

  return (
    <TransactionProfileForm
      defaultValues={{
        highestVolume: companyData?.transactionHighestVolume?.toString() || '',
        netAssetRange: companyData?.transactionAssetRange?.key.toString() || '',
        monthlyTransactionAmount:
          companyData?.transactionAmount?.key.toString() || '',
        monthlyTransactionNumber:
          companyData?.transactionNumber?.key.toString() || '',
      }}
      isSubmitted={isFormSubmitted}
      nextFormHref={ROUTE_PATH.form}
    />
  );
};

export default TransactionProfile;

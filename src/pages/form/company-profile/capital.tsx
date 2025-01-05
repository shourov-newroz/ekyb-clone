import CompanyCapitalForm from '@/components/pages/form/company-profile/CompanyCapitalForm';
import useCompanyData from '@/hooks/useCompanyData';
import { ROUTE_PATH } from '@/routes/routePaths';

const CompanyCapital = () => {
  const { companyData, menus } = useCompanyData();

  const subMenu = menus?.find(
    (menu) => menu.name === 'Company Profile'
  )?.subMenus;

  const isFormSubmitted =
    !!companyData?.profileCompletion?.COMPANY_PROFILE?.COMPANY_CAPITAL;

  return (
    <CompanyCapitalForm
      defaultValues={{
        capitalInvestment: companyData?.capitalInvestment?.toString() || '',
        sourceOfFunds: companyData?.sourceOfFunds?.key.toString() || '',
        expectedAnnualTurnover:
          companyData?.expectedAnnualTurnover?.toString() || '',
        expectedAnnualTurnoverInWords:
          companyData?.expectedAnnualTurnoverInWords || '',
        hasExistingBankAccounts: companyData?.isBankStatementPresent
          ? 'yes'
          : 'no',
        bankStatements: companyData?.bankStatements
          ? companyData?.bankStatements
          : '',
        isPasswordProtected: companyData?.isBankStatementPasswordProtected
          ? 'yes'
          : 'no',
        bankStatementPassword: companyData?.bankStatementPassword || '',
      }}
      isSubmitted={isFormSubmitted}
      nextFormHref={ROUTE_PATH.form}
      previousFormHref={subMenu?.[2]?.href || ''}
    />
  );
};

export default CompanyCapital;

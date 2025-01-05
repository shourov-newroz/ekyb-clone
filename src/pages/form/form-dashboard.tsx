import LoadingSpinner from '@/components/loading/LoadingSpinner';
import FormMenus from '@/components/pages/form/FormMenus';
import useCompanyData from '@/hooks/useCompanyData';

const FormDashboard = () => {
  const { companyData, isLoading, isCalculating } = useCompanyData();

  if (isLoading || isCalculating) {
    return <LoadingSpinner />;
  }

  return (
    <section className='container mx-auto flex flex-1 flex-col gap-4 px-4 md:gap-8'>
      <main className='flex w-full flex-col gap-6 py-4 sm:py-8 md:gap-10 md:py-12'>
        <div className='space-y-4'>
          <h1 className='space-y-1 text-pretty font-bukra-semibold text-2xl font-semibold leading-normal sm:text-3xl'>
            <span> Lets continue with your apposition </span>
            <span className='block break-all text-primary md:inline-block'>
              {companyData?.applicationId}
            </span>
          </h1>
          <p className='text-pretty font-bukra-semibold text-sm text-gray-700 sm:text-base'>
            This is your application dashboard to track the progress of your
            application submition.
          </p>
        </div>

        {/* Form Menus */}
        <div className='w-full transition-all duration-300'>
          <FormMenus />
        </div>
      </main>
    </section>
  );
};

export default FormDashboard;

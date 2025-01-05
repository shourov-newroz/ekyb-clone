import { Card } from '@/components/HOC/Card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import useCompanyData from '@/hooks/useCompanyData';

const CompanyProfile = () => {
  const { companyData } = useCompanyData();

  return (
    <Card className='flex-row gap-5 bg-gradient-to-r from-blue-600 to-sky-500 p-8 text-white'>
      <div className=''>
        <Avatar className='cursor-default border-none bg-blue-900 text-white'>
          <AvatarFallback>
            {companyData?.businessName?.split(' ').map((name) => name[0])}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className='mt-3.5 space-y-4'>
        <h4 className='text-base font-bold uppercase leading-none md:text-lg'>
          {companyData?.businessName}
        </h4>
        <p className='text-sm'>
          Application reference no:{' '}
          <span className='text-base font-semibold'>{companyData?.id}</span>
        </p>
        <button className='rounded-md bg-white px-5 py-2 text-sm font-medium text-red-500'>
          Completed
        </button>
      </div>
    </Card>
  );
};

export default CompanyProfile;

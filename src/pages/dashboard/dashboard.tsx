import LoadingSpinner from '@/components/loading/LoadingSpinner';
import ApplicationTrack from '@/components/pages/dashboard/ApplicationTrack';
import CompanyProfile from '@/components/pages/dashboard/CompanyProfile';
import Partners from '@/components/pages/dashboard/Partners';
import ProductDetails from '@/components/pages/dashboard/ProductDetails';
import TradeLicense from '@/components/pages/dashboard/TradeLicense';
import UserProfile from '@/components/pages/dashboard/UserProfile';
import useAuth from '@/hooks/useAuth';
import useCompanyData from '@/hooks/useCompanyData';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

export const timelineData = [
  {
    id: 1,
    title: 'First event',
    date: '2022-01-01',
  },
  {
    id: 2,
    title: 'Second event',
    date: '2022-02-01',
  },
  {
    id: 3,
    title: 'Third event',
    date: '2022-03-01',
  },
  {
    id: 4,
    title: 'Fourth event',
    date: '2022-04-01',
  },
  {
    id: 5,
    title: 'Fifth event',
    date: '2022-05-01',
  },
];

const Dashboard = () => {
  const { user } = useAuth();
  const { isLoading } = useCompanyData();

  if (isLoading) return <LoadingSpinner />;
  return (
    <section className='container mx-auto flex flex-1 flex-col px-4 md:flex-row'>
      <main className='my-[30px] w-full space-y-4 md:space-y-6'>
        <div className=''>
          <h1 className='text-pretty font-bukra-semibold text-2xl font-semibold leading-normal sm:text-3xl'>
            Welcome Back, <span className='text-primary'>{user?.name}</span>
          </h1>
        </div>
        <ResponsiveMasonry
          className=''
          columnsCountBreakPoints={{ 750: 1, 1080: 2 }}
        >
          <Masonry gutter={'1rem'}>
            <CompanyProfile />
            <ApplicationTrack items={timelineData} />
            <ProductDetails />
            <Partners />
            <TradeLicense />
            <UserProfile />
          </Masonry>
        </ResponsiveMasonry>
      </main>
    </section>
  );
};

export default Dashboard;

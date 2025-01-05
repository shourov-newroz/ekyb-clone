import { Outlet } from 'react-router-dom';
import Header from './Header';

const MainLayout = () => {
  return (
    <div className='flex min-h-screen flex-col font-bukra'>
      <Header />

      <div className='flex h-full flex-1 flex-col'>
        <Outlet />
      </div>

      <footer className='flex h-20 items-center justify-center border-t border-gray-300 bg-gray-100'>
        <p className='text-sm text-gray-600'>
          &copy; {new Date().getFullYear()} Newroz BIZ. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default MainLayout;

import FormContainer from '@/components/HOC/FormContainer';
import LoadingSpinner from '@/components/loading/LoadingSpinner';
import { usePartnerForm } from '@/context/PartnerFormContext';
import useCompanyData from '@/hooks/useCompanyData';
import { useFormNavigation } from '@/hooks/useFormNavigation';
import { SidebarNav } from '@/layouts/SidebarNav';
import { IMenus } from '@/types/common';
import React from 'react';
import { Outlet } from 'react-router-dom';

interface FormLayoutPresenterProps {
  activeMenu?: IMenus;
  activeSubMenu?: IMenus['subMenus'][0];
  isLoading?: boolean;
}

const FormLayoutPresenter: React.FC<FormLayoutPresenterProps> = ({
  activeMenu,
  activeSubMenu,
  isLoading,
}) => {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className='flex flex-1 flex-col space-y-6 lg:container lg:mx-auto lg:px-4'>
      <div className='flex flex-1 flex-col space-y-4  lg:flex-row  lg:space-y-0'>
        <aside className='bg_body sticky top-[65px] z-20 h-full py-4 pb-3 max-lg:container max-lg:mx-auto max-lg:px-4 lg:top-[81px] lg:w-1/6 lg:py-32'>
          <SidebarNav items={activeMenu?.subMenus || []} />
        </aside>
        <div className='flex-1 border-gray-300 pb-8 max-lg:container max-lg:mx-auto max-lg:px-4 lg:ml-1 lg:border-l lg:p-16 lg:pt-10'>
          <FormContainer
            Icon={activeMenu?.Icon}
            menuTitle={activeMenu?.name || ''}
            subMenuGirding={activeSubMenu?.girding || "Let's fill your"}
            subMenuTitle={activeSubMenu?.title || ''}
            subMenuDescription={activeSubMenu?.description}
          >
            <Outlet />
          </FormContainer>
        </div>
      </div>
    </div>
  );
};

const FormLayout: React.FC<{ menuId?: number }> = ({ menuId }) => {
  const { menus, isLoading, isCalculating } = useCompanyData();
  const { activeMenu, activeSubMenu } = useFormNavigation({
    menus,
    menuId,
  });

  return (
    <FormLayoutPresenter
      activeMenu={activeMenu}
      activeSubMenu={activeSubMenu}
      isLoading={isLoading || isCalculating}
    />
  );
};

const PartnerFormLayout: React.FC = () => {
  const { menus, isLoading, isCalculating } = useCompanyData();
  const { formNavigation } = usePartnerForm();
  const { activeMenu, activeSubMenu } = useFormNavigation({
    menus,
    menuId: 8, // Add New Partner menu ID
    customNavigation: formNavigation,
  });

  return (
    <FormLayoutPresenter
      activeMenu={
        activeMenu ? { ...activeMenu, subMenus: formNavigation } : undefined
      }
      activeSubMenu={activeSubMenu}
      isLoading={isLoading || isCalculating}
    />
  );
};

export { FormLayout, PartnerFormLayout };

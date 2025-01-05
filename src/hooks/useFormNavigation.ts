import { IMenus } from '@/types/common';
import { useLocation } from 'react-router-dom';

interface UseFormNavigationProps {
  menus: IMenus[] | null;
  menuId?: number;
  customNavigation?: IMenus['subMenus'];
}

export const useFormNavigation = ({
  menus,
  menuId,
  customNavigation,
}: UseFormNavigationProps) => {
  const { pathname } = useLocation();

  const activeMenu = menus?.find((menu) => menu.id === menuId);

  const navigationItems = customNavigation || activeMenu?.subMenus || [];
  const activeSubMenu = navigationItems.find(
    (subMenu) => subMenu.href === pathname
  );

  const isLastStep =
    activeSubMenu &&
    navigationItems.indexOf(activeSubMenu) === navigationItems.length - 1;

  const nextStep =
    activeSubMenu && !isLastStep
      ? navigationItems[navigationItems.indexOf(activeSubMenu) + 1]
      : null;

  const previousStep =
    activeSubMenu && navigationItems.indexOf(activeSubMenu) > 0
      ? navigationItems[navigationItems.indexOf(activeSubMenu) - 1]
      : null;

  return {
    activeMenu,
    activeSubMenu,
    navigationItems,
    isLastStep,
    nextStep,
    previousStep,
  };
};

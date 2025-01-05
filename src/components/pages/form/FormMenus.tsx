import useCompanyData from '@/hooks/useCompanyData';
import MenuCard from './MenuCard';

const FormMenus = () => {
  const { menus } = useCompanyData();

  return (
    <div className='grid grid-cols-1 gap-4 pb-6 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3'>
      {menus
        ?.filter((menu) => menu.showInList !== false)
        .map((group) => (
          <MenuCard
            key={group.id}
            id={group.id.toString()}
            name={group.name}
            description={group.description}
            link={group.link}
            complete={group.complete}
            disabled={group.disabled}
          />
        ))}
    </div>
  );
};

export default FormMenus;

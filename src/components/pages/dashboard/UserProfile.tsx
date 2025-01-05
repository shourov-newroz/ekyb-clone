import { Card } from '@/components/HOC/Card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import useAuth from '@/hooks/useAuth';
import useCompanyData from '@/hooks/useCompanyData';
import { formatDate } from '@/lib/utils';
import { MailIcon, PhoneIcon } from 'lucide-react';
import { CardItem } from './CardItem';

const UserProfile = () => {
  const { user } = useAuth();
  const { companyData } = useCompanyData();

  return (
    <Card className='gap-8 p-8'>
      <div className='flex gap-5 border-b pb-8'>
        <div className=''>
          <Avatar className='cursor-default border-none bg-blue-900 text-white'>
            <AvatarFallback>
              {user?.name?.split(' ').map((name) => name[0])}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className='mt-3.5 space-y-2'>
          <h4 className='text-base font-bold leading-none'>{user?.name}</h4>
          {companyData?.createdDate && (
            <p className='text-sm text-gray-600'>
              Application creation date:{' '}
              <span className=''>{formatDate(companyData?.createdDate)}</span>
            </p>
          )}
        </div>
      </div>
      <div className='space-y-8'>
        <div className='flex items-center gap-4'>
          <MailIcon className='text-8xl text-primary' />
          <CardItem
            title='Email Address'
            value={user?.email || '--'}
            titleClass='text-primary font-semibold'
          />
        </div>
        <div className='flex items-center gap-4'>
          <PhoneIcon className='text-8xl text-primary' />
          <CardItem
            title='Mobile Number'
            value={'--'}
            titleClass='text-primary font-semibold'
          />
        </div>
      </div>
    </Card>
  );
};

export default UserProfile;

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import useAuth from '@/hooks/useAuth';
import { LogoutIcon } from '@/utils/Icons';

function UserProfile() {
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className='flex items-center space-x-2'>
          <Avatar className=''>
            <AvatarFallback>
              {user?.name?.split(' ').map((name) => name[0])}
            </AvatarFallback>
          </Avatar>
        </div>
      </PopoverTrigger>
      <PopoverContent className='w-72 focus:outline-none'>
        <div className='space-y-3'>
          <div className='space-y-0.5'>
            <h4 className='font-medium leading-none'>{user?.name}</h4>
            <p className='text-sm text-muted-foreground'>{user?.email}</p>
          </div>
          <Button
            variant={'outline'}
            onClick={handleLogout}
            className='w-full hover:bg-red-600 hover:text-white focus:outline-none'
          >
            <span>Logout</span>
            <LogoutIcon className='size-5' />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default UserProfile;

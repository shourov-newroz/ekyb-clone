import { Card, CardTitle } from '@/components/HOC/Card';
import LoadingSvg from '@/components/loading/LoadingSvg';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import useCompanyData from '@/hooks/useCompanyData';
import { IAdditionalPartner } from '@/types/common';
import { CardItem, CardItemContainer } from './CardItem';

const PartnerCard = ({ partner }: { partner: IAdditionalPartner }) => {
  return (
    <Card className='relative pb-16 shadow-md'>
      <Avatar className='size-9 cursor-default border-none bg-blue-900 text-white'>
        <AvatarFallback>
          {partner?.fullName?.split(' ').map((name) => name[0])}
        </AvatarFallback>
      </Avatar>
      <CardItemContainer className='mt-3'>
        <h4 className='pb-3 text-base font-bold leading-none'>
          {partner?.fullName}
        </h4>
        <CardItem title='Email' value={'--'} />
        <CardItem title='Mobile' value={'--'} />
        <CardItem
          title='Nationality'
          value={partner.nationality?.value || '--'}
        />
      </CardItemContainer>
    </Card>
  );
};

const Partners = () => {
  const { companyData, isLoading } = useCompanyData();
  return (
    <Card className='relative'>
      <Carousel className='static mx-auto w-full'>
        <div className='flex items-start justify-between'>
          <CardTitle>
            Partners{' '}
            {companyData?.additionalPartners?.length &&
              `(${companyData?.additionalPartners?.length})`}
          </CardTitle>
          <div className='mr-2 flex gap-3'>
            <CarouselPrevious customPosition />
            <CarouselNext customPosition />
          </div>
        </div>
        {isLoading ? (
          <div className='flex'>
            <Card className='flex h-80 shrink-0 items-center justify-center sm:basis-1/2 md:basis-[calc(40%-8px)]'>
              <LoadingSvg className='size-10' />
            </Card>
          </div>
        ) : (
          <CarouselContent className='-ml-1'>
            {companyData?.additionalPartners.map((partner, index) => (
              <CarouselItem
                key={index}
                className='shrink-0 px-2 sm:basis-1/2 md:basis-[40%]'
              >
                <PartnerCard partner={partner} />
              </CarouselItem>
            ))}
          </CarouselContent>
        )}
      </Carousel>
    </Card>
  );
};

export default Partners;

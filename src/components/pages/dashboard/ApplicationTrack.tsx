import { Card, CardTitle } from '@/components/HOC/Card';
import { Button } from '@/components/ui/button';
import {
  Timeline,
  TimelineConnector,
  TimelineHeader,
  TimelineIcon,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
} from '@/components/ui/timeline';
import { RefreshIcon } from '@/utils/Icons';

export interface TimelineElement {
  id: number;
  title: string;
  date: string;
}

interface TimelineLayoutProps {
  items: TimelineElement[]; // Replace any[] with the actual type of items.
}
const ApplicationTrack = ({ items }: TimelineLayoutProps) => {
  return (
    <Card>
      <div className='mb-4 flex justify-between'>
        <CardTitle>Track Your Application</CardTitle>
        <Button
          variant='outline'
          size={'sm'}
          className='border-primary bg-white text-primary'
        >
          <RefreshIcon />
          Refresh
        </Button>
      </div>
      <Timeline className='mx-2'>
        <TimelineItem>
          <TimelineConnector />
          <TimelineHeader>
            <TimelineTime>{items[0].date}</TimelineTime>
            <TimelineIcon />
            <TimelineTitle>{items[0].title}</TimelineTitle>
          </TimelineHeader>
        </TimelineItem>
        <TimelineItem>
          <TimelineConnector />
          <TimelineHeader>
            <TimelineTime>{items[1].date}</TimelineTime>
            <TimelineIcon />
            <TimelineTitle>{items[1].title}</TimelineTitle>
          </TimelineHeader>
        </TimelineItem>
        <TimelineItem>
          <TimelineConnector />
          <TimelineHeader>
            <TimelineTime>{items[2].date}</TimelineTime>
            <TimelineIcon />
            <TimelineTitle>{items[2].title}</TimelineTitle>
          </TimelineHeader>
        </TimelineItem>
        <TimelineItem>
          <TimelineConnector />
          <TimelineHeader>
            <TimelineTime>{items[3].date}</TimelineTime>
            <TimelineIcon />
            <TimelineTitle>{items[3].title}</TimelineTitle>
          </TimelineHeader>
        </TimelineItem>
        <TimelineItem>
          <TimelineHeader>
            <TimelineTime>{items[4].date}</TimelineTime>
            <TimelineIcon />
            <TimelineTitle>{items[4].title}</TimelineTitle>
          </TimelineHeader>
        </TimelineItem>
      </Timeline>
    </Card>
  );
};

export default ApplicationTrack;

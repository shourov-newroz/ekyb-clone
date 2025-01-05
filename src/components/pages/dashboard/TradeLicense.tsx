import { Card, CardTitle } from '@/components/HOC/Card';
import { CardItem, CardItemContainer } from './CardItem';

const TradeLicense = () => {
  return (
    <Card>
      <CardTitle>Trade License Details</CardTitle>
      <CardItemContainer>
        <CardItem title='Trade license no' value='1234' />
        <CardItem title='Trade license expiry date' value='2023-01-01' />
        <CardItem
          title='Trade license authority name'
          value='Trade Authority'
        />
      </CardItemContainer>
    </Card>
  );
};

export default TradeLicense;

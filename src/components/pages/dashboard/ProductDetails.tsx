import { Card, CardTitle } from '@/components/HOC/Card';
import { CardItem, CardItemContainer } from './CardItem';

const ProductDetails = () => {
  return (
    <Card>
      <CardTitle>Product Details</CardTitle>
      <CardItemContainer>
        <CardItem title='CF Number' value='CF-1234' />
        <CardItem title='Account Number' value='123456' />
        <CardItem title='Selected Product' value='Basic' />
        <CardItem title='Selected Addons' value='Paymentgateway, Zoho' />
      </CardItemContainer>
    </Card>
  );
};

export default ProductDetails;

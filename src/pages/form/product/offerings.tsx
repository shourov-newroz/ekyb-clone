import ProductOfferingsForm from '@/components/pages/form/product/offerings';
import useCompanyData from '@/hooks/useCompanyData';
import { ROUTE_PATH } from '@/routes/routePaths';

const ProductOfferingsPage = () => {
  const { companyData } = useCompanyData();

  const productData = companyData;

  return (
    <ProductOfferingsForm
      defaultValues={{
        products: productData?.productList?.map((product) => ({
          productOrServiceName: product.productOrServiceName,
          productDetails: product.productDetails,
          websiteLink: product.websiteLink || '',
        })) || [
          {
            productOrServiceName: '',
            productDetails: '',
            websiteLink: '',
          },
        ],
      }}
      disabled={!!companyData?.profileCompletion?.PRODUCTS_ADD_ONES?.PRODUCTS}
      nextFormHref={ROUTE_PATH.form}
    />
  );
};

export default ProductOfferingsPage;

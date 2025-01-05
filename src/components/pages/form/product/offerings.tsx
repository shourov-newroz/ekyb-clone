import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import InputWithLabelNew from '@/components/ui/InputWithLabelNew';
import TextAreaWithLabel from '@/components/ui/TextAreaWithLabel';
import { toast } from '@/hooks/useToast';
import { cn } from '@/lib/utils';
import { AddIcon, RemoveIcon } from '@/utils/Icons';

import { sendPostRequest } from '@/api/swrConfig';
import BACKEND_ENDPOINTS from '@/api/urls';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { FormStyle, FormSubmitButton } from '@/components/ui/form';
import useCompanyData from '@/hooks/useCompanyData';
import {
  IApiRequestWithMetaData,
  IApiResponse,
  IFormSubmissionResponse,
} from '@/types/common';
import { getMetaData } from '@/utils/getMetaData';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSWRMutation from 'swr/mutation';

// Validation schema
const schema = z.object({
  products: z.array(
    z.object({
      productOrServiceName: z.string().min(1, {
        message: 'Product/Service Name is required.',
      }),
      productDetails: z.string().min(1, {
        message: 'Product Details are required.',
      }),
      websiteLink: z
        .string()
        .url({
          message: 'Website link must be a valid URL.',
        })
        .optional(),
    })
  ),
});

type FormData = z.infer<typeof schema>;

interface IProductOfferingsFormProps {
  defaultValues: FormData;
  disabled: boolean;
  nextFormHref: string;
}

const ProductOfferingsForm: React.FC<IProductOfferingsFormProps> = ({
  defaultValues,
  disabled,
  nextFormHref,
}) => {
  const navigate = useNavigate();
  const { refreshData } = useCompanyData();
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'products',
  });

  const [openAccordion, setOpenAccordion] = useState<string>(fields[0]?.id);

  const { trigger, isMutating } = useSWRMutation(
    BACKEND_ENDPOINTS.SAVE_PRODUCT_OFFERINGS,
    sendPostRequest,
    {
      onSuccess: (data: IApiResponse<IFormSubmissionResponse>) => {
        toast({
          title:
            data.data.message || 'Product offerings submitted successfully',
        });
        refreshData();
        if (nextFormHref) {
          navigate(nextFormHref);
        }
      },
    }
  );

  useEffect(() => {
    if (form.formState.errors?.products) {
      // Find the first error index in the `products` array
      const firstErrorIndex = Object.keys(form.formState.errors.products).map(
        Number
      )[0]; // Get the smallest (first) index

      if (firstErrorIndex !== undefined) {
        setOpenAccordion(fields[firstErrorIndex]?.id);
      }
    }
  }, [form.formState.errors, fields]);

  const onSubmit = async (data: FormData) => {
    const formData: IApiRequestWithMetaData<FormData> = {
      metaInfo: getMetaData(),
      attributes: data,
    };
    trigger(formData);
  };

  return (
    <Form {...form}>
      <FormStyle onSubmit={form.handleSubmit(onSubmit)}>
        <Accordion
          type='single'
          collapsible
          value={openAccordion} // Controlled Accordion state
          onValueChange={setOpenAccordion} // Update state on Accordion change
        >
          {fields.map((field, index) => (
            <AccordionItem
              value={field.id}
              key={field.id}
              className={cn('space-y-4 border-b pb-4 mb-0', {
                'mb-4': index !== fields.length - 1,
              })}
            >
              <AccordionTrigger className='text-base font-bold md:text-lg'>
                Product {index + 1}
              </AccordionTrigger>
              <AccordionContent className='space-y-6'>
                {/* Product/Service Name */}
                <FormField
                  control={form.control}
                  name={`products.${index}.productOrServiceName`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputWithLabelNew
                          label='Product/Service Name'
                          {...field}
                          type='text'
                          disabled={disabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Product Details */}
                <FormField
                  control={form.control}
                  name={`products.${index}.productDetails`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <TextAreaWithLabel
                          label='Product Details'
                          {...field}
                          rows={3}
                          disabled={disabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Website Link */}
                <FormField
                  control={form.control}
                  name={`products.${index}.websiteLink`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputWithLabelNew
                          label='Website Link'
                          {...field}
                          type='text'
                          disabled={disabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Remove Button */}
                {fields.length > 1 && !disabled && (
                  <Button
                    type='button'
                    variant='destructive'
                    onClick={() => remove(index)}
                    className='mt-2'
                  >
                    <RemoveIcon />
                    <span>Remove Product</span>
                  </Button>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Add Product Button */}
        {!disabled && (
          <Button
            type='button'
            variant='outline'
            onClick={() =>
              append({
                productOrServiceName: '',
                productDetails: '',
                websiteLink: '',
              })
            }
          >
            <AddIcon />
            <span>Add Product</span>
          </Button>
        )}

        {/* Submit Button */}
        <FormSubmitButton isLoading={isMutating} notVisible={disabled} />
      </FormStyle>
    </Form>
  );
};

export default ProductOfferingsForm;

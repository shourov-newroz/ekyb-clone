import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { sendPostRequest } from '@/api/swrConfig';
import BACKEND_ENDPOINTS from '@/api/urls';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormStyle,
  FormSubmitButton,
} from '@/components/ui/form';
import InputWithLabelNew from '@/components/ui/InputWithLabelNew';
import RadioWithLabel from '@/components/ui/RadioWithLabel';
import useCompanyData from '@/hooks/useCompanyData';
import { toast } from '@/hooks/useToast';
import {
  IApiRequestWithMetaData,
  IApiResponse,
  IFormSubmissionResponse,
} from '@/types/common';
import { getMetaData } from '@/utils/getMetaData';
import { useNavigate } from 'react-router-dom';
import useSWRMutation from 'swr/mutation';

// Validation schema
const schema = z.object({
  highestVolume: z
    .string({
      required_error: 'Highest volume is required.',
    })
    .regex(/^\d+$/, { message: 'Highest volume must be a number.' })
    .min(0, { message: 'Value must be greater than or equal to 0.' }),
  netAssetRange: z.string().min(1, { message: 'Net asset range is required.' }),
  monthlyTransactionAmount: z
    .string()
    .min(1, { message: 'Monthly transaction amount is required.' }),
  monthlyTransactionNumber: z
    .string()
    .min(1, { message: 'Monthly transaction number is required.' }),
});

type FormData = z.infer<typeof schema>;

interface ITransactionProfileFormProps {
  defaultValues: FormData;
  isSubmitted: boolean;
  nextFormHref: string;
}

const TransactionProfileForm: React.FC<ITransactionProfileFormProps> = ({
  defaultValues,
  isSubmitted,
  nextFormHref,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();
  const { refreshData } = useCompanyData();
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { trigger, isMutating } = useSWRMutation(
    BACKEND_ENDPOINTS.SAVE_TRANSACTION_DETAILS,
    sendPostRequest,
    {
      onSuccess: (data: IApiResponse<IFormSubmissionResponse>) => {
        toast({
          title:
            data.data.message || 'Transaction profile submitted successfully',
        });
        refreshData();
        setIsEditMode(false);
        if (!isSubmitted && nextFormHref) {
          navigate(nextFormHref);
        }
      },
    }
  );

  const onSubmit = (data: FormData) => {
    const formData: IApiRequestWithMetaData<FormData> = {
      metaInfo: getMetaData(),
      attributes: data,
    };
    trigger(formData);
  };

  const isFormDisabled = isSubmitted && !isEditMode;

  return (
    <Form {...form}>
      <FormStyle onSubmit={form.handleSubmit(onSubmit)}>
        {/* Highest Volume */}
        <FormField
          control={form.control}
          name='highestVolume'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputWithLabelNew
                  label='Highest Volume'
                  {...field}
                  type='number'
                  disabled={isFormDisabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Net Asset Range */}
        <FormField
          control={form.control}
          name='netAssetRange'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioWithLabel
                  label='Net Asset Range'
                  optionsUrl='/public/fetchConfig?type=netAssetRange'
                  {...field}
                  disabled={isFormDisabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Monthly Transaction Amount */}
        <FormField
          control={form.control}
          name='monthlyTransactionAmount'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioWithLabel
                  label='Monthly Transaction Amount'
                  optionsUrl='/public/fetchConfig?type=monthlyTransactionAmount'
                  {...field}
                  disabled={isFormDisabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Monthly Transaction Number */}
        <FormField
          control={form.control}
          name='monthlyTransactionNumber'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioWithLabel
                  label='Monthly Transaction Number'
                  optionsUrl='/public/fetchConfig?type=monthlyTransactionNumber'
                  {...field}
                  disabled={isFormDisabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormSubmitButton
          isLoading={isMutating}
          isSubmitted={isSubmitted}
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
        />
      </FormStyle>
    </Form>
  );
};

export default TransactionProfileForm;

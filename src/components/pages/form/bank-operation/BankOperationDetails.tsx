'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import InputWithLabelNew from '@/components/ui/InputWithLabelNew';
import RadioWithLabel from '@/components/ui/RadioWithLabel';
import SelectWithLabel from '@/components/ui/SelectWithLabel';
import { toast } from '@/hooks/useToast';

import { sendPostRequest } from '@/api/swrConfig';
import BACKEND_ENDPOINTS from '@/api/urls';
import { FormStyle, FormSubmitButton } from '@/components/ui/form';
import useCompanyData from '@/hooks/useCompanyData';
import { IApiResponse, IFormSubmissionResponse } from '@/types/common';
import { getMetaData } from '@/utils/getMetaData';
import { useNavigate } from 'react-router-dom';
import useSWRMutation from 'swr/mutation';

// Validation schema
const FormSchema = z.object({
  bank: z.string().min(1, {
    message: 'Bank is required.',
  }),
  branch: z.string().min(1, {
    message: 'Branch is required.',
  }),
  accountName: z.string().min(1, {
    message: 'Account name is required.',
  }),
  accountNumber: z.string().min(1, {
    message: 'Account number is required.',
  }),
  autoSettlement: z.string().min(1, {
    message: 'Auto settlement is required.',
  }),
});

type FormData = z.infer<typeof FormSchema>;

interface IBankOperationDetailsFormProps {
  defaultValues: FormData;
  disabled: boolean;
  nextFormHref: string;
}

const BankOperationDetailsForm: React.FC<IBankOperationDetailsFormProps> = ({
  defaultValues,
  disabled,
  nextFormHref,
}) => {
  const navigate = useNavigate();
  const { refreshData } = useCompanyData();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  const { trigger, isMutating } = useSWRMutation(
    BACKEND_ENDPOINTS.SAVE_BANK_DETAILS,
    sendPostRequest,
    {
      onSuccess: (data: IApiResponse<IFormSubmissionResponse>) => {
        toast({
          title:
            data.data.message ||
            'Bank operation details submitted successfully',
        });
        refreshData();
        if (nextFormHref) {
          navigate(nextFormHref);
        }
      },
    }
  );

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    const formData = {
      metaInfo: getMetaData(),
      attributes: {
        ...data,
        autoSettlement: data.autoSettlement === 'yes',
      },
    };
    trigger(formData);
  };

  const formData = form.watch();

  return (
    <Form {...form}>
      <FormStyle onSubmit={form.handleSubmit(onSubmit)}>
        {/* Bank */}
        <FormField
          control={form.control}
          name='bank'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <SelectWithLabel
                  label='Bank'
                  optionsUrl='/public/config/banks'
                  {...field}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Branch */}
        <FormField
          control={form.control}
          name='branch'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <SelectWithLabel
                  label='Branch'
                  optionsUrl={
                    formData.bank
                      ? `/public/config/branches?bankId=${formData.bank}`
                      : null
                  }
                  {...field}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Account Name */}
        <FormField
          control={form.control}
          name='accountName'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputWithLabelNew
                  label='Account Name'
                  {...field}
                  disabled={disabled}
                  type='text'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Account Number */}
        <FormField
          control={form.control}
          name='accountNumber'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputWithLabelNew
                  label='Account Number'
                  {...field}
                  disabled={disabled}
                  type='text'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Auto Settlement */}
        <FormField
          control={form.control}
          name='autoSettlement'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioWithLabel
                  label='Auto Settlement'
                  options={[
                    { label: 'Yes', value: 'yes' },
                    { label: 'No', value: 'no' },
                  ]}
                  {...field}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormSubmitButton isLoading={isMutating} notVisible={disabled} />
      </FormStyle>
    </Form>
  );
};

export default BankOperationDetailsForm;

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
import SelectWithLabel from '@/components/ui/SelectWithLabel';
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
  businessName: z.string().min(2, { message: 'Business name is required.' }),
  accountType: z.string().nonempty({ message: 'Account type is required.' }),
  organizationType: z
    .string()
    .nonempty({ message: 'Organization type is required.' }),
  businessCategory: z
    .string()
    .nonempty({ message: 'Business category is required.' }),
});

type FormData = z.infer<typeof schema>;

interface ICompanyInformationFormProps {
  defaultValues: FormData;
  isSubmitted: boolean;
  nextFormHref: string;
}

const CompanyInformationForm: React.FC<ICompanyInformationFormProps> = ({
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
    BACKEND_ENDPOINTS.SAVE_COMPANY_INFO,
    sendPostRequest,
    {
      onSuccess: (data: IApiResponse<IFormSubmissionResponse>) => {
        toast({
          title: data.data.message || 'Form submitted successfully',
        });
        refreshData();
        setIsEditMode(false);
        if (!isSubmitted && nextFormHref) {
          navigate(
            `${nextFormHref}?organizationType=${form.watch('organizationType')}`
          );
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
        {/* Business Name */}
        <FormField
          control={form.control}
          name='businessName'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputWithLabelNew
                  label='Business Name'
                  {...field}
                  disabled={isFormDisabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Account Type */}
        <FormField
          control={form.control}
          name='accountType'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <SelectWithLabel
                  label='Account Type'
                  optionsUrl='/public/fetchConfig?type=accountType'
                  {...field}
                  disabled={isFormDisabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Organization Type */}
        <FormField
          control={form.control}
          name='organizationType'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <SelectWithLabel
                  label='Organization Type'
                  optionsUrl='/public/fetchConfig?type=organizationType'
                  {...field}
                  disabled={isFormDisabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Business Category */}
        <FormField
          control={form.control}
          name='businessCategory'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <SelectWithLabel
                  label='Business Category'
                  optionsUrl='/public/fetchConfig?type=businessCategory'
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

export default CompanyInformationForm;

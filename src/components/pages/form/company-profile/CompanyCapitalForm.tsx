import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { sendPostRequest } from '@/api/swrConfig';
import BACKEND_ENDPOINTS from '@/api/urls';
import FileUploadWithLabel from '@/components/ui/FileUploadWithLabel';
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
import InputWithPrefix from '@/components/ui/InputWithPrefix';
import RadioWithLabel from '@/components/ui/RadioWithLabel';
import SelectWithLabel from '@/components/ui/SelectWithLabel';
import useCompanyData from '@/hooks/useCompanyData';
import { toast } from '@/hooks/useToast';
import { IApiResponse, IFormSubmissionResponse } from '@/types/common';
import { getMetaData } from '@/utils/getMetaData';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSWRMutation from 'swr/mutation';

// Validation Schema
const CapitalSchema = z
  .object({
    capitalInvestment: z
      .string()
      .nonempty({ message: 'Capital investment is required.' })
      .regex(/^\d+$/, { message: 'Please enter a valid amount.' }),
    sourceOfFunds: z
      .string()
      .nonempty({ message: 'Source of funds is required.' }),
    expectedAnnualTurnover: z
      .string()
      .nonempty({ message: 'Expected annual turnover is required.' })
      .regex(/^\d+$/, { message: 'Please enter a valid amount.' }),
    expectedAnnualTurnoverInWords: z
      .string()
      .nonempty({ message: 'Expected annual turnover in words is required.' }),
    hasExistingBankAccounts: z.string().nonempty({
      message: 'Please specify if you have existing bank accounts.',
    }),
    bankStatements: z.any().optional(),
    // bankStatements: z.array(z.any()).optional(),
    isPasswordProtected: z.string().nonempty({
      message: 'Please specify if statements are password protected.',
    }),
    bankStatementPassword: z.string().optional().or(z.literal('')),
  })
  .superRefine((data, ctx) => {
    if (data.hasExistingBankAccounts === 'yes') {
      if (!data.bankStatements) {
        ctx.addIssue({
          code: 'custom',
          path: ['bankStatements'],
          message: 'Bank statements are required.',
        });
      }
      if (
        data.isPasswordProtected &&
        typeof data.bankStatements !== 'string' &&
        !data.bankStatementPassword
      ) {
        ctx.addIssue({
          code: 'custom',
          path: ['bankStatementPassword'],
          message: 'Bank statements password is required.',
        });
      }
      // if (data.bankStatements && data.bankStatements.length < 3) {
      //   ctx.addIssue({
      //     code: 'custom',
      //     path: ['bankStatements'],
      //     message: 'Please upload at least 3 bank statements.',
      //   });
      // }
    }
  });

type FormData = z.infer<typeof CapitalSchema>;

interface CapitalFormProps {
  defaultValues?: FormData;
  isSubmitted: boolean;
  nextFormHref: string;
  previousFormHref: string;
}

const CompanyCapitalForm: React.FC<CapitalFormProps> = ({
  defaultValues,
  isSubmitted,
  nextFormHref,
  previousFormHref,
}) => {
  const navigate = useNavigate();
  const { refreshData } = useCompanyData();
  const [isEditMode, setIsEditMode] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(CapitalSchema),
    defaultValues,
  });

  const { trigger, isMutating } = useSWRMutation(
    BACKEND_ENDPOINTS.SAVE_COMPANY_CAPITAL,
    sendPostRequest,
    {
      onSuccess: (data: IApiResponse<IFormSubmissionResponse>) => {
        toast({
          title:
            data.data.message || 'Capital information submitted successfully',
        });
        refreshData();
        setIsEditMode(false);
        if (!isSubmitted && nextFormHref) {
          navigate(nextFormHref);
        }
      },
    }
  );

  const onSubmit = async (data: FormData) => {
    const formData = {
      metaInfo: getMetaData(),
      attributes: {
        capitalInvestment: data.capitalInvestment,
        sourceOfFunds: data.sourceOfFunds,
        expectedAnnualTurnover: data.expectedAnnualTurnover,
        expectedAnnualTurnoverInWords: data.expectedAnnualTurnoverInWords,
        isBankStatementPresent: data.hasExistingBankAccounts === 'yes',
        bankStatements:
          data.bankStatements.content || defaultValues?.bankStatements,
        isBankStatementPasswordProtected: data.isPasswordProtected === 'yes',
        bankStatementPassword: data.bankStatementPassword,
      },
    };

    await trigger(formData);
  };

  const formValues = form.watch();

  const isFormDisabled = isSubmitted && !isEditMode;

  return (
    <Form {...form}>
      <FormStyle
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-6 md:space-y-8'
      >
        {/* Capital Investment Section */}
        <div className='space-y-4'>
          <div className='space-y-2 md:space-y-4'>
            <h2 className='label-text'>
              Please provide details of your company's investments and funds
            </h2>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-4'>
              <FormField
                control={form.control}
                name='capitalInvestment'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputWithPrefix
                        label='Company Capital Investment'
                        type='number'
                        prefix='BDT'
                        {...field}
                        disabled={isFormDisabled}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='sourceOfFunds'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <SelectWithLabel
                        label='Source of Funds'
                        optionsUrl={'/public/fetchConfig?type=sourceOfFunds'}
                        {...field}
                        disabled={isFormDisabled}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='expectedAnnualTurnover'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputWithPrefix
                        label='Expected Annual Turnover'
                        type='number'
                        prefix='BDT'
                        {...field}
                        disabled={isFormDisabled}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name='expectedAnnualTurnoverInWords'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <InputWithLabelNew
                    label='Expected annual turnover (in Words)'
                    {...field}
                    disabled={isFormDisabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Bank Account Section */}
        <div className='space-y-6 md:space-y-8'>
          <FormField
            control={form.control}
            name='hasExistingBankAccounts'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioWithLabel
                    label='Do you have any other existing bank accounts?'
                    options={[
                      { value: 'yes', label: 'Yes' },
                      { value: 'no', label: 'No' },
                    ]}
                    {...field}
                    disabled={isFormDisabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Bank Statement Section */}
          {formValues.hasExistingBankAccounts === 'yes' && (
            <div className='space-y-6 md:space-y-8'>
              <FormField
                control={form.control}
                name='bankStatements'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FileUploadWithLabel
                        label='We need 3 months of your company bank statements'
                        boxLabel='Bank Statement'
                        value={field.value}
                        onFilesChange={(files) => {
                          field.onChange(files[0] || null);
                          // Clear password when new file is uploaded
                          if (files[0]) {
                            form.setValue('bankStatementPassword', '');
                          }
                        }}
                        disabled={isFormDisabled}
                        maxFiles={1}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='isPasswordProtected'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioWithLabel
                        label='Are these statements password protected?'
                        options={[
                          { value: 'yes', label: 'Yes' },
                          { value: 'no', label: 'No' },
                        ]}
                        {...field}
                        disabled={isFormDisabled}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Section */}
              {formValues.isPasswordProtected === 'yes' &&
                typeof formValues.bankStatements !== 'string' &&
                !isFormDisabled && (
                  <div className='space-y-4'>
                    <h3 className='label-text'>Please enter the password</h3>
                    <FormField
                      control={form.control}
                      name='bankStatementPassword'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <InputWithLabelNew
                              label='Document Password'
                              type='password'
                              {...field}
                              disabled={isFormDisabled}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
            </div>
          )}
        </div>

        <FormSubmitButton
          isLoading={isMutating}
          isSubmitted={isSubmitted}
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
          previousFormHref={previousFormHref}
        />
      </FormStyle>
    </Form>
  );
};

export default CompanyCapitalForm;

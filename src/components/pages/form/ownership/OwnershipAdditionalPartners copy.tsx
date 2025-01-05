'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { sendPostRequest } from '@/api/swrConfig';
import BACKEND_ENDPOINTS from '@/api/urls';
import DateWithLabel from '@/components/ui/DateWithLabel';
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
import RadioWithLabel from '@/components/ui/RadioWithLabel';
import SelectWithLabel from '@/components/ui/SelectWithLabel';
import useCompanyData from '@/hooks/useCompanyData';
import { toast } from '@/hooks/useToast';
import { getMetaData } from '@/utils/getMetaData';
import { useNavigate } from 'react-router-dom';
import useSWRMutation from 'swr/mutation';

// Validation schema
const FormSchema = z
  .object({
    documentType: z.string().min(1, { message: 'Document type is required.' }),
    passportPhoto: z.any().optional(),
    workPermitPhoto: z.any().optional(),
    nidFrontPhoto: z.any().optional(),
    nidBackPhoto: z.any().optional(),
    ownerPhoto: z.any().refine((file) => file && file.size <= 1024 * 1024 * 4, {
      message: 'Owner photo is required and must not exceed 4MB.',
    }),
    fullName: z.string().min(1, { message: 'Full name is required.' }),
    role: z.string().min(1, { message: 'Role is required.' }),
    sharePercent: z
      .string()
      .min(1, { message: 'Share percent is required.' })
      .refine((value) => parseFloat(value) >= 0, {
        message: 'Share Percent cannot be negative.',
      })
      .refine((value) => parseFloat(value) <= 100, {
        message: 'Share Percent cannot exceed 100.',
      }),
    dateOfBirth: z.date({ required_error: 'Date of birth is required.' }),
    dateOfIssue: z.date({ required_error: 'Date of issue is required.' }),
    dateOfExpiry: z.date({ required_error: 'Date of expiry is required.' }),
    gender: z.string().min(1, { message: 'Gender is required.' }),
    nationality: z.string().min(1, { message: 'Nationality is required.' }),
    idNumber: z
      .string()
      .regex(/^\d+$/, { message: 'ID Number must be numeric.' })
      .min(1, { message: 'ID Number is required.' })
      .min(10, { message: 'NID must be at least 10 digits.' }),
  })
  .superRefine((data, ctx) => {
    // If documentType is '1' (NID), nidFrontPhoto and nidBackPhoto are required
    if (data.documentType === '1') {
      if (!data.nidFrontPhoto) {
        ctx.addIssue({
          code: 'custom',
          path: ['nidFrontPhoto'],
          message: 'NID front photo is required.',
        });
      }
      if (!data.nidBackPhoto) {
        ctx.addIssue({
          code: 'custom',
          path: ['nidBackPhoto'],
          message: 'NID back photo is required.',
        });
      }
    }

    // If documentType is '2' (Passport), passportPhoto is required
    if (data.documentType === '2') {
      if (!data.passportPhoto) {
        ctx.addIssue({
          code: 'custom',
          path: ['passportPhoto'],
          message: 'Passport photo is required.',
        });
      }
      if (!data.workPermitPhoto) {
        ctx.addIssue({
          code: 'custom',
          path: ['workPermitPhoto'],
          message: 'Work permit photo is required.',
        });
      }
    }
  });

const OwnershipAdditionalPartnersForm = ({
  defaultValues,
  disabled,
  nextFormHref,
}: {
  defaultValues: z.infer<typeof FormSchema>;
  disabled: boolean;
  nextFormHref: string;
}) => {
  const navigate = useNavigate();
  const { refreshData } = useCompanyData();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      ...defaultValues,
      dateOfBirth: defaultValues.fullName
        ? defaultValues.dateOfBirth
        : undefined,
      dateOfIssue: defaultValues.fullName
        ? defaultValues.dateOfIssue
        : undefined,
      dateOfExpiry: defaultValues.fullName
        ? defaultValues.dateOfExpiry
        : undefined,
    },
  });

  const { trigger, isMutating } = useSWRMutation(
    BACKEND_ENDPOINTS.SAVE_ADDITIONAL_PARTNERS,
    sendPostRequest,
    {
      onSuccess: (data) => {
        toast({
          title:
            data.message ||
            'Additional Partner details submitted successfully.',
        });
        refreshData();
        if (nextFormHref) {
          navigate(nextFormHref);
        }
      },
    }
  );

  const documentType = form.watch('documentType');

  const renderFileUploadField = (
    name: keyof z.infer<typeof FormSchema>,
    label: string
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <FileUploadWithLabel
              label={label}
              value={field.value}
              onFilesChange={(files) => field.onChange(files[0] || null)}
              disabled={disabled}
              maxFiles={1}
              downloadableFile={{
                content:
                  defaultValues[name as keyof z.infer<typeof FormSchema>],
                name: `${name}.jpeg`,
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const formData = {
      metaInfo: getMetaData(),
      attributes: {
        ...data,
        passportPhoto: data.passportPhoto?.content,
        workPermitPhoto: data.workPermitPhoto?.content,
        nidFrontPhoto: data.nidFrontPhoto?.content,
        nidBackPhoto: data.nidBackPhoto?.content,
        ownerPhoto: data.ownerPhoto?.content,
      },
    };
    await trigger(formData);
  };

  return (
    <Form {...form}>
      <FormStyle onSubmit={form.handleSubmit(onSubmit)}>
        {/* Document Type */}
        <FormField
          control={form.control}
          name='documentType'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <SelectWithLabel
                  label='Document Type'
                  optionsUrl='/public/fetchConfig?type=documentType'
                  {...field}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Conditional File Uploads */}
        {documentType === '1' && (
          <>
            {renderFileUploadField('nidFrontPhoto', 'NID Front Photo')}
            {renderFileUploadField('nidBackPhoto', 'NID Back Photo')}
          </>
        )}
        {documentType === '2' && (
          <>
            {renderFileUploadField('passportPhoto', 'Passport Photo')}
            {renderFileUploadField('workPermitPhoto', 'Work Permit Photo')}
          </>
        )}
        {renderFileUploadField('ownerPhoto', 'Owner Photo')}

        {/* Text and Number Fields */}
        <FormField
          control={form.control}
          name='fullName'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputWithLabelNew
                  label='Full Name'
                  {...field}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='role'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputWithLabelNew
                  label='Role'
                  {...field}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='sharePercent'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputWithLabelNew
                  label='Share Percent'
                  type='number'
                  {...field}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Dates */}
        <FormField
          control={form.control}
          name='dateOfBirth'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DateWithLabel
                  label='Date of Birth'
                  {...field}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='dateOfIssue'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DateWithLabel
                  label='Date of Issue'
                  {...field}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='dateOfExpiry'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DateWithLabel
                  label='Date of Expiry'
                  {...field}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Gender and Nationality */}
        <FormField
          control={form.control}
          name='gender'
          render={({ field }) => (
            <FormItem>
              <RadioWithLabel
                label='Gender'
                optionsUrl='/public/fetchConfig?type=gender'
                {...field}
                disabled={disabled}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='nationality'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <SelectWithLabel
                  label='Nationality'
                  optionsUrl='/public/fetchConfig?type=nationality'
                  {...field}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='idNumber'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputWithLabelNew
                  label='ID Number'
                  {...field}
                  type='number'
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <FormSubmitButton isLoading={isMutating} notVisible={disabled} />
      </FormStyle>
    </Form>
  );
};

export default OwnershipAdditionalPartnersForm;

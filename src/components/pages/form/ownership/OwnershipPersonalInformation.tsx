import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormStyle,
  FormSubmitButton,
} from '@/components/ui/form';
import { toast } from '@/hooks/useToast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { sendPostRequest } from '@/api/swrConfig';
import BACKEND_ENDPOINTS from '@/api/urls';
import DateWithLabel from '@/components/ui/DateWithLabel';
import InputWithLabelNew from '@/components/ui/InputWithLabelNew';
import RadioWithLabel from '@/components/ui/RadioWithLabel';
import SelectWithLabel from '@/components/ui/SelectWithLabel';
import useCompanyData from '@/hooks/useCompanyData';
import { getMetaData } from '@/utils/getMetaData';
import { useNavigate } from 'react-router-dom';
import useSWRMutation from 'swr/mutation';

// Validation schema
const FormSchema = z.object({
  fullName: z.string().min(1, { message: 'Full Name is required.' }),
  designation: z.string().min(1, { message: 'Designation is required.' }),
  fatherName: z.string().min(1, { message: "Father's Name is required." }),
  motherName: z.string().min(1, { message: "Mother's Name is required." }),
  husbandWifeName: z.string().optional(),
  dateOfBirth: z.date({ required_error: 'Date of Birth is required.' }),
  dateOfIssue: z.date({ required_error: 'Date of Issue is required.' }),
  dateOfExpiry: z.date({ required_error: 'Date of Expiry is required.' }),
  nidNumber: z
    .string({ required_error: 'NID is required.' })
    .regex(/^\d+$/, { message: 'NID must be a number.' })
    .min(10, { message: 'NID must be at least 10 digits.' }),
  nationality: z.string().min(1, { message: 'Nationality is required.' }),
  gender: z.string().min(1, { message: 'Gender is required.' }),
  businessMobileNumber: z
    .string()
    .regex(/^\d+$/, { message: 'Mobile number must contain only numbers.' })
    .min(10, { message: 'Mobile number must be at least 10 digits.' }),
  sharePercent: z
    .string()
    .min(1, { message: 'Share percent is required.' })
    .refine((value) => parseFloat(value) >= 0, {
      message: 'Share Percent cannot be negative.',
    })
    .refine((value) => parseFloat(value) <= 100, {
      message: 'Share Percent cannot exceed 100.',
    }),
});

type FormData = z.infer<typeof FormSchema>;

interface OwnershipPersonalInformationFormProps {
  defaultValues: FormData;
  isSubmitted: boolean;
  nextFormHref: string;
  previousFormHref: string;
}

const OwnershipPersonalInformationForm: React.FC<
  OwnershipPersonalInformationFormProps
> = ({ defaultValues, isSubmitted, nextFormHref, previousFormHref }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();
  const { refreshData } = useCompanyData();

  const form = useForm<FormData>({
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
    BACKEND_ENDPOINTS.SAVE_PERSONAL_INFORMATION,
    sendPostRequest,
    {
      onSuccess: (data) => {
        toast({
          title: data.message || 'Personal Information submitted successfully.',
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
        ...data,
        dateOfBirth: data.dateOfBirth,
        dateOfIssue: data.dateOfIssue,
        dateOfExpiry: data.dateOfExpiry,
        husbandOrWifeName: data.husbandWifeName,
        nidNumber: Number(data.nidNumber),
        sharePercent: Number(data.sharePercent),
        businessMobileNumber: data.businessMobileNumber,
      },
    };

    await trigger(formData);
  };

  const isFormDisabled = isSubmitted && !isEditMode;

  return (
    <Form {...form}>
      <FormStyle onSubmit={form.handleSubmit(onSubmit)}>
        {/* Full Name */}
        <FormField
          control={form.control}
          name='fullName'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputWithLabelNew
                  label='Full Name'
                  {...field}
                  disabled={isFormDisabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Designation */}
        <FormField
          control={form.control}
          name='designation'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputWithLabelNew
                  label='Designation'
                  {...field}
                  disabled={isFormDisabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Father's Name */}
        <FormField
          control={form.control}
          name='fatherName'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputWithLabelNew
                  label="Father's Name"
                  {...field}
                  disabled={isFormDisabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Mother's Name */}
        <FormField
          control={form.control}
          name='motherName'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputWithLabelNew
                  label="Mother's Name"
                  {...field}
                  disabled={isFormDisabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Spouse Name */}
        <FormField
          control={form.control}
          name='husbandWifeName'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputWithLabelNew
                  label='Husband/Wife Name'
                  {...field}
                  disabled={isFormDisabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date of Birth */}
        <FormField
          control={form.control}
          name='dateOfBirth'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DateWithLabel
                  label='Date of Birth'
                  {...field}
                  disabled={isFormDisabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date of Expiry */}
        <FormField
          control={form.control}
          name='dateOfExpiry'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DateWithLabel
                  label='Date of Expiry'
                  {...field}
                  disabled={isFormDisabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date of Issue */}
        <FormField
          control={form.control}
          name='dateOfIssue'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DateWithLabel
                  label='Date of Issue'
                  {...field}
                  disabled={isFormDisabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* NID Number */}
        <FormField
          control={form.control}
          name='nidNumber'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputWithLabelNew
                  label='NID Number'
                  {...field}
                  disabled={isFormDisabled}
                  type='number'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Nationality */}
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
                  disabled={isFormDisabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Gender */}
        <FormField
          control={form.control}
          name='gender'
          render={({ field }) => (
            <FormItem>
              <RadioWithLabel
                label='Gender'
                optionsUrl='/public/fetchConfig?type=gender'
                {...field}
                disabled={isFormDisabled}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Business Mobile Number */}
        <FormField
          control={form.control}
          name='businessMobileNumber'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputWithLabelNew
                  label='Business Mobile Number'
                  {...field}
                  disabled={isFormDisabled}
                  type='number'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Share Percent */}
        <FormField
          control={form.control}
          name='sharePercent'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputWithLabelNew
                  label='Share Percent'
                  {...field}
                  disabled={isFormDisabled}
                  type='number'
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
          previousFormHref={previousFormHref}
        />
      </FormStyle>
    </Form>
  );
};

export default OwnershipPersonalInformationForm;

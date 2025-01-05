import { zodResolver } from '@hookform/resolvers/zod';
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
import SelectWithLabel from '@/components/ui/SelectWithLabel';
import TextAreaWithLabel from '@/components/ui/TextAreaWithLabel';
import useCompanyData from '@/hooks/useCompanyData';
import { toast } from '@/hooks/useToast';
import { getMetaData } from '@/utils/getMetaData';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSWRMutation from 'swr/mutation';

// Validation Schema
const AddressSchema = z.object({
  presentDivision: z.string().nonempty({ message: 'Division is required.' }),
  presentDistrict: z.string().nonempty({ message: 'District is required.' }),
  presentThana: z.string().nonempty({ message: 'Thana is required.' }),
  presentVillage: z.string().nonempty({ message: 'Village is required.' }),
  presentAddress: z.string().nonempty({ message: 'Address is required.' }),
  presentPostCode: z
    .string()
    .regex(/^\d{4,6}$/, { message: 'Enter a valid post code.' }),
  presentPostOffice: z
    .string()
    .nonempty({ message: 'Post Office is required.' }),
  isSameAsPermanent: z.string().min(1, { message: 'Please select Yes or No' }),
  permanentDivision: z.string().nonempty({ message: 'Division is required.' }),
  permanentDistrict: z.string().nonempty({ message: 'District is required.' }),
  permanentThana: z.string().nonempty({ message: 'Thana is required.' }),
  permanentVillage: z.string().nonempty({ message: 'Village is required.' }),
  permanentAddress: z.string().nonempty({ message: 'Address is required.' }),
  permanentPostCode: z
    .string()
    .regex(/^\d{4,6}$/, { message: 'Enter a valid post code.' }),
  permanentPostOffice: z
    .string()
    .nonempty({ message: 'Post Office is required.' }),
});

type FormData = z.infer<typeof AddressSchema>;

interface AddressFormProps {
  defaultValues?: FormData;
  isSubmitted: boolean;
  nextFormHref: string;
  previousFormHref: string;
}

const OwnershipPersonalAddressForm: React.FC<AddressFormProps> = ({
  defaultValues,
  isSubmitted,
  nextFormHref,
  previousFormHref,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();
  const { refreshData } = useCompanyData();

  const form = useForm<FormData>({
    resolver: zodResolver(AddressSchema),
    defaultValues,
  });

  const { trigger: triggerPresent, isMutating: isPresentMutating } =
    useSWRMutation(
      BACKEND_ENDPOINTS.SAVE_PERSONAL_PRESENT_ADDRESS,
      sendPostRequest
    );

  const { trigger: triggerPermanent, isMutating: isPermanentMutating } =
    useSWRMutation(
      BACKEND_ENDPOINTS.SAVE_PERSONAL_PERMANENT_ADDRESS,
      sendPostRequest,
      {
        onSuccess: () => {
          toast({ title: 'Address Form submitted successfully' });
          refreshData();
          setIsEditMode(false);
          if (!isSubmitted && nextFormHref) {
            navigate(nextFormHref);
          }
        },
      }
    );

  const handleSubmit = async (data: FormData) => {
    const presentAddress = {
      division: data.presentDivision,
      district: data.presentDistrict,
      thana: data.presentThana,
      village: data.presentVillage,
      address: data.presentAddress,
      postCode: data.presentPostCode,
      postOffice: data.presentPostOffice,
    };
    const presentData = {
      metaInfo: getMetaData(),
      attributes: presentAddress,
    };

    const permanentData = {
      metaInfo: getMetaData(),
      attributes:
        data.isSameAsPermanent === 'yes'
          ? presentAddress
          : {
              division: data.permanentDivision,
              district: data.permanentDistrict,
              thana: data.permanentThana,
              village: data.permanentVillage,
              address: data.permanentAddress,
              postCode: data.permanentPostCode,
              postOffice: data.permanentPostOffice,
            },
    };

    await triggerPresent(presentData);
    await triggerPermanent(permanentData);
  };

  const formValues = form.watch();
  const isSameAsPermanent = formValues.isSameAsPermanent === 'yes';
  const disabled = isSubmitted && !isEditMode;

  return (
    <Form {...form}>
      <FormStyle onSubmit={form.handleSubmit(handleSubmit)}>
        <div className='space-y-6'>
          {/* Present Address Section */}
          <div className='space-y-4'>
            <h2 className='text-base font-medium'>
              Please let us know present address
            </h2>
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='presentDivision'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <SelectWithLabel
                        label='Division'
                        optionsUrl='/public/config/division'
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
                name='presentDistrict'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <SelectWithLabel
                        label='District'
                        optionsUrl={
                          formValues.presentDivision
                            ? `/public/config/districts?divisionId=${formValues.presentDivision}`
                            : null
                        }
                        disabled={!formValues.presentDivision || disabled}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='presentThana'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <SelectWithLabel
                        label='Thana'
                        optionsUrl={
                          formValues.presentDistrict
                            ? `/public/config/thanas?districtId=${formValues.presentDistrict}`
                            : null
                        }
                        disabled={!formValues.presentDistrict || disabled}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='presentVillage'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputWithLabelNew
                        label='Village'
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
                name='presentPostOffice'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputWithLabelNew
                        label='PO Box'
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
                name='presentPostCode'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputWithLabelNew
                        label='Post Code'
                        {...field}
                        disabled={disabled}
                        type='number'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name='presentAddress'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TextAreaWithLabel
                      label='Address Line'
                      {...field}
                      disabled={disabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Is Same Address Section */}
          <FormField
            control={form.control}
            name='isSameAsPermanent'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioWithLabel
                    label='Is the current address mentioned above the same as the permanent address?'
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

          {/* Permanent Address Section */}
          {!isSameAsPermanent && (
            <div className='space-y-4'>
              <h2 className='text-base font-medium'>
                Please let us know permanent address
              </h2>
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='permanentDivision'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <SelectWithLabel
                          label='Division'
                          optionsUrl='/public/config/division'
                          {...field}
                          disabled={disabled || isSameAsPermanent}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='permanentDistrict'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <SelectWithLabel
                          label='District'
                          optionsUrl={
                            formValues.permanentDivision
                              ? `/public/config/districts?divisionId=${formValues.permanentDivision}`
                              : null
                          }
                          disabled={
                            !formValues.permanentDivision ||
                            disabled ||
                            isSameAsPermanent
                          }
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='permanentThana'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <SelectWithLabel
                          label='Thana'
                          optionsUrl={
                            formValues.permanentDistrict
                              ? `/public/config/thanas?districtId=${formValues.permanentDistrict}`
                              : null
                          }
                          disabled={
                            !formValues.permanentDistrict ||
                            disabled ||
                            isSameAsPermanent
                          }
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='permanentVillage'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputWithLabelNew
                          label='Village'
                          {...field}
                          disabled={disabled || isSameAsPermanent}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='permanentPostOffice'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputWithLabelNew
                          label='PO Box'
                          {...field}
                          disabled={disabled || isSameAsPermanent}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='permanentPostCode'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputWithLabelNew
                          label='Post Code'
                          {...field}
                          disabled={disabled || isSameAsPermanent}
                          type='number'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name='permanentAddress'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <TextAreaWithLabel
                        label='Address Line'
                        {...field}
                        disabled={disabled || isSameAsPermanent}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        <FormSubmitButton
          isLoading={isPresentMutating || isPermanentMutating}
          isSubmitted={isSubmitted}
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
          previousFormHref={previousFormHref}
        />
      </FormStyle>
    </Form>
  );
};

export default OwnershipPersonalAddressForm;

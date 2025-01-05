import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
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
import TextAreaWithLabel from '@/components/ui/TextAreaWithLabel';
import useCompanyData from '@/hooks/useCompanyData';
import { toast } from '@/hooks/useToast';
import {
  IApiResponse,
  IFormSubmissionResponse,
  IOptionResponse,
} from '@/types/common';
import { getMetaData } from '@/utils/getMetaData';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

// Validation Schema
const AddressSchema = z
  .object({
    officeType: z
      .string()
      .nonempty({ message: 'Office space type is required.' }),
    addressProofDocumentType: z
      .string()
      .nonempty({ message: 'Document type is required.' }),
    addressProofDocument: z.any(),
    // .refine((file) => file && file.size && file.size <= 1024 * 1024 * 4, {
    //   message: 'Document provided is required and must not exceed 4MB.',
    // }),
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
    presentLandlineNumber: z
      .string()
      .refine(
        (data) => {
          if (data && data?.length !== 10) {
            return false;
          }
          return true;
        },
        {
          message: 'Landline number must be 10 digits long.',
        }
      )
      .optional(),

    sameAsCompanyAddress: z
      .string()
      .nonempty({ message: 'Same address is required.' }),

    tradeDivision: z.string().optional(),
    tradeDistrict: z.string().optional(),
    tradeThana: z.string().optional(),
    tradeVillage: z.string().optional(),
    tradeAddress: z.string().optional(),
    tradePostCode: z.string().optional(),
    tradePostOffice: z.string().optional(),
    tradeLandlineNumber: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.sameAsCompanyAddress === 'no') {
      if (!data.tradeDivision) {
        ctx.addIssue({
          code: 'custom',
          path: ['tradeDivision'],
          message: 'Division is required.',
        });
      }
      if (!data.tradeDistrict) {
        ctx.addIssue({
          code: 'custom',
          path: ['tradeDistrict'],
          message: 'District is required.',
        });
      }
      if (!data.tradeThana) {
        ctx.addIssue({
          code: 'custom',
          path: ['tradeThana'],
          message: 'Thana is required.',
        });
      }
      if (!data.tradeVillage) {
        ctx.addIssue({
          code: 'custom',
          path: ['tradeVillage'],
          message: 'Village is required.',
        });
      }
      if (!data.tradeAddress) {
        ctx.addIssue({
          code: 'custom',
          path: ['tradeAddress'],
          message: 'Address is required.',
        });
      }
      if (!data.tradePostCode) {
        ctx.addIssue({
          code: 'custom',
          path: ['tradePostCode'],
          message: 'Post Code is required.',
        });
      }
      if (!data.tradePostOffice) {
        ctx.addIssue({
          code: 'custom',
          path: ['tradePostOffice'],
          message: 'Post Office is required.',
        });
      }
      if (data.tradeLandlineNumber && data.tradeLandlineNumber.length !== 10) {
        ctx.addIssue({
          code: 'custom',
          path: ['tradeLandlineNumber'],
          message: 'Landline number must be 10 digits long.',
        });
      }
    }
  });

type FormData = z.infer<typeof AddressSchema>;

interface AddressFormProps {
  defaultValues?: FormData;
  isSubmitted: boolean;
  nextFormHref: string;
  previousFormHref: string;
}

const CompanyAddressForm: React.FC<AddressFormProps> = ({
  defaultValues,
  isSubmitted,
  nextFormHref,
  previousFormHref,
}) => {
  const navigate = useNavigate();
  const { refreshData } = useCompanyData();
  const [isEditMode, setIsEditMode] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(AddressSchema),
    defaultValues,
  });

  const { trigger, isMutating } = useSWRMutation(
    BACKEND_ENDPOINTS.SAVE_COMPANY_ADDRESS,
    sendPostRequest,
    {
      onSuccess: (data: IApiResponse<IFormSubmissionResponse>) => {
        toast({
          title: data.data.message || 'Address Form submitted successfully',
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
    const companyAddress = {
      division: Number(data.presentDivision),
      district: Number(data.presentDistrict),
      thana: Number(data.presentThana),
      village: data.presentVillage,
      address: data.presentAddress,
      postCode: Number(data.presentPostCode),
      postOffice: data.presentPostOffice,
      landLineNumber: data.presentLandlineNumber,
    };

    const mailingAddress =
      data.sameAsCompanyAddress === 'yes'
        ? companyAddress
        : {
            division: Number(data.tradeDivision),
            district: Number(data.tradeDistrict),
            thana: Number(data.tradeThana),
            village: data.tradeVillage,
            address: data.tradeAddress,
            postCode: Number(data.tradePostCode),
            postOffice: data.tradePostOffice,
            landLineNumber: data.tradeLandlineNumber,
          };

    await trigger({
      metaInfo: getMetaData(),
      attributes: {
        officeType: data.officeType,
        addressProofDocumentType: data.addressProofDocumentType,
        addressProofDocument:
          data.addressProofDocument?.content ||
          defaultValues?.addressProofDocument,
        isSameAsCompanyAddress: data.sameAsCompanyAddress === 'yes',
        companyAddress,
        mailingAddress,
      },
    });
  };

  // const copyPresentAddress = () => {
  //   setIsSame(true);
  // setAddressType('present');
  // form.setValue('tradeDivision', form.watch('presentDivision') || '');
  // form.setValue('tradeDistrict', form.watch('presentDistrict') || '');
  // form.setValue('tradeThana', form.watch('presentThana') || '');
  // form.setValue('tradeVillage', form.watch('presentVillage') || '');
  // form.setValue('tradeAddress', form.watch('presentAddress') || '');
  // form.setValue('tradePostCode', form.watch('presentPostCode') || '');
  // form.setValue('tradePostOffice', form.watch('presentPostOffice') || '');
  // form.setValue(
  //   'tradeLandlineNumber',
  //   form.watch('presentLandlineNumber') || ''
  // );
  // };

  // const removeTradeAddress = () => {
  // setIsSame(false);
  // setAddressType('trade');
  // // Clear all trade address fields
  // form.setValue('tradeDivision', '');
  // form.setValue('tradeDistrict', '');
  // form.setValue('tradeThana', '');
  // form.setValue('tradeVillage', '');
  // form.setValue('tradeAddress', '');
  // form.setValue('tradePostCode', '');
  // form.setValue('tradePostOffice', '');
  // form.setValue('tradeLandlineNumber', '');
  // };

  // useEffect(() => {
  //   if (isSame) {
  //     form.setValue('tradeDivision', form.watch('presentDivision') || '');
  //     form.setValue('tradeDistrict', form.watch('presentDistrict') || '');
  //     form.setValue('tradeThana', form.watch('presentThana') || '');
  //     form.setValue('tradeVillage', form.watch('presentVillage') || '');
  //     form.setValue('tradeAddress', form.watch('presentAddress') || '');
  //     form.setValue('tradePostCode', form.watch('presentPostCode') || '');
  //     form.setValue('tradePostOffice', form.watch('presentPostOffice') || '');
  //     form.setValue(
  //       'tradeLandlineNumber',
  //       form.watch('presentLandlineNumber') || ''
  //     );
  //   }
  // }, [
  //   isSame,
  //   form.watch('presentDivision'),
  //   form.watch('presentDistrict'),
  //   form.watch('presentThana'),
  //   form.watch('presentVillage'),
  //   form.watch('presentAddress'),
  //   form.watch('presentPostCode'),
  //   form.watch('presentPostOffice'),
  //   form.watch('presentLandlineNumber'),
  // ]);

  const getLabel = (addressProofDocumentType: string) => {
    return addressProofDocumentType
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  };

  const isFormDisabled = isSubmitted && !isEditMode;
  const formValues = form.watch();

  const sameAsCompanyAddress = formValues.sameAsCompanyAddress === 'yes';

  const { data: addressProofTypeOptions } = useSWR<
    IApiResponse<IOptionResponse>
  >('/public/fetchConfig?type=addressProofType');

  return (
    <Form {...form}>
      <FormStyle
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-6 md:space-y-8'
      >
        {/* Office Space Type Selection */}
        <div className=''>
          <FormField
            control={form.control}
            name='officeType'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioWithLabel
                    label='Please select the type of office space you have'
                    optionsUrl={'/public/fetchConfig?type=officeType'}
                    {...field}
                    disabled={isFormDisabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Document Upload Section */}
        <div className='space-y-2 md:space-y-4'>
          <h2 className='label-text'>
            Please provide the following documents as a proof of the above given
            information
          </h2>
          <FormField
            control={form.control}
            name='addressProofDocumentType'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <SelectWithLabel
                    label='Select Document Type'
                    optionsUrl={'/public/fetchConfig?type=addressProofType'}
                    {...field}
                    disabled={isFormDisabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {formValues.addressProofDocumentType && (
            <FormField
              control={form.control}
              name='addressProofDocument'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FileUploadWithLabel
                      boxLabel={getLabel(
                        addressProofTypeOptions?.data.data.find(
                          (option) =>
                            option.id ===
                            Number(formValues.addressProofDocumentType)
                        )?.value || ''
                      )}
                      value={field.value}
                      onFilesChange={(files) =>
                        field.onChange(files[0] || null)
                      }
                      disabled={isFormDisabled}
                      maxFiles={1}
                      downloadableFile={{
                        content: defaultValues?.addressProofDocument,
                        name: 'addressProofDocument.jpeg',
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {/* Company Address Section */}
        <div className='space-y-4'>
          <h2 className='label-text'>
            Please let us know your company address
          </h2>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-4'>
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
                      disabled={isFormDisabled}
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
                        formValues['presentDivision']
                          ? `/public/config/districts?divisionId=${formValues['presentDivision']}`
                          : null
                      }
                      disabled={
                        !formValues['presentDivision'] || isFormDisabled
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
              name='presentThana'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <SelectWithLabel
                      label='Thana'
                      optionsUrl={
                        formValues['presentDistrict']
                          ? `/public/config/thanas?districtId=${formValues['presentDistrict']}`
                          : null
                      }
                      disabled={
                        !formValues['presentDistrict'] || isFormDisabled
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
              name='presentVillage'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithLabelNew
                      label='Village'
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
              name='presentPostCode'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithLabelNew
                      label='Post Code'
                      type='number'
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
              name='presentPostOffice'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithLabelNew
                      label='Post Office'
                      {...field}
                      disabled={isFormDisabled}
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
                    label='Address'
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
            name='presentLandlineNumber'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <InputWithPrefix
                    label='Company Landline Number (Optional)'
                    type='number'
                    prefix='+880'
                    placeholder='1xxxxxxxxx'
                    {...field}
                    disabled={isFormDisabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Mailing Address Section */}
        <FormField
          control={form.control}
          name='sameAsCompanyAddress'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioWithLabel
                  label='Is the above address your mailing address for your company?'
                  options={[
                    { label: 'Yes', value: 'yes' },
                    { label: 'No', value: 'no' },
                  ]}
                  {...field}
                  disabled={isFormDisabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {formValues.sameAsCompanyAddress === 'no' && (
          <div className='space-y-4'>
            <h2 className='label-text'>
              Please let us know your company mailing address
            </h2>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-4'>
              <FormField
                control={form.control}
                name='tradeDivision'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <SelectWithLabel
                        label='Division'
                        optionsUrl='/public/config/division'
                        {...field}
                        disabled={isFormDisabled || sameAsCompanyAddress}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='tradeDistrict'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <SelectWithLabel
                        label='District'
                        optionsUrl={
                          formValues['tradeDivision']
                            ? `/public/config/districts?divisionId=${formValues['tradeDivision']}`
                            : null
                        }
                        disabled={
                          !formValues['tradeDivision'] ||
                          isFormDisabled ||
                          sameAsCompanyAddress
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
                name='tradeThana'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <SelectWithLabel
                        label='Thana'
                        optionsUrl={
                          formValues['tradeDistrict']
                            ? `/public/config/thanas?districtId=${formValues['tradeDistrict']}`
                            : null
                        }
                        disabled={
                          !formValues['tradeDistrict'] ||
                          isFormDisabled ||
                          sameAsCompanyAddress
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
                name='tradeVillage'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputWithLabelNew
                        label='Village'
                        {...field}
                        disabled={isFormDisabled || sameAsCompanyAddress}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='tradePostCode'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputWithLabelNew
                        label='Post Code'
                        type='number'
                        {...field}
                        disabled={isFormDisabled || sameAsCompanyAddress}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='tradePostOffice'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputWithLabelNew
                        label='Post Office'
                        {...field}
                        disabled={isFormDisabled || sameAsCompanyAddress}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name='tradeAddress'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TextAreaWithLabel
                      label='Address'
                      {...field}
                      disabled={isFormDisabled || sameAsCompanyAddress}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='tradeLandlineNumber'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithPrefix
                      label='Company Landline Number (Optional)'
                      type='number'
                      prefix='+880'
                      placeholder='1xxxxxxxxx'
                      {...field}
                      disabled={isFormDisabled || sameAsCompanyAddress}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
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

export default CompanyAddressForm;

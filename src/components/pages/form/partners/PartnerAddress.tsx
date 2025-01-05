import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

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
import {
  IPartnerAddressForm,
  PartnerAddressFormSchema,
  usePartnerForm,
} from '@/context/PartnerFormContext';
import { toast } from '@/hooks/useToast';
import { useNavigate } from 'react-router-dom';

interface PartnerAddressFormProps {
  defaultValues?: IPartnerAddressForm;
  disabled: boolean;
  nextFormHref: string;
  previousFormHref: string;
}

const PartnerAddressForm = ({
  defaultValues,
  disabled,
  nextFormHref,
  previousFormHref,
}: PartnerAddressFormProps) => {
  const navigate = useNavigate();
  const { updateAddress } = usePartnerForm();

  const form = useForm<IPartnerAddressForm>({
    resolver: zodResolver(PartnerAddressFormSchema),
    defaultValues: {
      ...defaultValues,
    },
  });

  // const { trigger: submitPartnerAddress, isMutating } = useSWRMutation(
  //   BACKEND_ENDPOINTS.SAVE_PARTNER_ADDRESS,
  //   sendPostRequest,
  //   {
  //     onSuccess: (data) => {
  //       toast({
  //         title: data.message || 'Partner address saved successfully.',
  //       });
  //       if (nextFormHref) {
  //         navigate(nextFormHref);
  //       }
  //     },
  //     onError: () => {
  //       toast({
  //         title: 'Failed to save partner address.',
  //         variant: 'destructive',
  //       });
  //     },
  //   }
  // );

  const handleSubmit = async (data: IPartnerAddressForm) => {
    try {
      // // Save partner address
      // const addressPayload: AddressAttributes = {
      //   tinNumber: formData.information.tin,
      //   isSamePresentAndPermanentAddressPartner:
      //     data.isSameAsPermanent === 'yes',
      //   presentAddress: {
      //     division: Number(data.presentDivision),
      //     district: Number(data.presentDistrict),
      //     thana: Number(data.presentThana),
      //     village: data.presentVillage || '',
      //     address: data.presentAddress || '',
      //     postCode: Number(data.presentPostCode),
      //     postOffice: data.presentPostOffice || '',
      //   },
      //   ...(data.isSameAsPermanent === 'no' && {
      //     permanentAddress: {
      //       division: Number(data.permanentDivision),
      //       district: Number(data.permanentDistrict),
      //       thana: Number(data.permanentThana),
      //       village: data.permanentVillage || '',
      //       address: data.permanentAddress || '',
      //       postCode: Number(data.permanentPostCode),
      //       postOffice: data.permanentPostOffice || '',
      //     },
      //   }),
      // };

      // await submitPartnerAddress({
      //   metaInfo: getMetaData(),
      //   attributes: addressPayload,
      // });

      await updateAddress(data);
      if (nextFormHref) {
        navigate(nextFormHref);
      }
    } catch (error) {
      console.error('Error submitting partner address:', error);
      toast({
        title: 'Failed to save partner address.',
        variant: 'destructive',
      });
    }
  };

  const formValues = form.watch();
  const isSameAsPermanent = formValues.isSameAsPermanent === 'yes';

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
          notVisible={disabled}
          previousFormHref={previousFormHref}
          // isLoading={isMutating}
        >
          Next
        </FormSubmitButton>
      </FormStyle>
    </Form>
  );
};

export default PartnerAddressForm;

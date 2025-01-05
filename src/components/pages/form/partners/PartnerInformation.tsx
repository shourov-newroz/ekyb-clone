import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormStyle,
  FormSubmitButton,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import DateWithLabel from '@/components/ui/DateWithLabel';
import InputWithLabelNew from '@/components/ui/InputWithLabelNew';
import RadioWithLabel from '@/components/ui/RadioWithLabel';
import SelectWithLabel from '@/components/ui/SelectWithLabel';
import {
  IPartnerInformationForm,
  PartnerInformationFormSchema,
  usePartnerForm,
} from '@/context/PartnerFormContext';
import { toast } from '@/hooks/useToast';
import { useNavigate } from 'react-router-dom';

interface PartnerInformationFormProps {
  defaultValues: Partial<IPartnerInformationForm>;
  disabled: boolean;
  nextFormHref: string;
  previousFormHref: string;
  onSubmit?: (data: IPartnerInformationForm) => void;
}

const PartnerInformationForm: React.FC<PartnerInformationFormProps> = ({
  defaultValues,
  disabled,
  nextFormHref,
  previousFormHref,
}) => {
  const navigate = useNavigate();
  const { updateInformation } = usePartnerForm();

  const form = useForm<IPartnerInformationForm>({
    resolver: zodResolver(PartnerInformationFormSchema),
    defaultValues,
  });

  // const { trigger: submitPartnerInfo, isMutating } = useSWRMutation(
  //   BACKEND_ENDPOINTS.SAVE_PARTNER_INFO,
  //   sendPostRequest,
  //   {
  //     onSuccess: (data) => {
  //       toast({
  //         title: data.message || 'Partner information saved successfully.',
  //       });
  //       if (nextFormHref) {
  //         navigate(nextFormHref);
  //       }
  //     },
  //     onError: () => {
  //       toast({
  //         title: 'Failed to save partner information.',
  //         variant: 'destructive',
  //       });
  //     },
  //   }
  // );

  const handleSubmit = async (data: IPartnerInformationForm) => {
    try {
      // Save partner information
      // const partnerInfoPayload: PartnerInfoAttributes = {
      //   firstName: data.firstName,
      //   lastName: data.lastName,
      //   gender: Number(data.gender),
      //   dateOfBirth: data.dateOfBirth?.toString().split('T')[0] || '',
      //   nationality: Number(data.nationality),
      //   fatherName: data.fatherName,
      //   motherName: data.motherName,
      //   spouseName: data.spouseName || '',
      //   residentStatus: data.residentStatus === 'RESIDENT',
      //   occupation: data.occupation,
      //   relationWithOrganization: data.relationWithOrganization,
      //   sourceOfFunds: Number(data.sourceOfFunds),
      //   monthlyIncome: data.monthlyIncome,
      //   IDType: Number(data.IDType),
      //   IDNumber: data.idNumber,
      //   IDExpiryDate: data.IDExpiryDate?.toString().split('T')[0] || '',
      //   tinNumber: data.tin,
      // };

      // await submitPartnerInfo({
      //   metaInfo: getMetaData(),
      //   attributes: partnerInfoPayload,
      // });

      await updateInformation(data);
      if (nextFormHref) {
        navigate(nextFormHref);
      }
    } catch (error) {
      console.error('Error submitting partner information:', error);
      toast({
        title: 'Failed to save partner information.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <FormStyle onSubmit={form.handleSubmit(handleSubmit)}>
        <div className='space-y-6'>
          {/* Name Section */}
          <div className='grid grid-cols-2 gap-6'>
            <FormField
              control={form.control}
              name='firstName'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithLabelNew
                      label='First Name'
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
              name='lastName'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithLabelNew
                      label='Last Name'
                      {...field}
                      disabled={disabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
                  disabled={disabled}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date of Birth and Nationality */}
          <div className='grid grid-cols-2 gap-6'>
            <FormField
              control={form.control}
              name='dateOfBirth'
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormControl>
                    <DateWithLabel
                      label='Date of Birth'
                      value={value || null}
                      onChange={onChange}
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
          </div>

          {/* Parent Names */}
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name='fatherName'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithLabelNew
                      label="Father's Name"
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
              name='motherName'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithLabelNew
                      label="Mother's Name"
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
              name='spouseName'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithLabelNew
                      label='Spouse Name'
                      {...field}
                      disabled={disabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Resident Status */}
          <FormField
            control={form.control}
            name='residentStatus'
            render={({ field }) => (
              <FormItem>
                <RadioWithLabel
                  label='Resident Status'
                  options={[
                    { label: 'Resident', value: 'RESIDENT' },
                    { label: 'Non Resident', value: 'NON_RESIDENT' },
                  ]}
                  {...field}
                  disabled={disabled}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Occupation and Relation */}
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name='occupation'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithLabelNew
                      label='Occupation'
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
              name='relationWithOrganization'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithLabelNew
                      label='Relation With Organization'
                      {...field}
                      disabled={disabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Income Section */}
          <div className='grid grid-cols-2 gap-6'>
            <FormField
              control={form.control}
              name='sourceOfFunds'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <SelectWithLabel
                      label='Source of Income'
                      optionsUrl='/public/fetchConfig?type=sourceOfFunds'
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
              name='monthlyIncome'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithLabelNew
                      label='Monthly Income'
                      prefix='BDT'
                      type='number'
                      {...field}
                      disabled={disabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* ID Section */}
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name='IDType'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <SelectWithLabel
                      label='ID Type'
                      optionsUrl='/public/fetchConfig?type=documentType'
                      {...field}
                      disabled={disabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch('IDType') && (
              <div className='grid grid-cols-2 gap-6'>
                <FormField
                  control={form.control}
                  name='idNumber'
                  render={({ field }) => {
                    const idType = form.watch('IDType');
                    const label =
                      idType === '1'
                        ? 'NID Number'
                        : idType === '2'
                        ? 'Passport Number'
                        : 'NID/Passport Number';

                    return (
                      <FormItem>
                        <FormControl>
                          <InputWithLabelNew
                            label={label}
                            {...field}
                            disabled={disabled}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name='IDExpiryDate'
                  render={({ field: { value, onChange, ...field } }) => {
                    const idType = form.watch('IDType');
                    const label =
                      idType === '1'
                        ? 'NID Expiry Date'
                        : idType === '2'
                        ? 'Passport Expiry Date'
                        : 'NID/Passport Expiry Date';

                    return (
                      <FormItem>
                        <FormControl>
                          <DateWithLabel
                            label={label}
                            value={value || null}
                            onChange={onChange}
                            {...field}
                            disabled={disabled}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
            )}
          </div>

          {/* TIN */}
          <FormField
            control={form.control}
            name='tin'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <InputWithLabelNew
                    label='Tax Identification Number (TIN)'
                    {...field}
                    disabled={disabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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

export default PartnerInformationForm;

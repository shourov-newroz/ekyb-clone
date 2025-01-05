import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

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

import {
  AddressAttributes,
  DocumentAttributes,
  PartnerAttributes,
  PartnerInfoAttributes,
} from '@/api/services/partnerService';
import { sendPostRequest } from '@/api/swrConfig';
import BACKEND_ENDPOINTS from '@/api/urls';
import {
  IPartnerDocumentForm,
  PartnerDocumentFormSchema,
  usePartnerForm,
} from '@/context/PartnerFormContext';
import useCompanyData from '@/hooks/useCompanyData';
import { toast } from '@/hooks/useToast';
import { ROUTE_PATH } from '@/routes/routePaths';
import { IMenus } from '@/types/common';
import { getMetaData } from '@/utils/getMetaData';
import { useNavigate } from 'react-router-dom';
import useSWRMutation from 'swr/mutation';

interface PartnerDocumentFormProps {
  defaultValues?: Partial<IPartnerDocumentForm>;
  disabled: boolean;
  previousFormHref: string;
  subMenu?: IMenus['subMenus'];
}

const PartnerDocumentForm: React.FC<PartnerDocumentFormProps> = ({
  defaultValues,
  disabled,
  previousFormHref,
  subMenu,
}) => {
  const { refreshData } = useCompanyData();
  const { formData, clearForm } = usePartnerForm();

  const navigate = useNavigate();

  const form = useForm<IPartnerDocumentForm>({
    resolver: zodResolver(PartnerDocumentFormSchema),
    defaultValues,
  });

  // const { trigger: submitPartnerDocument, isMutating } = useSWRMutation(
  //   BACKEND_ENDPOINTS.SAVE_PARTNER_DOCUMENT,
  //   sendPostRequest,
  //   {
  //     onSuccess: (data) => {
  //       toast({
  //         title: data.message || 'Partner documents saved successfully.',
  //       });
  //       refreshData();
  //       clearForm();
  //       navigate(ROUTE_PATH.partnerManagement);
  //     },
  //   }
  // );

  const { trigger: submitPartner, isMutating } = useSWRMutation(
    BACKEND_ENDPOINTS.SAVE_PARTNER,
    sendPostRequest,
    {
      onSuccess: (data) => {
        toast({
          title: data.message || 'Partner documents saved successfully.',
        });
        refreshData();
        clearForm();
        navigate(ROUTE_PATH.partnerManagement);
      },
    }
  );

  const handleSubmit = async (documentData: IPartnerDocumentForm) => {
    try {
      if (
        !formData.information.firstName ||
        !formData.address.presentDivision
      ) {
        toast({
          title: 'Please fill in all required information first.',
          variant: 'destructive',
        });
        // Navigate to the first incomplete form
        if (!formData.information.firstName) {
          navigate(subMenu?.[0]?.href || '');
        } else if (!formData.address.presentDivision) {
          navigate(subMenu?.[1]?.href || '');
        }
        return;
      }

      // const documentPayload: DocumentAttributes = {
      //   // Document Information
      //   tinNumber: formData.information.tin,
      //   nidFrontPhoto: documentData.nidFrontPhoto?.content || '',
      //   nidBackPhoto: documentData.nidBackPhoto?.content || '',
      //   passportPhoto: documentData.passportPhoto?.content || '',
      //   workPermitPhoto: documentData.workPermitPhoto?.content || '',
      //   ownerPhoto: documentData.ownerPhoto?.content || '',
      //   signaturePhoto: documentData.signature?.content || '',
      // };

      // await submitPartnerDocument({
      //   metaInfo: getMetaData(),
      //   attributes: documentPayload,
      // });

      // Save partner information
      const partnerInfoPayload: PartnerInfoAttributes = {
        firstName: formData.information.firstName,
        lastName: formData.information.lastName,
        gender: Number(formData.information.gender),
        dateOfBirth: formData.information.dateOfBirth?.toString() || '',
        nationality: Number(formData.information.nationality),
        fatherName: formData.information.fatherName,
        motherName: formData.information.motherName,
        spouseName: formData.information.spouseName || '',
        residentStatus: formData.information.residentStatus === 'RESIDENT',
        occupation: formData.information.occupation,
        relationWithOrganization: formData.information.relationWithOrganization,
        sourceOfFunds: Number(formData.information.sourceOfFunds),
        monthlyIncome: formData.information.monthlyIncome,
        IDType: Number(formData.information.IDType),
        IDNumber: formData.information.idNumber,
        IDExpiryDate:
          formData.information.IDExpiryDate?.toString().split('T')[0] || '',
        tinNumber: formData.information.tin,
      };

      // Save partner address
      const addressPayload: AddressAttributes = {
        // Address Information
        tinNumber: formData.information.tin,
        isSamePresentAndPermanentAddressPartner:
          formData.address.isSameAsPermanent === 'yes',
        presentAddress: {
          division: Number(formData.address.presentDivision),
          district: Number(formData.address.presentDistrict),
          thana: Number(formData.address.presentThana),
          village: formData.address.presentVillage || '',
          address: formData.address.presentAddress || '',
          postCode: Number(formData.address.presentPostCode),
          postOffice: formData.address.presentPostOffice || '',
        },
        ...(formData.address.isSameAsPermanent === 'no' && {
          permanentAddress: {
            division: Number(formData.address.permanentDivision),
            district: Number(formData.address.permanentDistrict),
            thana: Number(formData.address.permanentThana),
            village: formData.address.permanentVillage || '',
            address: formData.address.permanentAddress || '',
            postCode: Number(formData.address.permanentPostCode),
            postOffice: formData.address.permanentPostOffice || '',
          },
        }),
      };

      const documentPayload: DocumentAttributes = {
        // Document Information
        tinNumber: formData.information.tin,
        nidFrontPhoto: documentData.nidFrontPhoto?.content || '',
        nidBackPhoto: documentData.nidBackPhoto?.content || '',
        passportPhoto: documentData.passportPhoto?.content || '',
        workPermitPhoto: documentData.workPermitPhoto?.content || '',
        ownerPhoto: documentData.ownerPhoto?.content || '',
        signaturePhoto: documentData.signature?.content || '',
      };

      const partnerPayload: PartnerAttributes = {
        ...partnerInfoPayload,
        ...addressPayload,
        ...documentPayload,
      };

      await submitPartner({
        metaInfo: getMetaData(),
        attributes: partnerPayload,
      });
      // await updateDocument(documentData);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Failed to save partner documents.',
        variant: 'destructive',
      });
    }
  };

  const renderFileUploadField = (
    name: keyof IPartnerDocumentForm,
    boxLabel: string,
    label?: string
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <FileUploadWithLabel
              boxLabel={boxLabel}
              label={label}
              value={field.value}
              onFilesChange={(files) => field.onChange(files[0] || null)}
              disabled={disabled}
              maxFiles={1}
              downloadableFile={{
                content: defaultValues?.[name as keyof IPartnerDocumentForm],
                name: `${name}.jpeg`,
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <Form {...form}>
      <FormStyle onSubmit={form.handleSubmit(handleSubmit)}>
        {/* Document Type */}
        {/* <FormField
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
          /> */}

        {/* Conditional Fields Based on Document Type */}
        {defaultValues?.documentType === '1' && (
          <div>
            <h3 className='label-text'>National ID card</h3>
            <div className='flex gap-6'>
              {renderFileUploadField('nidFrontPhoto', 'NID Front Photo')}
              {renderFileUploadField('nidBackPhoto', 'NID Back Photo')}
            </div>
          </div>
        )}

        {defaultValues?.documentType === '2' && (
          <div>
            <h3 className='label-text'>Passport</h3>
            <div className='flex gap-6'>
              {renderFileUploadField('passportPhoto', 'Passport Photo')}
              {renderFileUploadField('workPermitPhoto', 'Work Permit Photo')}
            </div>
          </div>
        )}

        {/* Owner Photo */}
        {renderFileUploadField('ownerPhoto', 'Owner Photo', 'Owner Photo')}

        {/* Signature */}
        {renderFileUploadField('signature', 'Signature', 'Signature')}

        {/* Submit Button */}
        <FormSubmitButton
          notVisible={disabled}
          previousFormHref={previousFormHref}
          isLoading={isMutating}
        />
      </FormStyle>
    </Form>
  );
};

export default PartnerDocumentForm;

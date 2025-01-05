'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
import SelectWithLabel from '@/components/ui/SelectWithLabel';
import { toast } from '@/hooks/useToast';

// Validation Schema
import { sendPostRequest } from '@/api/swrConfig';
import BACKEND_ENDPOINTS from '@/api/urls';
import useCompanyData from '@/hooks/useCompanyData';
import { getMetaData } from '@/utils/getMetaData';
import { useNavigate } from 'react-router-dom';
import useSWRMutation from 'swr/mutation';

// Validation Schema
const PersonalDocumentSchema = z
  .object({
    documentType: z
      .string()
      .nonempty({ message: 'Document type is required.' }),
    passportPhoto: z.any().optional(),
    workPermitPhoto: z.any().optional(),
    nidFrontPhoto: z.any().optional(),
    nidBackPhoto: z.any().optional(),
    ownerPhoto: z.any().refine((file) => file && file.size <= 1024 * 1024 * 4, {
      message: 'Owner photo is required and must not exceed 4MB.',
    }),
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

type FormData = z.infer<typeof PersonalDocumentSchema>;

interface PersonalDocumentFormProps {
  defaultValues: FormData;
  isSubmitted: boolean;
  nextFormHref: string;
}

const OwnershipPersonalDocumentForm: React.FC<PersonalDocumentFormProps> = ({
  defaultValues,
  isSubmitted,
  nextFormHref,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();
  const { refreshData } = useCompanyData();

  const form = useForm<FormData>({
    resolver: zodResolver(PersonalDocumentSchema),
    defaultValues,
  });

  const { trigger, isMutating } = useSWRMutation(
    BACKEND_ENDPOINTS.SAVE_PERSONAL_DOCUMENT,
    sendPostRequest,
    {
      onSuccess: (data) => {
        toast({
          title: data.message || 'Personal Document submitted successfully.',
        });
        refreshData();
        setIsEditMode(false);
        if (!isSubmitted && nextFormHref) {
          navigate(nextFormHref);
        }
      },
    }
  );

  const documentType = form.watch('documentType');
  const isFormDisabled = isSubmitted && !isEditMode;

  const renderFileUploadField = (
    name: keyof FormData,
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
              onFilesChange={(files) => field.onChange(files[0] || null)}
              disabled={isFormDisabled}
              maxFiles={1}
              downloadableFile={{
                content: defaultValues[name as keyof FormData],
                name: `${name}.jpeg`,
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  const onSubmit = async (data: FormData) => {
    const formData = {
      metaInfo: getMetaData(),
      attributes: {
        documentType: data.documentType,
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
                  disabled={isFormDisabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Conditional Fields Based on Document Type */}
        {documentType === '1' && (
          <div>
            <h3 className='label-text'>National ID card</h3>
            <div className='flex gap-6'>
              {renderFileUploadField('nidFrontPhoto', 'NID Front Photo')}
              {renderFileUploadField('nidBackPhoto', 'NID Back Photo')}
            </div>
          </div>
        )}

        {documentType === '2' && (
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

        {/* Submit Button */}
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

export default OwnershipPersonalDocumentForm;

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

import { sendPostRequest } from '@/api/swrConfig';
import BACKEND_ENDPOINTS from '@/api/urls';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
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
import { cn } from '@/lib/utils';
import { getMetaData } from '@/utils/getMetaData';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSWRMutation from 'swr/mutation';

const FormSchema = z.object({
  partners: z.array(
    z
      .object({
        documentType: z
          .string()
          .min(1, { message: 'Document type is required.' }),
        passportPhoto: z.any().optional(),
        workPermitPhoto: z.any().optional(),
        nidFrontPhoto: z.any().optional(),
        nidBackPhoto: z.any().optional(),
        ownerPhoto: z
          .any()
          .refine((file) => file && file.size <= 1024 * 1024 * 4, {
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
        dateOfBirth: z
          .date()
          .nullable()
          .refine((date) => date, {
            message: 'Date of birth is required.',
          }),
        dateOfIssue: z
          .date()
          .nullable()
          .refine((date) => date, {
            message: 'Date of issue is required.',
          }),
        dateOfExpiry: z
          .date()
          .nullable()
          .refine((date) => date, {
            message: 'Date of expiry is required.',
          }),
        gender: z.string().min(1, { message: 'Gender is required.' }),
        nationality: z.string().min(1, { message: 'Nationality is required.' }),
        idNumber: z
          .string()
          .regex(/^\d+$/, { message: 'ID Number must be numeric.' })
          .min(1, { message: 'ID Number is required.' }),
        // .min(10, { message: 'NID must be at least 10 digits.' }),
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

        // Custom validation for dates
        if (data.dateOfIssue && data.dateOfExpiry) {
          if (data.dateOfExpiry <= data.dateOfIssue) {
            ctx.addIssue({
              code: 'custom',
              path: ['dateOfExpiry'],
              message: 'Date of expiry must be after date of issue.',
            });
          }
        }
      })
  ),
});

type FormData = z.infer<typeof FormSchema>;

interface OwnershipAdditionalPartnersFormProps {
  defaultValues: FormData;
  disabled: boolean;
  nextFormHref: string;
  previousFormHref: string;
}

const OwnershipAdditionalPartnersForm: React.FC<
  OwnershipAdditionalPartnersFormProps
> = ({ defaultValues, disabled, nextFormHref, previousFormHref }) => {
  const navigate = useNavigate();
  const { refreshData } = useCompanyData();

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'partners',
  });

  const [openAccordion, setOpenAccordion] = useState<string>(fields[0]?.id);

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

  const documentType = (index: number) =>
    form.watch(`partners.${index}.documentType`);

  type PartnerField =
    | 'passportPhoto'
    | 'workPermitPhoto'
    | 'nidFrontPhoto'
    | 'nidBackPhoto'
    | 'ownerPhoto';

  const renderFileUploadField = (
    name: PartnerField,
    label: string,
    index: number
  ) => (
    <FormField
      control={form.control}
      name={`partners.${index}.${name}` as const}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <FileUploadWithLabel
              label={label}
              value={field.value ? [field.value] : []}
              onFilesChange={(files) => field.onChange(files[0] || null)}
              disabled={disabled}
              maxFiles={1}
              // downloadableFile={{
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
        partners: data.partners.map((partner) => ({
          ...partner,
          passportPhoto: partner.passportPhoto?.content,
          workPermitPhoto: partner.workPermitPhoto?.content,
          nidFrontPhoto: partner.nidFrontPhoto?.content,
          nidBackPhoto: partner.nidBackPhoto?.content,
          ownerPhoto: partner.ownerPhoto?.content,
        })),
      },
    };
    await trigger(formData);
  };

  useEffect(() => {
    if (form.formState.errors?.partners) {
      // Find the first error index in the `products` array
      const firstErrorIndex = Object.keys(form.formState.errors?.partners).map(
        Number
      )[0]; // Get the smallest (first) index

      if (firstErrorIndex !== undefined) {
        setOpenAccordion(fields[firstErrorIndex]?.id);
      }
    }
  }, [form.formState.errors, fields]);

  return (
    <Form {...form}>
      <FormStyle onSubmit={form.handleSubmit(onSubmit)}>
        <Accordion
          type='single'
          collapsible
          value={openAccordion}
          onValueChange={setOpenAccordion} // Update state on Accordion change
        >
          {fields.map((field, index) => (
            <AccordionItem
              value={field.id}
              key={field.id}
              className={cn('space-y-4 border-b pb-4 mb-0', {
                'mb-4': index !== fields.length - 1,
              })}
            >
              <AccordionTrigger className='text-base font-bold md:text-lg'>
                Partner {index + 1}
              </AccordionTrigger>
              <AccordionContent className='space-y-6'>
                <FormField
                  control={form.control}
                  name={`partners.${index}.documentType`}
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

                {documentType(index) === '1' && (
                  <>
                    {renderFileUploadField(
                      'nidFrontPhoto',
                      'NID Front Photo',
                      index
                    )}
                    {renderFileUploadField(
                      'nidBackPhoto',
                      'NID Back Photo',
                      index
                    )}
                  </>
                )}
                {documentType(index) === '2' && (
                  <>
                    {renderFileUploadField(
                      'passportPhoto',
                      'Passport Photo',
                      index
                    )}
                    {renderFileUploadField(
                      'workPermitPhoto',
                      'Work Permit Photo',
                      index
                    )}
                  </>
                )}

                <FormField
                  control={form.control}
                  name={`partners.${index}.fullName`}
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
                  name={`partners.${index}.role`}
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
                  name={`partners.${index}.sharePercent`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputWithLabelNew
                          label='Share Percent'
                          {...field}
                          type='number'
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
                  name={`partners.${index}.dateOfBirth`}
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
                  name={`partners.${index}.dateOfIssue`}
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
                  name={`partners.${index}.dateOfExpiry`}
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

                <FormField
                  control={form.control}
                  name={`partners.${index}.gender`}
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
                  name={`partners.${index}.nationality`}
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
                  name={`partners.${index}.idNumber`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputWithLabelNew
                          label='ID Number'
                          {...field}
                          disabled={disabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {renderFileUploadField('ownerPhoto', 'Owner Photo', index)}

                {fields.length > 1 && (
                  <Button
                    type='button'
                    variant='destructive'
                    onClick={() => remove(index)}
                    className='mt-2'
                  >
                    Remove Partner
                  </Button>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {!disabled && (
          <Button
            type='button'
            variant='outline'
            onClick={() =>
              append({
                documentType: '',
                fullName: '',
                role: '',
                sharePercent: '',
                dateOfBirth: null, // Corrected to match `z.date().nullable()`
                gender: '',
                nationality: '',
                idNumber: '',
                ownerPhoto: null,
                passportPhoto: null,
                workPermitPhoto: null,
                nidFrontPhoto: null,
                nidBackPhoto: null,
                dateOfIssue: null, // Corrected to match `z.date().nullable()`
                dateOfExpiry: null, // Corrected to match `z.date().nullable()`
              })
            }
          >
            Add Partner
          </Button>
        )}

        <FormSubmitButton
          isLoading={isMutating}
          notVisible={disabled}
          previousFormHref={previousFormHref}
        />
      </FormStyle>
    </Form>
  );
};

export default OwnershipAdditionalPartnersForm;

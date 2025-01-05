import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { sendPostRequest } from '@/api/swrConfig';
import BACKEND_ENDPOINTS from '@/api/urls';
import FileUploadWithLabel, {
  FileData,
} from '@/components/ui/FileUploadWithLabel';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormStyle,
  FormSubmitButton,
} from '@/components/ui/form';
import useCompanyData from '@/hooks/useCompanyData';
import { toast } from '@/hooks/useToast';
import { documentSchema } from '@/types/common';
import { getMetaData } from '@/utils/getMetaData';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import useSWRMutation from 'swr/mutation';

const getLabel = (key: string): { label: string; boxLabel: string } => {
  switch (key) {
    case 'tradeLicense':
      return {
        label: 'Please upload your company updated Trade License',
        boxLabel: 'Trade License',
      };
    case 'TINorBIN':
      return {
        label: 'Please upload your company TIN/BIN Certificate',
        boxLabel: 'TIN/BIN Certificate',
      };
    case 'partnershipDeedFirstPage':
      return {
        label: 'Please upload your company updated Partnership Deed (1st Page)',
        boxLabel: 'Partnership Deed (1st Page)',
      };
    case 'partnershipDeedSixthPage':
      return {
        label: 'Please upload your company Partnership Deed (6th Page)',
        boxLabel: 'Partnership Deed (6th Page)',
      };
    case 'MOA':
      return {
        label: 'Please upload your company Memorandum of Association (MOA)',
        boxLabel: 'MOA',
      };
    case 'AOA':
      return {
        label: 'Please upload your company Articles of Association (AOA)',
        boxLabel: 'AOA',
      };
    case 'certificateOfIncorporation':
      return {
        label: 'Please upload your company Certificate of Incorporation',
        boxLabel: 'Certificate of Incorporation',
      };
    case 'certificateOfCoOperation':
      return {
        label: 'Please upload your company Certificate of Cooperation',
        boxLabel: 'Certificate of Cooperation',
      };
    case 'chairmanRecommendationLetter':
      return {
        label: "Please upload your company Chairman's Recommendation Letter",
        boxLabel: "Chairman's Recommendation Letter",
      };
    default:
      // Fallback: Convert camelCase or PascalCase to Title Case
      return {
        label: key
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, (str) => str.toUpperCase()),
        boxLabel: key
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, (str) => str.toUpperCase()),
      };
  }
};

// Base schema with all fields
const baseSchema = z.object({
  tradeLicense: z.union([z.array(documentSchema), z.string()]),
  TINorBIN: z.union([z.array(documentSchema), z.string()]),
  partnershipDeedFirstPage: z.union([z.array(documentSchema), z.string()]),
  partnershipDeedSixthPage: z.union([z.array(documentSchema), z.string()]),
  MOA: z.union([z.array(documentSchema), z.string()]),
  AOA: z.union([z.array(documentSchema), z.string()]),
  certificateOfIncorporation: z.union([z.array(documentSchema), z.string()]),
  certificateOfCoOperation: z.union([z.array(documentSchema), z.string()]),
  chairmanRecommendationLetter: z.union([z.array(documentSchema), z.string()]),
});

const getCompanyDocumentSchema = (organizationType: string) => {
  // Add conditional logic based on organizationType
  switch (organizationType) {
    case '1': // Sole Proprietorship
      return baseSchema.pick({
        tradeLicense: true,
        TINorBIN: true,
      });
    case '2': // Private Limited
      return baseSchema.pick({
        tradeLicense: true,
        TINorBIN: true,
        MOA: true,
        AOA: true,
        certificateOfIncorporation: true,
      });
    case '3': // Partnership
      return baseSchema.pick({
        tradeLicense: true,
        TINorBIN: true,
        partnershipDeedFirstPage: true,
        partnershipDeedSixthPage: true,
      });
    case '4': // Public
      return baseSchema; // All fields are required for "Public"
    case '5': // Non-Profit
      return baseSchema.pick({
        tradeLicense: true,
        TINorBIN: true,
        certificateOfCoOperation: true,
      });
    case '6': // Others
      return baseSchema.pick({
        chairmanRecommendationLetter: true,
      });
    default:
      throw new Error(`Unknown organization type: ${organizationType}`);
  }
};

type BaseSchemaType = z.infer<typeof baseSchema>;

interface ICompanyDocumentFormProps {
  defaultValues: BaseSchemaType;
  isSubmitted: boolean;
  organizationType: string;
  nextFormHref: string;
  previousFormHref: string;
}

const CompanyDocumentForm: React.FC<ICompanyDocumentFormProps> = ({
  defaultValues,
  isSubmitted,
  organizationType,
  nextFormHref,
  previousFormHref,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();
  const { refreshData } = useCompanyData();

  const validationSchema = React.useMemo(
    () => getCompanyDocumentSchema(organizationType),
    [organizationType]
  );

  const form = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: defaultValues,
  });

  // Rest of the form implementation remains unchanged
  const { trigger, isMutating } = useSWRMutation(
    BACKEND_ENDPOINTS.SAVE_COMPANY_DOCUMENT,
    sendPostRequest,
    {
      onSuccess: (data) => {
        toast({
          title: data.data.message || 'Form submitted successfully',
        });
        refreshData();
        setIsEditMode(false);
        if (!isSubmitted && nextFormHref) {
          navigate(nextFormHref);
        }
      },
    }
  );

  const handleFilesChange =
    (field: keyof z.infer<typeof validationSchema>) => (files: FileData[]) => {
      const updatedFiles = files.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
        content: file.content || '',
      })) as z.infer<typeof validationSchema>[typeof field];

      form.setValue(field, updatedFiles);
      form.trigger(field);
    };

  // const handleCancelPreview = (
  //   field: keyof z.infer<typeof validationSchema>
  // ) => {
  //   form.setValue(field, []);
  //   form.trigger(field);
  // };

  const onSubmit = (data: z.infer<typeof validationSchema>) => {
    const formData = {
      metaInfo: getMetaData(),
      attributes: Object.keys(data).reduce((acc, key) => {
        const typedKey = key as keyof z.infer<typeof validationSchema>;
        const fileArray = data[typedKey] as { content: string }[];
        acc[typedKey] = fileArray?.[0]?.content || null; // Access the 'content' property
        return acc;
      }, {} as Record<string, string | null>),
    };

    trigger(formData);
  };

  const fieldsToRender = Object.keys(validationSchema.shape).map((key) => ({
    name: key,
    label: getLabel(key).label,
    boxLabel: getLabel(key).boxLabel,
    value: form.getValues(key as keyof z.infer<typeof validationSchema>) as
      | string
      | FileData[],
  }));

  const isFormDisabled = isSubmitted && !isEditMode;

  return (
    <Form {...form}>
      <FormStyle onSubmit={form.handleSubmit(onSubmit)}>
        {fieldsToRender.map(({ name, label, boxLabel, value }) => (
          <FormField
            key={name}
            control={form.control}
            name={name as keyof z.infer<typeof validationSchema>}
            render={() => (
              <FormItem>
                <FormControl>
                  <FileUploadWithLabel
                    label={label}
                    boxLabel={boxLabel}
                    value={value}
                    onFilesChange={(files) =>
                      handleFilesChange(
                        name as keyof z.infer<typeof validationSchema>
                      )(files)
                    }
                    maxFiles={1}
                    disabled={isFormDisabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
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

export default CompanyDocumentForm;

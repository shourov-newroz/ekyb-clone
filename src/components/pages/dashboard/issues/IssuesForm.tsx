import { sendPostRequest } from '@/api/swrConfig';
import BACKEND_ENDPOINTS from '@/api/urls';
import LoadingSvg from '@/components/loading/LoadingSvg';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import useCompanyData from '@/hooks/useCompanyData';
import { toast } from '@/hooks/useToast';
import { IIssue } from '@/types/issues';
import { getMetaData } from '@/utils/getMetaData';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import useSWRMutation from 'swr/mutation';
import { z } from 'zod';
import IssueCard from './IssueCard';

const FormSchema = z.object({
  responses: z
    .array(
      z.object({
        trackingId: z.string(),
        newValue: z.string().min(1, 'New value is required'),
        file: z.any().optional(),
        explanation: z.string().optional().default(''),
      })
    )
    .min(1, 'At least one response is required'),
});

export type IssueFromSchemaType = z.infer<typeof FormSchema>;

// Main Issues Form Component
const IssuesForm: React.FC<{
  issues: IIssue[];
  isHistory: boolean;
  handleSuccessfulSubmission: () => void;
}> = ({ issues, isHistory, handleSuccessfulSubmission }) => {
  const { companyData } = useCompanyData();

  const form = useForm<IssueFromSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      responses: issues.map((issue) => ({
        trackingId: issue.trackingId,
        newValue: isHistory ? issue.newValue || '' : '',
        file: isHistory ? issue.file || '' : '',
        explanation: isHistory ? issue.explanation || '' : '',
      })),
    },
  });

  const { trigger, isMutating } = useSWRMutation(
    BACKEND_ENDPOINTS.UPDATE_ISSUE,
    sendPostRequest,
    {
      onSuccess: () => {
        toast({
          title: 'Issue updated successfully',
        });
        form.reset();
        handleSuccessfulSubmission();
      },
    }
  );

  const onSubmit = async (data: IssueFromSchemaType) => {
    if (!companyData?.id) {
      toast({
        title: 'Error',
        description: 'Company data is not available',
        variant: 'destructive',
      });
      return;
    }

    const formData = {
      metaInfo: getMetaData(),
      attributes: {
        applicationId: companyData.id,
        issueResolves: data.responses.map((response) => ({
          trackingId: response.trackingId,
          newValue: response.newValue.trim(),
          file: response.file?.content || '',
          explanation: response.explanation?.trim() || '',
        })),
      },
    };

    await trigger(formData);
  };

  if (issues.length === 0) {
    return (
      <div className='flex min-h-40 w-full items-center justify-center text-lg font-semibold'>
        No issues pending
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        {issues.map((issue, index) => (
          <IssueCard
            key={issue.trackingId}
            issue={issue}
            control={form.control}
            fieldPath={`responses.${index}`}
            isHistory={isHistory}
          />
        ))}
        {!isHistory && (
          <div className='flex w-full justify-end'>
            <Button
              type='submit'
              className='mt-4'
              size='lg'
              disabled={isMutating || !form.formState.isValid}
            >
              {isMutating ? (
                <LoadingSvg className='size-8 text-white' />
              ) : (
                'Submit'
              )}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
};

export default IssuesForm;

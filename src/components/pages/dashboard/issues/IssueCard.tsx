import { Button } from '@/components/ui/button';
import FileUploadButton from '@/components/ui/FileUploadButton';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import TextAreaWithLabel from '@/components/ui/TextAreaWithLabel';
import { formatDate, getOrderStatusStyles } from '@/lib/utils';
import { IIssue } from '@/types/issues';
import { Control } from 'react-hook-form';
import { IssueFromSchemaType } from './IssuesForm';

const IssueCard: React.FC<{
  issue: IIssue;
  control: Control<IssueFromSchemaType>;
  fieldPath: `responses.${number}`;
  isHistory: boolean;
}> = ({ issue, control, fieldPath, isHistory }) => {
  return (
    <div className='flex flex-col gap-6 border-b border-gray-200 bg-white p-4 pb-8 lg:flex-row'>
      <div className='basis-2/5 space-y-4'>
        <h3 className='text-lg font-semibold text-gray-800'>{issue.name}</h3>

        <div>
          <p className='text-xs font-light text-gray-500'>
            Reason for this request:
          </p>
          <p className='text-sm'>{issue.reason}</p>
        </div>

        <div className='flex max-w-lg items-center justify-between gap-10 text-sm text-gray-500'>
          <span className='flex items-center gap-2 text-xs'>
            <span className='text-gray-500'>Current Status:</span>
            <span
              className={`flex h-8 items-center rounded-full px-3 text-xs font-semibold ${getOrderStatusStyles(
                issue.status
              )}`}
            >
              {issue.status}
            </span>
            <span className='text-black'>({formatDate(issue.createdAt)})</span>
          </span>
        </div>
      </div>

      <div className='min-w-max basis-3/5 space-y-4 2xl:basis-2/5'>
        <FormField
          control={control}
          name={`${fieldPath}.newValue`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TextAreaWithLabel
                  label='Value'
                  {...field}
                  rows={4}
                  disabled={isHistory}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`${fieldPath}.explanation`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TextAreaWithLabel
                  label='Explanation'
                  {...field}
                  rows={4}
                  disabled={isHistory}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isHistory && issue?.file && (
          <div className='space-x-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => window.open(issue.file || '', '_blank')}
              className=''
            >
              View Uploaded File
            </Button>
          </div>
        )}

        {!isHistory && (
          <FormField
            control={control}
            name={`${fieldPath}.file`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FileUploadButton
                    label={'File'}
                    onFilesChange={(files) => field.onChange(files[0] || null)}
                    maxFiles={1}
                    disabled={isHistory}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
    </div>
  );
};

export default IssueCard;

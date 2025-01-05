import { Button } from '@/components/ui/button';
import FileUploadWithLabel, {
  FileData,
} from '@/components/ui/FileUploadWithLabel';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

// Define form schema
const formSchema = z.object({
  files: z
    .array(
      z.object({
        name: z.string(),
        size: z.number().max(1024 * 1024 * 4, 'File size exceeds 4MB limit'),
        type: z.enum([
          'image/svg+xml',
          'image/png',
          'image/jpeg',
          'image/gif',
          'application/pdf',
        ]),
        content: z.string(),
      })
    )
    .min(1, 'At least one file is required'),
});

export default function FileTestForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      files: [],
    },
  });

  const handleFilesChange = (files: FileData[]) => {
    const file = files as unknown as z.infer<typeof formSchema>['files'];

    // Update the value in the form
    form.setValue('files', file);

    // Trigger validation for the 'files' field
    form.trigger('files');
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log('Submitting form data:', values);
      toast.success('Form submitted successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to submit the form.');
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='mx-auto max-w-3xl space-y-8 py-10'
      >
        <FormField
          control={form.control}
          name='files'
          render={() => (
            <FormItem>
              <FormControl>
                <FileUploadWithLabel
                  label='Upload files'
                  onFilesChange={handleFilesChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Submit</Button>
      </form>
    </Form>
  );
}

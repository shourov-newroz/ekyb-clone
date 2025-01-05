import { Button } from '@/components/ui/button';
import FileUploadWithLabel from '@/components/ui/FileUploadWithLabel';
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
  files: z.any().refine((file) => file && file.size <= 1024 * 1024 * 4, {
    message: 'File is required and must not exceed 4MB.',
  }),
});

export default function FileTestForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      files: null,
    },
  });

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
        className='max-w-3xl py-10 mx-auto space-y-8'
      >
        <FormField
          control={form.control}
          name='files'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FileUploadWithLabel
                  boxLabel='Upload files'
                  label='Upload files'
                  value={field.value}
                  onFilesChange={(files) => field.onChange(files[0])}
                  disabled={false}
                  maxFiles={1}
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

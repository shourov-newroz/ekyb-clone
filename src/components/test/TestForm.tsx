import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { toast } from '@/hooks/useToast';

import FileUploadWithLabel from '@/components/ui/FileUploadWithLabel';
import InputWithLabelNew from '@/components/ui/InputWithLabelNew';
import SelectWithLabel from '@/components/ui/SelectWithLabel';
import DateWithLabel from '../ui/DateWithLabel';
import RadioWithLabel from '../ui/RadioWithLabel';

// Validation schema
const FormSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  email: z
    .string({
      required_error: 'Please select an email to display.',
    })
    .email(),
  phone: z
    .string()
    .min(10, { message: 'Phone number must be at least 10 characters.' })
    .regex(/^[0-9]+$/, { message: 'Phone number must contain only numbers.' }),
  ownerPhoto: z.any().refine((file) => file && file.size <= 1024 * 1024 * 4, {
    message: 'Owner photo is required and must not exceed 4MB.',
  }),
  dob: z.date({
    required_error: 'A date of birth is required.',
  }),
  tabSelection: z.string().min(1, { message: 'Please select a tab.' }),
});

function TestForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
      email: '',
      phone: '',
      ownerPhoto: null,
      tabSelection: '',
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-2/3 space-y-6'>
        {/* Username field */}
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputWithLabelNew label='Username' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email field */}
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <SelectWithLabel
                label='Email'
                options={[
                  { value: 'm@example.com', label: 'm@example.com' },
                  { value: 'm@google.com', label: 'm@google.com' },
                  { value: 'm@support.com', label: 'm@support.com' },
                ]}
                {...field}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone field */}
        <FormField
          control={form.control}
          name='phone'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputWithLabelNew
                  label='Phone Number'
                  {...field}
                  type='number'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Owner Photo */}
        <FormField
          control={form.control}
          name='ownerPhoto'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FileUploadWithLabel
                  label='Owner Photo'
                  onFilesChange={(files) => field.onChange(files[0] || null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='dob'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DateWithLabel label='Date of Birth' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='tabSelection'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioWithLabel
                  label='Select a Tab'
                  optionsUrl='/public/fetchConfig?type=nationality'
                  {...field}
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

export default TestForm;

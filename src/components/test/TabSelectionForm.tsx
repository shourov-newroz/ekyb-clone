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
import RadioWithLabel from '../ui/RadioWithLabel'; // Adjust path as needed

const FormSchema = z.object({
  tabSelection: z.string().min(1, { message: 'Please select a tab.' }), // Validation
});

export function TabSelectionForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      tabSelection: '', // Default tab
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log('Form Data:', data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
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

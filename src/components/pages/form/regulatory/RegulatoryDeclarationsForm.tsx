import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { sendPostRequest } from '@/api/swrConfig';
import BACKEND_ENDPOINTS from '@/api/urls';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormStyle,
} from '@/components/ui/form';
import useCompanyData from '@/hooks/useCompanyData';
import { toast } from '@/hooks/useToast';
import { IApiResponse, IFormSubmissionResponse } from '@/types/common';
import { useNavigate } from 'react-router-dom';
import useSWRMutation from 'swr/mutation';
import RegulatoryConfirmation from './RegulatoryConfirmation';

const items = [
  {
    id: 'newsletter',
    label: "I'd like to hear about special offers from Newroz Technologies",
  },
  {
    id: 'updates',
    label: "I'd like to receive updates from Newroz Technologies",
  },
  { id: 'terms', label: 'I agree to the terms and conditions' },
] as const;

const FormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.length === items.length, {
    message: 'You have to select all',
  }),
});

type FormData = z.infer<typeof FormSchema>;

interface IRegulatoryDeclarationsFormProps {
  defaultValues: { isOnProcess: boolean };
  disabled: boolean;
  nextFormHref: string;
}

const RegulatoryDeclarationsForm: React.FC<
  IRegulatoryDeclarationsFormProps
> = ({ defaultValues, disabled, nextFormHref }) => {
  const navigate = useNavigate();
  const { refreshData } = useCompanyData();
  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: defaultValues.isOnProcess
      ? { items: items.map((item) => item.id) }
      : { items: [] },
  });

  const { trigger, isMutating } = useSWRMutation(
    BACKEND_ENDPOINTS.SAVE_REGULATORY_DECLARATIONS,
    sendPostRequest,
    {
      onSuccess: (data: IApiResponse<IFormSubmissionResponse>) => {
        toast({
          title: data.data.message || 'Form submitted successfully',
        });
        refreshData();
        if (nextFormHref) {
          navigate(`${nextFormHref}`);
        }
      },
    }
  );

  const onSubmit = () => {
    trigger();
  };

  return (
    <Form {...form}>
      <FormStyle onSubmit={form.handleSubmit(onSubmit)} id='hook-form'>
        <FormField
          control={form.control}
          name='items'
          render={() => (
            <FormItem>
              {items.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name='items'
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.id}
                        className='flex flex-row items-start gap-3 space-y-0 '
                      >
                        <FormControl>
                          <Checkbox
                            className='mt-0.5'
                            checked={field.value?.includes(item.id)}
                            disabled={disabled}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, item.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item.id
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className='font-bukra text-base font-medium'>
                          {item.label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <RegulatoryConfirmation disabled={disabled} isMutating={isMutating} />
      </FormStyle>
    </Form>
  );
};

export default RegulatoryDeclarationsForm;

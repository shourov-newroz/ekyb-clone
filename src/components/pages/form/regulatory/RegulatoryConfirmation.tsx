import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FormSubmitButton } from '@/components/ui/form';

interface Props {
  isMutating: boolean;
  disabled: boolean;
}

const RegulatoryConfirmation: React.FC<Props> = ({ isMutating, disabled }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <FormSubmitButton isLoading={isMutating} notVisible={disabled} />
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Confirm Submission</DialogTitle>
          <DialogDescription>
            Please confirm that all regulatory details provided are accurate and
            up to date. Once submitted, changes may not be possible.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='sm:justify-end'>
          <DialogClose asChild>
            <Button type='button' variant='outline'>
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type='submit' form='hook-form' disabled={isMutating}>
              Confirm and Submit
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RegulatoryConfirmation;

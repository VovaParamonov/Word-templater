import { FC } from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage
} from '@renderer/components/ui/form';
import { Input } from '@renderer/components/ui/input';
import { FormRowModel } from '@renderer/model/form/FormRow';

interface IFormRowProps {
  fomController: UseFormReturn;
  formRowModel: FormRowModel;
}

const FormRow: FC<IFormRowProps> = (props) => {
  const { formRowModel, fomController } = props;

  return (
    <FormField
      control={fomController.control}
      name={formRowModel.getId()}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{formRowModel.getPublicName()}</FormLabel>
          <FormControl>
            <Input type={'number'} {...field} />
          </FormControl>
          <FormDescription>{formRowModel.getDescription()}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormRow;

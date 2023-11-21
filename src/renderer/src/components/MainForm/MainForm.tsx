import { FC, useCallback, useMemo } from 'react';
import FormRow from './FormRow';
import { FormModel } from '@renderer/model/form/FormModel';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@renderer/components/ui/card';
import { Button } from '@renderer/components/ui/button';
import { Form } from '@renderer/components/ui/form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CardFooter } from '@renderer/components/ui/card';

interface IMainFormProps {
  formModel: FormModel;
  onSubmit: (form: Record<string, any>) => void;
}

// TODO: Implement caching of form state
const MainForm: FC<IMainFormProps> = (props) => {
  const { formModel, onSubmit } = props;

  const formSchema = useMemo(
    () =>
      z.object(
        formModel.getRows().reduce(
          (accum, item) => ({
            ...accum,
            [item.getId()]: z
              .string({ required_error: 'Поле обязательно для заполнения' })
              .transform((value) => (value ? parseInt(value, 10) : undefined))
          }),
          {}
        )
      ),
    [formModel]
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: formModel.getRows().reduce(
      (accum, row) => ({
        ...accum,
        [row.getId()]: ''
      }),
      {}
    )
  });

  const formRowsJSX = useMemo(() => {
    const rows = formModel.getRows();

    return rows.map((rowModel) => (
      <FormRow fomController={form} key={rowModel.getId()} formRowModel={rowModel} />
    ));
  }, [formModel, form.formState]);

  const formDescription = formModel.getDescription();

  const handleSubmit = useCallback(
    (data: any) => {
      onSubmit(data);
    },
    [onSubmit]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Форма &quot;{formModel.getPublicName()}&quot;</CardTitle>
        {formDescription ? <CardDescription>{formDescription}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form>{formRowsJSX}</form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button onClick={form.handleSubmit(handleSubmit)}>Рассчитать</Button>
      </CardFooter>
    </Card>
  );
};

export default MainForm;

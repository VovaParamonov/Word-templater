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
import { useForm } from 'react-hook-form';
import { CardFooter } from '@renderer/components/ui/card';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
// import { ScrollArea } from '@renderer/components/ui/scroll-area';

interface IMainFormProps {
  formModel: FormModel;
  onSubmit: (form: Record<string, any>) => void;
}

// TODO: Implement caching of form state
const MainForm: FC<IMainFormProps> = (props) => {
  const { formModel, onSubmit } = props;

  const formSchema = useMemo(
    () =>
      yup.object(
        formModel
          .getRows()
          .filter((row) => row.getType() !== 'calc')
          .reduce(
            (accum, item) => ({
              ...accum,
              [item.getId()]: yup
                .number()
                .transform((value) => (value ? parseInt(value, 10) : undefined))
                .required('Введите число')
            }),
            {}
          )
      ),
    [formModel]
  );

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: formModel.getRows({ type: 'input' }).reduce(
      (accum, row) => ({
        ...accum,
        [row.getId()]: ''
      }),
      {}
    )
  });

  const formRowsJSX = useMemo(() => {
    const rows = formModel.getRows({ type: 'input' });

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
          {/*<ScrollArea>*/}
          <form>{formRowsJSX}</form>
          {/*</ScrollArea>*/}
        </Form>
      </CardContent>
      <CardFooter>
        <Button
          disabled={!!Object.keys(form.formState.errors).length}
          onClick={form.handleSubmit(handleSubmit)}
        >
          Рассчитать
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MainForm;

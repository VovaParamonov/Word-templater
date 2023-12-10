import { FC, useCallback, useState } from 'react';
import { FormModel } from '@renderer/model/form/FormModel';
import { FormRowModel, FormRowModelTypeType } from '@renderer/model/form/FormRow';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@renderer/components/ui/card';
import { Button } from '@renderer/components/ui/button';
import FormRowEditor from '@renderer/components/FormEditor/FormRowEditor';
import InputDebounced from '@renderer/components/formUI/InputDebounced';
import { FormInputRowModel } from '@renderer/model/form/FormRow';

interface IFormEditorProps {
  initialForm: FormModel;
  onSave: (form: FormModel) => void;
  onDelete: (formId: string) => void;
}

const FormEditor: FC<IFormEditorProps> = (props) => {
  const { initialForm, onSave, onDelete } = props;

  const [editingFormModel, setEditingFormModel] = useState(initialForm);

  const rows = editingFormModel.getRows();

  const name = editingFormModel.getPublicName();
  const onNameChanged = useCallback((newVal: string) => {
    setEditingFormModel(editingFormModel.update({ publicName: newVal }));
  }, []);

  const desc = editingFormModel.getDescription();
  const onDescChanged = useCallback((newVal: string) => {
    setEditingFormModel(editingFormModel.update({ description: newVal }));
  }, []);

  const onRowChanged = useCallback(
    (newRow: FormRowModel<FormRowModelTypeType>) => {
      const newRowsDesc = rows.map((row) => {
        if (row.getId() === newRow.getId()) {
          return newRow.toDescriptor();
        }

        return row.toDescriptor();
      });

      setEditingFormModel(editingFormModel.update({ rows: newRowsDesc }));
    },
    [rows]
  );

  const handleSave = useCallback(() => {
    onSave(editingFormModel);
  }, [editingFormModel]);

  const handleDelete = useCallback(() => {
    onDelete(initialForm.getId());
  }, [initialForm]);

  const onAddFormRow = useCallback(() => {
    setEditingFormModel(
      editingFormModel.update({
        rows: [
          ...editingFormModel.getRows().map((row) => row.toDescriptor()),
          new FormInputRowModel().toDescriptor()
        ]
      })
    );
  }, [editingFormModel]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className={'mb-3'}>Редактор формы</CardTitle>
        <CardDescription className={'flex gap-2'}>
          <InputDebounced value={name} onChangeComplete={onNameChanged} placeHolder={'Название'} />
          <InputDebounced value={desc} onChangeComplete={onDescChanged} placeHolder={'Описание'} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <h1 className="mb-2">Поля формы:</h1>
        <form>
          {rows.map((rowModel) => (
            <FormRowEditor
              initFormRow={rowModel}
              key={rowModel.getId()}
              onCompleteUpdate={onRowChanged}
            />
          ))}
          <Button className={'w-full mt-5'} variant={'outline'} onClick={onAddFormRow}>
            +
          </Button>
        </form>
      </CardContent>
      <CardFooter className={'gap-3'}>
        <Button
          onClick={handleSave}
        >
          Сохранить
        </Button>
        <Button
          onClick={handleDelete}
          variant={'outline'}
        >
          Удалить форму
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FormEditor;

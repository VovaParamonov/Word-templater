import { FC, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import WithPageLayout from '@renderer/components/WithPageLayout';
import { useStoredForms } from '@renderer/components/MainForm/useStoredForms';
import FormEditor from '@renderer/components/FormEditor/FormEditor';
import { Button } from '@renderer/components/ui/button';
import { FormModel } from 'src/renderer/src/model/form/FormModel';

const FormEditorPage: FC = () => {
  const { forms, deleteForm, updateForm } = useStoredForms();
  const { formId } = useParams();
  const navigator = useNavigate();

  const selectedForm = useMemo(() => {
    const foundForm = forms.find((form) => form.getId() === formId);
    if (!foundForm) {
      // TODO: Разобраться с обработкой ошибок
      // throw new Error('Не найдена форма с таким id: ' + formId);
    }

    return foundForm;
  }, [forms, formId]);

  const handleBackBtn = useCallback(() => {
    navigator('/form-to-word');
  }, []);

  const handleDeleteForm = useCallback(
    (formId: string) => {
      deleteForm(formId);
      handleBackBtn();
    },
    [selectedForm]
  );

  const handleSaveForm = useCallback(
    (form: FormModel) => {
      updateForm(form);
      handleBackBtn();
    },
    [updateForm]
  );

  return (
    <div>
      <div className={'flex gap-3 mb-4'}>
        <Button onClick={handleBackBtn} variant={'outline'} className={'text-center'}>
          Назад
        </Button>
      </div>
      <div>
        {selectedForm ? (
          <FormEditor
            initialForm={selectedForm}
            onDelete={handleDeleteForm}
            onSave={handleSaveForm}
          />
        ) : (
          <h1>Загрузка формы</h1>
        )}
      </div>
    </div>
  );
};

export default WithPageLayout(FormEditorPage);

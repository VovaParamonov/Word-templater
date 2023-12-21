import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { FormModel } from '@renderer/model/form/FormModel';
import WithPageLayout from '@renderer/components/WithPageLayout';
import MainForm from '@renderer/components/MainForm/MainForm';
import { ComboBox } from '@renderer/components/FormSelector/ComboBox';
import { ComboBoxItem } from '@renderer/components/FormSelector/ComboBox';
import { useStoredForms } from '@renderer/components/MainForm/useStoredForms';
import { Button } from '@renderer/components/ui/button';
import { useNavigate } from 'react-router-dom';

const form = new FormModel({
  id: 'default',
  publicName: 'Основная',
  description: 'Это основная форма',
  rows: [
    {
      id: 'ру тег с пробелами',
      publicName: 'Рассчитываемое поле',
      type: 'calc',
      // TODO: Solve typing
      //@ts-ignore
      calcPattern: '$ру_тег_без_пробелов$ + $en_tag_without_spaces$'
    },
    {
      id: 'ру_тег_без_пробелов',
      publicName: 'Первое поле',
      type: 'input'
    },
    { id: 'en_tag_without_spaces', publicName: 'Второе поле', type: 'input' }
  ]
});

const FormToWordPage: FC = () => {
  const wordInputRef = useRef<HTMLInputElement>(null);

  const navigator = useNavigate();
  const [selectedFormId, setSelectedFormId] = useState('');
  const { forms, addForm } = useStoredForms();

  const handleFormSubmit = useCallback(async (data: Record<string, number>) => {
    const file = (wordInputRef.current?.files ?? [])[0];
    console.log(data);
    console.log('file: ', file);

    if (!file) {
      return;
    }

    const genResult = await window.api.genReport({
      filePath: file.path,
      data: data
    });

    console.log('gen result: ', genResult);

    console.log(await window.api.ping());
  }, []);

  const getFormItems = (forms: FormModel[]): ComboBoxItem[] => {
    return forms.map((form) => ({ value: form.getId(), label: form.getPublicName() }));
  };

  useEffect(() => {
    console.log('form: ', JSON.stringify(FormModel.serialize(form)));
  }, []);

  const openEditorForNewForm = (): void => {
    const newForm = new FormModel();

    addForm(newForm);

    navigator(`/form-editor/${newForm.getId()}`);
  };

  return (
    <div>
      <div className={'flex gap-3 mb-4'}>
        <Button
          onClick={openEditorForNewForm}
          variant={'outline'}
          className={'w-10 text-center text-xl cursor-pointer'}
        >
          +
        </Button>
        <ComboBox
          options={getFormItems(forms)}
          onSelect={setSelectedFormId}
          selectedId={selectedFormId}
        />
      </div>
      {selectedFormId ? (
        <MainForm
          formModel={forms.find((form) => form.getId() === selectedFormId)!}
          onSubmit={handleFormSubmit}
        />
      ) : null}
    </div>
  );
};

export default WithPageLayout(FormToWordPage);

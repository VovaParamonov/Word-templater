import { useCallback, useContext, useEffect, useState } from 'react';
import { FormModel } from '@renderer/model/form/FormModel';
import { StorageContext } from '@renderer/components/StorageContext';

export interface IUseStoredFormsReturnType {
  forms: FormModel[];
  addForm: (form: FormModel) => void;
  updateForm: (form: FormModel) => void;
  deleteForm: (formId: string) => void;
}

export function useStoredForms(): IUseStoredFormsReturnType {
  const [forms, setForms] = useState<FormModel[]>([]);
  const storeContext = useContext(StorageContext);

  useEffect(() => {
    storeContext.getData('forms').then((storedFormsData) => {
      if (!storedFormsData) {
        return;
      }

      try {
        setForms(storedFormsData.map((formDesc) => FormModel.deserialize(formDesc)));
      } catch (e) {
        // throw new Error('Ошибка запроса данных о формах: ' + JSON.stringify(e));
      }
    });
  }, [storeContext]);

  const addForm = useCallback(
    (newForm: FormModel): void => {
      storeContext.updateData('forms', [
        ...forms.map((form) => FormModel.serialize(form)),
        FormModel.serialize(newForm)
      ]);
    },
    [forms, storeContext.updateData]
  );

  const deleteForm = useCallback(
    (formId: string): void => {
      storeContext.updateData('forms', [
        ...forms.filter((form) => form.getId() !== formId).map((form) => FormModel.serialize(form))
      ]);
    },
    [forms, storeContext.updateData]
  );

  const updateForm = useCallback(
    (newForm: FormModel) => {
      storeContext.updateData('forms', [
        ...forms.map((form) => {
          if (form.getId() !== newForm.getId()) {
            return FormModel.serialize(form);
          }

          return FormModel.serialize(form.update(newForm.toDescriptor()));
        })
      ]);
    },
    [storeContext, forms]
  );

  return {
    forms,
    addForm,
    deleteForm,
    updateForm
  };
}

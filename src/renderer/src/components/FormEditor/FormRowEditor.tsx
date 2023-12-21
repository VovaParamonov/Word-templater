import { ChangeEvent, FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FormRowModel, FormRowModelTypeType } from '@renderer/model/form/FormRow';
import { Input } from '@renderer/components/ui/input';
import RowTypeSelector from './RowTypeSelector';
import CalcRowUI from '@renderer/components/FormEditor/RowTypesUI/CalcRowUI';
import { FormCalculatedRowModel, IFormRowModelDescriptor } from '@renderer/model/form/FormRow';

interface IFormRowEditorProps {
  initFormRow: FormRowModel<FormRowModelTypeType>;
  onCompleteUpdate: (formRow: FormRowModel<FormRowModelTypeType>) => void;
}

const FormRowEditor: FC<IFormRowEditorProps> = (props) => {
  const { initFormRow, onCompleteUpdate } = props;
  const [formRow, setFormRow] = useState(initFormRow);
  const prevRowStateRef = useRef(initFormRow);

  const selectedType = formRow.getType();
  const rowName = formRow.getPublicName();
  const rowDesc = formRow.getDescription();

  useEffect(() => {
    if (prevRowStateRef.current.getType() !== formRow.getType()) {
      applyChanges();
    }

    prevRowStateRef.current = formRow;
  }, [formRow]);

  const onRowChange = useCallback(
    (update: Partial<IFormRowModelDescriptor<FormRowModelTypeType>>) => {
      setFormRow(formRow.update(update));
    },
    [formRow]
  );

  const applyChanges = useCallback(() => {
    onCompleteUpdate(formRow);
  }, [formRow, onCompleteUpdate]);

  const handleDescChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onRowChange({ description: e.target.value });
    },
    [onRowChange]
  );

  const handleTypeChange = useCallback(
    (type: FormRowModelTypeType) => {
      onRowChange({ type });
    },
    [onRowChange]
  );

  const handleNameChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onRowChange({ publicName: e.target.value });
    },
    [onRowChange]
  );

  const uniqUI = useMemo(() => {
    switch (formRow.getType()) {
      case 'calc':
        return (
          <CalcRowUI
            rowModel={formRow as FormCalculatedRowModel}
            onRowChange={onRowChange}
            onChangeComplete={applyChanges}
          />
        );
    }

    return null;
  }, [formRow, onRowChange]);

  return (
    <div className={'my-7'}>
      <div>
        <RowTypeSelector
          selectedType={selectedType}
          onTypeChange={handleTypeChange}
          className={'mb-2'}
        />
        <div className={'gap-2 flex flex-col'} >
          <Input value={rowName} onChange={handleNameChange} onBlur={applyChanges} placeholder={'Название поля'} />
          <Input value={rowDesc} onChange={handleDescChange} onBlur={applyChanges} placeholder={'Описание поля'}/>
        </div>
        <div className={'mt-2'}>{uniqUI}</div>
      </div>
    </div>
  );
};

export default FormRowEditor;

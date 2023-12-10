import { ChangeEvent, FC, useCallback } from 'react';
import { FormCalculatedRowModel } from '@renderer/model/form/FormRow';
import { Input } from '@renderer/components/ui/Input';
import { IFormCalculatedRowDescription } from 'src/renderer/src/model/form/FormRow';

interface ICalcRowUIProps {
  rowModel: FormCalculatedRowModel;
  onRowChange: (update: Partial<IFormCalculatedRowDescription>) => void;
  onChangeComplete: () => void;
}

const CalcRowUI: FC<ICalcRowUIProps> = (props) => {
  const { rowModel, onRowChange, onChangeComplete } = props;

  const rowPattern = rowModel.getCalcPattern();

  const handleChangePattern = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    onRowChange({ calcPattern: e.target.value });
  }, []);

  return (
    <div>
      <Input
        placeholder={'Формула рассчета'}
        value={rowPattern}
        onBlur={onChangeComplete}
        onChange={handleChangePattern}
      />
    </div>
  );
};

export default CalcRowUI;

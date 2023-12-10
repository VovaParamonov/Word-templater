import { FC, useCallback } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { FormRowModelTypeType } from '@renderer/model/form/FormRow';

const rowTypes: Record<FormRowModelTypeType, { label: string }> = {
  input: { label: 'Ввод' },
  calc: { label: 'Рассчет' }
};

interface IRowTypeSelectorProps {
  selectedType: FormRowModelTypeType;
  onTypeChange: (type: FormRowModelTypeType) => void;
  className?: string;
}

const RowTypeSelector: FC<IRowTypeSelectorProps> = (props) => {
  const { selectedType, onTypeChange, className } = props;

  const handleChange = useCallback(
    (newVal: string) => {
      onTypeChange(newVal as FormRowModelTypeType);
    },
    [onTypeChange]
  );

  return (
    <ToggleGroup type="single" value={selectedType} onValueChange={handleChange} className={className}>
      {Object.keys(rowTypes).map((typeKey) => (
        <ToggleGroupItem key={typeKey} value={typeKey} className={'w-full'}>
          {rowTypes[typeKey].label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};

export default RowTypeSelector;

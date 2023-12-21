import { ChangeEvent, FC, useCallback, useEffect, useState } from 'react';
import { Input } from '@renderer/components/ui/input';
interface IInputDebouncedProps {
  onChangeComplete: (val: string) => void;
  value: string;
  className?: string;
  placeHolder?: string;
}

const InputDebounced: FC<IInputDebouncedProps> = (props) => {
  const { value, onChangeComplete, className, placeHolder } = props;
  const [localValue, setLocalValue] = useState(value);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  }, []);

  const handleBlur = useCallback(() => {
    onChangeComplete(localValue);
  }, [localValue]);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <Input
      className={className}
      value={localValue}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeHolder}
    />
  );
};

export default InputDebounced;

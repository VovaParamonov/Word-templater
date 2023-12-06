import { forwardRef, useCallback, useRef, useState } from 'react';
import { Input } from '@renderer/components/ui/input';
import { mergeRefs } from 'react-merge-refs';

interface IFileLoaderProps {
  onChange?: () => void;
  icon?: string;
}

const FileLoader = forwardRef<HTMLInputElement, IFileLoaderProps>((props, ref) => {
  const [loaded, setLoaded] = useState(false);
  const localRef = useRef<HTMLInputElement>();
  const { onChange: parentOnChange, icon } = props;

  const onChange = (e: any): void => {
    if (parentOnChange) {
      parentOnChange();
    }

    setLoaded(!!e.target.files.length);
  };

  const imgOnClick = useCallback(() => {
    localRef.current?.click();
  }, []);

  return (
    <div className={'flex flex-col w-4/12'}>
      {icon ? (
        <img
          onClick={imgOnClick}
          src={icon}
          alt=""
          className={`cursor-pointer mb-5 h-96 object-contain ${!loaded ? 'opacity-20' : ''}`}
        />
      ) : null}
      <Input
        type={'file'}
        className={'cursor-pointer mb-2 w-full'}
        onChange={onChange}
        ref={mergeRefs([ref, localRef])}
      />
    </div>
  );
});

FileLoader.displayName = 'FileLoader';
export default FileLoader;

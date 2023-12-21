import { FC, useRef, useState } from 'react';
import excelIcon from '@renderer/assets/excel_icon.svg';
import wordIcon from '@renderer/assets/word_icon.svg';
import FileLoader from '@renderer/components/FileLoader/FileLoader';
import { Button } from '@renderer/components/ui/button';
import WithPageLayout from '@renderer/components/WithPageLayout';
import InfoBtn from '@renderer/components/InfoBtn';
import { useToasts } from '@renderer/components/useToasts';
import { ToastAction } from '@renderer/components/ui/toast';

const ExcelToWordPage: FC = () => {
  const { toast } = useToasts();
  const excelInputRef = useRef<HTMLInputElement>(null);
  const wordInputRef = useRef<HTMLInputElement>(null);
  const [allLoaded, setAllLoaded] = useState(false);

  const openPath = (path: string): void => {
    window.api.openFolder(path);
  };

  const getLoadedFilesPath = () => {
    const excelFile = (excelInputRef.current?.files ?? [])[0];
    const wordFile = (wordInputRef.current?.files ?? [])[0];

    return {
      excelPath: excelFile?.path,
      wordPath: wordFile?.path
    };
  };
  const onExcelFileChange = async (): Promise<void> => {
    const { excelPath, wordPath } = getLoadedFilesPath();

    setAllLoaded(!!(wordPath && excelPath));
  };

  const onWordFileChange = async (): Promise<void> => {
    const { excelPath, wordPath } = getLoadedFilesPath();

    setAllLoaded(!!(wordPath && excelPath));
  };

  const fillReport = async (): Promise<void> => {
    const excelFile = (excelInputRef.current?.files ?? [])[0];
    const wordFile = (wordInputRef.current?.files ?? [])[0];

    if (!excelFile || !wordFile) {
      console.error('Необходимо загрузить оба файла');
    }

    try {
      const filePath = await window.api.fillReportFromExcel({
        excelPath: excelFile.path,
        repTemplatePath: wordFile.path
      });

      if (!filePath) {
        toast({
          variant: 'destructive',
          title: 'Ошибка',
          description: 'Необработанная ошибка'
        });

        return;
      }

      if (typeof filePath !== 'string') {
        toast({
          variant: 'destructive',
          title: 'Ошибка',
          description: 'Лог ошибки сохранен в файл: ' + filePath.logPath,
          action: (
            <ToastAction altText="Open" onClick={() => openPath(filePath.logPath)}>
              Открыть
            </ToastAction>
          )
        });

        return;
      }

      const filePathFolder = filePath.split('/').slice(0, -1).join('/');

      toast({
        title: 'Успешно',
        description: `Отчет сохранен по пути [${filePathFolder}]`,
        action: (
          <ToastAction altText="Open" onClick={() => openPath(filePathFolder)}>
            Открыть
          </ToastAction>
        )
      });
    } catch (e: any) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Необработанная ошибка'
      });
    }
  };

  return (
    <div>
      <InfoBtn />
      <div className="flex w-full justify-around">
        <FileLoader icon={excelIcon} ref={excelInputRef} onChange={onExcelFileChange} />
        <FileLoader icon={wordIcon} ref={wordInputRef} onChange={onWordFileChange} />
      </div>
      <Button className={'w-full mt-5'} disabled={!allLoaded} onClick={fillReport}>
        Заполнить отчет
      </Button>
    </div>
  );
};

export default WithPageLayout(ExcelToWordPage);

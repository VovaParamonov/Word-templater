import { FC, useCallback, useRef } from 'react';
import { Button } from '@renderer/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@renderer/components/ui/hover-card';
import { Popover, PopoverContent, PopoverTrigger } from '@renderer/components/ui/popover';
import exampleImgPath from '@renderer/assets/example.png';

const InfoBtn: FC = () => {
  const popupTriggerRef = useRef<HTMLButtonElement>(null);

  const handleOpen = useCallback(() => {
    popupTriggerRef.current?.click();
  }, []);

  return (
    <div className="w-full flex justify-center">
      <HoverCard>
        <HoverCardTrigger>
          <Button onClick={handleOpen} className="text-2xl rounded-3xl">
            ?
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className={'text-center py-1 px-0 w-52'}>
          Как это работает?
        </HoverCardContent>
      </HoverCard>
      <div className={'absolute translate-y-8'}>
        <Popover>
          <PopoverTrigger ref={popupTriggerRef} />
          <PopoverContent style={{ width: '90vw' }}>
            <div>
              Необходимо создать файл шаблона отчета в формтае `.docx`. В тех местах отчета в
              которых вы бы хотели вставить значения из excel таблицы оставьте тэг в формате{' '}
              {`\`{{ 'Название страницы'!A1 }}\``}, где A1 -- это буква колонки и номер строки
            </div>
            <img className={'object-contain'} src={exampleImgPath} alt="" />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default InfoBtn;

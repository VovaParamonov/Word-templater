import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import WithPageLayout from '@renderer/components/WithPageLayout';
import { Button } from '@renderer/components/ui/button';

const Menu: FC = () => {
  const navigate = useNavigate();

  const makeLinkHandler = (path: string) => () => {
    navigate(path);
  };

  const goToFormPage = useMemo(() => makeLinkHandler('/form-to-word'), [navigate]);
  const goToExcelPage = useMemo(() => makeLinkHandler('/excel-to-word'), [navigate]);

  return (
    <div className={'flex flex-col w-full align-middle gap-3'}>
      <Button onClick={goToFormPage}>Заполнение с формы</Button>
      <Button onClick={goToExcelPage}>Заполнение с excel таблицы</Button>
    </div>
  );
};

export default WithPageLayout(Menu);

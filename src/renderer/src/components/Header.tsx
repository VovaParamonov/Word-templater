import { FC, useCallback } from 'react';
import { ThemeModeToggle } from '@renderer/components/ThemeModeToggle';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@renderer/components/ui/button';
import { Separator } from "@renderer/components/ui/separator"


const Header: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleMenuBtn = useCallback(() => {
    navigate('/');
  }, []);

  return (
    <>
      <div className={'flex w-full justify-between py-3'}>
        <ThemeModeToggle />
        {location.pathname !== '/' ? <Button onClick={handleMenuBtn}>Меню</Button> : null}
      </div>
      <Separator className={'mb-4'} />
    </>
  );
};

export default Header;

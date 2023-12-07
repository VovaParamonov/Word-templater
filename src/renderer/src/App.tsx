import FormToWord from '@renderer/components/pages/FormToWord';
import ExcelToWord from '@renderer/components/pages/ExcelToWord';
import Menu from '@renderer/components/pages/Menu';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from '@renderer/components/ui/toaster';

const router = createHashRouter([
  {
    path: '/',
    element: <Menu />
  },
  {
    path: '/form-to-word',
    element: <FormToWord />
  },
  {
    path: '/excel-to-word',
    element: <ExcelToWord />
  }
]);

function App(): JSX.Element {
  return (
    <div className="container">
      <RouterProvider router={router} />
      <Toaster />
    </div>
  );
}

export default App;

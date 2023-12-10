import FormToWord from '@renderer/components/pages/FormToWordPage';
import ExcelToWord from '@renderer/components/pages/ExcelToWordPage';
import Menu from '@renderer/components/pages/MenuPage';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from '@renderer/components/ui/toaster';
import FormEditorPage from '@renderer/components/pages/FormEditorPage';
import StorageContextProvider from '@renderer/components/StorageContext';

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
    path: '/form-editor/:formId',
    element: <FormEditorPage />
  },
  {
    path: '/excel-to-word',
    element: <ExcelToWord />
  }
]);

function App(): JSX.Element {
  return (
    <StorageContextProvider>
      <div className="container">
        <RouterProvider router={router} />
        <Toaster />
      </div>
    </StorageContextProvider>
  );
}

export default App;

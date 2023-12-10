import { createContext, FC, ReactNode, useState } from 'react';
import { StoredData } from '@renderer/model/form/LocalStore';
import LocalStore from '@renderer/model/form/LocalStore';

interface IStorageContext {
  data: StoredData;
  updateData: <K extends keyof StoredData>(key: K, data: StoredData[K]) => void;
  getData: <K extends keyof StoredData>(key: K) => Promise<StoredData[K]>;
}

export const StorageContext = createContext<IStorageContext>(null!);

const StorageContextProvider: FC<{ children: ReactNode }> = (props) => {
  const { children } = props;
  const [storedData, setStoredData] = useState<StoredData>({});

  function updateData<K extends keyof StoredData>(key: K, data: StoredData[K]): void {
    setStoredData({
      ...storedData,
      [key]: data
    });

    LocalStore.updateRecord({ id: key, data: JSON.stringify(data) });
  }

  async function getData<K extends keyof StoredData>(key: K): Promise<StoredData[K]> {
    const data = storedData[key];

    if (data) {
      return data;
    }

    const dataFromExternalStorage = LocalStore.getData(key);

    if (dataFromExternalStorage) {
      updateData(key, JSON.parse(dataFromExternalStorage.data));
      return data;
    }

    return undefined;
  }

  return storedData ? (
    <StorageContext.Provider
      value={{
        data: storedData,
        updateData,
        getData
      }}
    >
      {children}
    </StorageContext.Provider>
  ) : (
    'Loading data...'
  );
};

export default StorageContextProvider;

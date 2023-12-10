import { IFormModelDescriptor } from '@renderer/model/form/FormModel';

type StoreRecord = {
  id: string;
  data: string;
};

export default class LocalStore {
  static getData(id: string): StoreRecord | null {
    const dataFromLocalStorage = localStorage.getItem(id);

    if (dataFromLocalStorage) {
      return {
        id,
        data: dataFromLocalStorage
      };
    }

    return null;
  }

  static updateRecord(rec: StoreRecord): void {
    return localStorage.setItem(rec.id, rec.data);
  }
}

export type StoredData = {
  forms?: IFormModelDescriptor[];
};

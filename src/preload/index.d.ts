import { ElectronAPI } from '@electron-toolkit/preload'
import { IFillRepFromExcelOptions, IGenReportOptions } from '../main/api';
import { LoggableError, LoggableErrorDescriptor } from '../main/ErrHandler';
import { ipcRenderer } from 'electron';

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      ping: () => Promise<string>;
      genReport: (options: IGenReportOptions) => Promise<boolean>;
      parseExcel: (path: string) => { name: string; data: any[][] }[];
      fillReportFromExcel: (options: IFillRepFromExcelOptions) => Promise<string | LoggableErrorDescriptor>;
      getDocText: (path: string) => Promise<string>;
      openFolder: (path: string) => void;
    }
  }
}

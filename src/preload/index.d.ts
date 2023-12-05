import { ElectronAPI } from '@electron-toolkit/preload'
import { IFillRepFromExcelOptions, IGenReportOptions } from '../main/api';
import { ipcRenderer } from 'electron';

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      ping: () => Promise<string>;
      genReport: (options: IGenReportOptions) => Promise<boolean>;
      parseExcel: (path: string) => { name: string; data: any[][] }[];
      fillReportFromExcel: (options: IFillRepFromExcelOptions) => Promise<boolean>;
      getDocText: (path: string) => Promise<string>;
    }
  }
}

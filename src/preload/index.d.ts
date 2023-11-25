import { ElectronAPI } from '@electron-toolkit/preload'
import { IGenReportOptions } from '../main/api';

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      ping: () => Promise<string>;
      genReport: (options: IGenReportOptions) => Promise<boolean>;
    }
  }
}

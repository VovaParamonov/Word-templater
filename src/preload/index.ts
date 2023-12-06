import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';
import type { IFillRepFromExcelOptions, IGenReportOptions } from '../main/api';

// Custom APIs for renderer
export const api = {
  ping: () => ipcRenderer.invoke('ping'),
  genReport: (options: IGenReportOptions) => ipcRenderer.invoke('genReport', options),
  parseExcel: (path: string) => ipcRenderer.invoke('parseExcel', path),
  fillReportFromExcel: (options: IFillRepFromExcelOptions) =>
    ipcRenderer.invoke('fillReportFromExcel', options),
  getDocText: (path: string) => ipcRenderer.invoke('getDocText', path),
  openFolder: (path: string) => ipcRenderer.invoke('openFolder', path)
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}

import { ipcMain } from 'electron';
import { editDocx } from './dcumentPatcher';

export interface IGenReportOptions {
  filePath: string;
  data: Record<string, number>;
}

async function genReport(options: IGenReportOptions): Promise<boolean> {
  console.log(options);

  try {
    await editDocx({ path: options.filePath });
  } catch (e) {
    console.error('Ошибка изменения файла: ', e);
  }

  return true;
}

export function initApi(): void {
  ipcMain.handle('ping', () => 'pong');
  ipcMain.handle('genReport', (_e, ...args) => genReport(args[0]));
}

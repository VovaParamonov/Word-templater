import { ipcMain } from 'electron';
import { editDocx, fillReportFromExcelData, getTagsFromDoc } from './dcumentPatcher';
import { excelReader } from './ExcelReader';
import child_process from 'child_process';
import { handleErr } from './ErrHandler';

export interface IGenReportOptions {
  filePath: string;
  data: Record<string, number | string>;
}

async function genReport(options: IGenReportOptions): Promise<boolean> {
  console.log(options);

  try {
    await editDocx({
      path: options.filePath,
      data: options.data
    });
  } catch (e) {
    console.error('Ошибка изменения файла: ', e);
  }

  return true;
}

export interface IFillRepFromExcelOptions {
  excelPath: string;
  repTemplatePath: string;
}
async function fillReportFromExcel(options: IFillRepFromExcelOptions): Promise<string | null> {
  const { excelPath, repTemplatePath } = options;
  const dataFromExcel = excelReader(excelPath);
  return fillReportFromExcelData({ path: repTemplatePath, data: dataFromExcel });
}

function openFolder(path: string): void {
  child_process.exec(`start "" "${path}"`);
}

export function initApi(): void {
  ipcMain.handle('ping', () => 'pong');
  ipcMain.handle('genReport', (_e, ...args) => handleErr(genReport)(args[0]));
  ipcMain.handle('parseExcel', (_e, path: string) => handleErr(excelReader)(path));
  ipcMain.handle('fillReportFromExcel', (_e, options: IFillRepFromExcelOptions) =>
    handleErr(fillReportFromExcel)(options)
  );
  ipcMain.handle('getDocText', (_e, path: string) => handleErr(getTagsFromDoc)(path));
  ipcMain.handle('openFolder', (_e, path: string) => handleErr(openFolder)(path));
}

import { ipcMain } from 'electron';
import { editDocx, fillReportFromExcelData, getTagsFromDoc } from './dcumentPatcher';
import { excelDataToJson, excelReader } from './ExcelReader';

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
async function fillReportFromExcel(options: IFillRepFromExcelOptions): Promise<boolean> {
  const { excelPath, repTemplatePath } = options;
  const dataFromExcel = excelReader(excelPath);
  return fillReportFromExcelData({ path: repTemplatePath, data: dataFromExcel });
}

export function initApi(): void {
  ipcMain.handle('ping', () => 'pong');
  ipcMain.handle('genReport', (_e, ...args) => genReport(args[0]));
  ipcMain.handle('parseExcel', (_e, path: string) => excelReader(path));
  ipcMain.handle('fillReportFromExcel', (_e, options: IFillRepFromExcelOptions) =>
    fillReportFromExcel(options)
  );
  ipcMain.handle('getDocText', (_e, path: string) => getTagsFromDoc(path));
}

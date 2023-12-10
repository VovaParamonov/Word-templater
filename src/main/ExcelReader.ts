import xlsx from 'node-xlsx';

export type ParsedExcelTag = {
  fullStr: string;
  colLetter: string;
  rowIndex: string;
  sheetName?: string;
  openDelimiter?: string;
  closeDelimiter?: string;
};

export function excelReader(filePath: string): { name: string; data: any[][] }[] {
  return xlsx.parse(filePath); // parses a file
}

function colIndexToLetter(i: number): string {
  return (i + 10).toString(36).toUpperCase();
}

function alphabetPosition(text): number {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const code = text.toUpperCase().charCodeAt(i);
    if (code > 64 && code < 91) result += code - 64 + ' ';
  }

  return parseInt(result.slice(0, result.length - 1), 10) - 1;
}

// TODO: Добавить возможность выделения строки и колонки без упомянания названия таблицы
// TODO: Добавить обработку колонок описываемыз двумя буквами
export function matchExcelTag(str: string): ParsedExcelTag | null {
  const regex = /(([‘’'"“”«])(.*)([‘’'"“”»])!)?(\w)(\d+)/gm;

  const execResult = regex.exec(str);

  if (!execResult) {
    return null;
  }

  const [
    fullStr,
    _fullSheetDefPart,
    openDelimiter,
    sheetName,
    closeDelimiter,
    colLetter,
    rowIndex
  ] = execResult;

  return {
    fullStr,
    colLetter,
    rowIndex,
    sheetName,
    openDelimiter,
    closeDelimiter
  };
}

/**
 *
 * @param tag -- /(([‘’'"“”«])(.*)([‘’'"“”»])!)?(\w)(\d+)/gm format str
 * @param data
 */
export function findCellByTag(
  tag: string,
  data: { name: string; data: any[][] }[]
): number | string | null {
  const parsedTag = matchExcelTag(tag);

  if (!parsedTag) {
    return null;
  }

  const { sheetName, colLetter, rowIndex } = parsedTag;

  const sheet = data.find((sheet) => sheet.name === sheetName);

  if (!sheet) {
    throw new Error(`Не найдена таблица с именем: '${sheetName}'`);
  }

  return sheet[alphabetPosition(colLetter)][parseInt(rowIndex, 10)];
}

export function extractSelectedTagsFromExcelData(
  data: { name: string; data: any[][] }[],
  tags: ParsedExcelTag[]
): Record<string, number | string> {
  return tags.reduce((accum, parsedTag) => {
    const sheetPart = parsedTag.sheetName
      ? `${parsedTag.openDelimiter}${parsedTag.sheetName}${parsedTag.closeDelimiter}!`
      : '';

    const patchKey = `${sheetPart}${parsedTag.colLetter}${parsedTag.rowIndex}`;

    const sheet = parsedTag.sheetName
      ? data.find((sSheet) => sSheet.name === parsedTag.sheetName)
      : data[0];

    const patchVal =
      sheet!.data[parseInt(parsedTag.rowIndex) - 1][alphabetPosition(parsedTag.colLetter)];

    return {
      ...accum,
      [patchKey]: patchVal
    };
  }, {});
}

export function excelDataToJson(data: { name: string; data: any[][] }[]): Record<string, number> {
  return data.reduce((resAccum, sheet) => {
    return {
      ...resAccum,
      ...sheet.data.reduce(
        (sheetAccum, sheetRow, rowIndex) => ({
          ...sheetAccum,
          ...sheetRow.reduce(
            (rowAccum, rowCell, columnIndex) => ({
              ...rowAccum,
              [`“${sheet.name}”!${colIndexToLetter(columnIndex)}${rowIndex}`]: rowCell
            }),
            {}
          )
        }),
        {}
      )
    };
  }, {});
}

import * as fs from 'fs';
import { Paragraph, patchDocument, PatchType } from 'docx';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { extractSelectedTagsFromExcelData, matchExcelTag, ParsedExcelTag } from './ExcelReader';

interface IEditDocxOptions {
  path: string;
  data: Record<string, string | number>;
}
export async function editDocx(options: IEditDocxOptions): Promise<boolean> {
  try {
    const doc = await patchDocument(fs.readFileSync(options.path), {
      patches: Object.keys(options.data).reduce(
        (accum, rowKey) => ({
          ...accum,
          [rowKey]: {
            type: PatchType.DOCUMENT,
            children: [new Paragraph({ text: options.data[rowKey].toString() })]
          }
        }),
        {}
      )
    });
    fs.writeFileSync('Result.docx', doc);
    return true;
  } catch (error) {
    console.error(`Error: ${error}`);
    return false;
  }
}

export async function getTagsFromDoc(filePath: string): Promise<string[]> {
  const content = fs.readFileSync(filePath, 'binary');
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
    delimiters: {
      start: '{{',
      end: '}}'
    }
  });

  const docText = doc.getFullText();

  const tags: string[] = [];

  const reg = /{{(.*?)}}/gm;

  const matches = docText.matchAll(reg);

  let match = matches.next();

  while (!match.done) {
    tags.push(match.value[1]);
    match = matches.next();
  }

  return tags;
}

interface IFillDocxFromExcelOptions {
  path: string;
  data: { name: string; data: any[][] }[];
}

export async function fillReportFromExcelData(options: IFillDocxFromExcelOptions): Promise<boolean> {
  try {
    const tagsFromDocs = await getTagsFromDoc(options.path);

    const parsedExcelTags: ParsedExcelTag[] = [];
    // TODO: В будущем, возмжно, отдельное заполнение отдельных полей
    const nonExcelTags: string[] = [];

    tagsFromDocs.forEach((dirtyTagFromDoc) => {
      const parsedExcelTag = matchExcelTag(dirtyTagFromDoc);

      if (!parsedExcelTag) {
        nonExcelTags.push(dirtyTagFromDoc);
        return;
      }

      parsedExcelTags.push(parsedExcelTag);
    });

    const extractedPatchData = extractSelectedTagsFromExcelData(options.data, parsedExcelTags);

    return editDocx({
      path: options.path,
      data: extractedPatchData
    });
  } catch (e) {
    return false;
  }
}

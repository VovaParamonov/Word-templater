import * as fs from 'fs';
import { Paragraph, patchDocument, PatchType } from 'docx';

interface IEditDocxOptions {
  path: string;
  data: Record<string, string | number>;
}
export async function editDocx(options: IEditDocxOptions): Promise<void> {
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

      // {
      // 'ру тег с пробелами': {
      //   type: PatchType.DOCUMENT,
      //   children: [new Paragraph({ text: 'Тест1!!' })]
      // },
      // 'ру_тег_без_пробелов': {
      //   type: PatchType.DOCUMENT,
      //   children: [new Paragraph({ text: 'Тест2!!' })]
      // },
      // 'en_tag_without_spaces': {
      //   type: PatchType.DOCUMENT,
      //   children: [new Paragraph({ text: 'Тест3!!' })]
      // },
    });
    fs.writeFileSync('Result.docx', doc);
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

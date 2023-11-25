import * as fs from 'fs';
import { Paragraph, patchDocument, PatchType } from 'docx';

interface IEditDocxOptions {
  path: string;
}
export async function editDocx(options: IEditDocxOptions): Promise<void> {
  try {
    const doc = await patchDocument(fs.readFileSync(options.path), {
      patches: {
        tag_here: {
          type: PatchType.DOCUMENT,
          children: [new Paragraph({ text: 'Тест!!' })]
        }
      }
    });
    fs.writeFileSync('Result.docx', doc);
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

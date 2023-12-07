import { FC } from 'react';
// import { FormModel } from '@renderer/model/form/FormModel';
import WithPageLayout from '@renderer/components/WithPageLayout';

// const form = new FormModel({
//   id: 'default',
//   publicName: 'Основная',
//   description: 'Это основная форма',
//   rows: [
//     {
//       id: 'ру тег с пробелами',
//       publicName: 'Рассчитываемое поле',
//       type: 'calc',
//       calcPattern: '$ру_тег_без_пробелов$ + $en_tag_without_spaces$'
//     },
//     {
//       id: 'ру_тег_без_пробелов',
//       publicName: 'Первое поле',
//       type: 'input'
//     },
//     { id: 'en_tag_without_spaces', publicName: 'Второе поле', type: 'input' }
//   ]
// });

const FormToWord: FC = () => {
  // const wordInputRef = useRef<HTMLInputElement>(null);
  // const handleFormSubmit = useCallback(async (data: Record<string, number>) => {
  //   const file = (wordInputRef.current?.files ?? [])[0];
  //   console.log(data);
  //   console.log('file: ', file);
  //
  //   if (!file) {
  //     return;
  //   }
  //
  //   const genResult = await window.api.genReport({
  //     filePath: file.path,
  //     data: data
  //   });
  //
  //   console.log('gen result: ', genResult);
  //
  //   console.log(await window.api.ping());
  // }, []);

  return (
    <div>
      <h1 className="text-center">Этот раздел пока не закончен</h1>
      {/*<MainForm formModel={form} onSubmit={handleFormSubmit} />*/}
    </div>
  );
};

export default WithPageLayout(FormToWord);

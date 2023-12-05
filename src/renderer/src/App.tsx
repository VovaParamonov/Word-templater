// import icons from './assets/icons.svg';
import { FormModel } from '@renderer/model/form/FormModel';
import MainForm from '@renderer/components/MainForm/MainForm';
import { useCallback, useRef } from 'react';
import { ThemeModeToggle } from '@renderer/components/ThemeModeToggle';
import { Button } from '@renderer/components/ui/button';
import FileLoader from '@renderer/components/FileLoader/FileLoader';
import wordIcon from '@renderer/assets/word_icon.svg';
import excelIcon from '@renderer/assets/excel_icon.svg';

const form = new FormModel({
  id: 'default',
  publicName: 'Основная',
  description: 'Это основная форма',
  rows: [
    {
      id: 'ру тег с пробелами',
      publicName: 'Рассчитываемое поле',
      type: 'calc',
      calcPattern: '$ру_тег_без_пробелов$ + $en_tag_without_spaces$'
    },
    {
      id: 'ру_тег_без_пробелов',
      publicName: 'Первое поле',
      type: 'input'
    },
    { id: 'en_tag_without_spaces', publicName: 'Второе поле', type: 'input' }
  ]
});

function App(): JSX.Element {
  const excelInputRef = useRef<HTMLInputElement>(null);
  const wordInputRef = useRef<HTMLInputElement>(null);
  const handleFormSubmit = useCallback(async (data: Record<string, number>) => {
    const file = (excelInputRef.current?.files ?? [])[0];
    console.log(data);
    console.log('file: ', file);

    if (!file) {
      return;
    }

    const genResult = await window.api.genReport({
      filePath: file.path,
      data: data
    });

    console.log('gen result: ', genResult);

    console.log(await window.api.ping());
  }, []);

  const onExcelFileChange = async (): Promise<void> => {
    const file = (excelInputRef.current?.files ?? [])[0];

    if (!file?.path) {
      return;
    }

    console.log(excelInputRef);
    console.log('Path: ', file.path);

    console.log(await window.api.parseExcel(file.path));
  };

  const onWordFileChange = async (): Promise<void> => {
    const file = (wordInputRef.current?.files ?? [])[0];

    if (!file?.path) {
      return;
    }

    console.log(await window.api.getDocText(file.path));
  };

  const fillReport = async (): Promise<void> => {
    const excelFile = (excelInputRef.current?.files ?? [])[0];
    const wordFile = (wordInputRef.current?.files ?? [])[0];

    if (!excelFile || !wordFile) {
      console.error('Необходимо загрузить оба файла');
    }

    const fillResult = await window.api.fillReportFromExcel({
      excelPath: excelFile.path,
      repTemplatePath: wordFile.path
    });

    if (fillResult) {
      alert('Успешно заполнено');
      return;
    }

    alert('Ошибка заполнения');
  };

  return (
    <div className="container">
      <ThemeModeToggle className={'my-3'} />
      {/*<MainForm formModel={form} onSubmit={handleFormSubmit} />*/}

      {/*<h1>Загрузить Файлы: </h1>*/}
      <div className="flex w-full justify-around">
        <FileLoader icon={excelIcon} ref={excelInputRef} onChange={onExcelFileChange} />
        <FileLoader icon={wordIcon} ref={wordInputRef} onChange={onWordFileChange} />
      </div>
      <Button onClick={fillReport}>Заполнить отчет</Button>

      {/* EXAMPLE CODE BELLOW */}
      {/*<Versions></Versions>*/}

      {/*<svg className="hero-logo" viewBox="0 0 900 300">*/}
      {/*  <use xlinkHref={`${icons}#electron`} />*/}
      {/*</p>*/}

      {/*<div className="links">*/}
      {/*  <div className="link-item">*/}
      {/*    <a target="_blank" href="https://electron-vite.org" rel="noopener noreferrer">*/}
      {/*      Documentation*/}
      {/*    </a>*/}
      {/*  </div>*/}
      {/*  <div className="link-item link-dot">•</div>*/}
      {/*  <div className="link-item">*/}
      {/*    <a*/}
      {/*      target="_blank"*/}
      {/*      href="https://github.com/alex8088/electron-vite"*/}
      {/*      rel="noopener noreferrer"*/}
      {/*    >*/}
      {/*      Getting Help*/}
      {/*    </a>*/}
      {/*  </div>*/}
      {/*  <div className="link-item link-dot">•</div>*/}
      {/*  <div className="link-item">*/}
      {/*    <a*/}
      {/*      target="_blank"*/}
      {/*      href="https://github.com/alex8088/quick-start/tree/master/packages/create-electron"*/}
      {/*      rel="noopener noreferrer"*/}
      {/*    >*/}
      {/*      create-electron*/}
      {/*    </a>*/}
      {/*  </div>*/}
      {/*</div>*/}

      {/*<div className="features">*/}
      {/*  <div className="feature-item">*/}
      {/*    <article>*/}
      {/*      <h2 className="title">Configuring</h2>*/}
      {/*      <p className="detail">*/}
      {/*        Config with <span>electron.vite.config.ts</span> and refer to the{' '}*/}
      {/*        <a target="_blank" href="https://electron-vite.org/config" rel="noopener noreferrer">*/}
      {/*          config guide*/}
      {/*        </a>*/}
      {/*        .*/}
      {/*      </p>*/}
      {/*    </article>*/}
      {/*  </div>*/}
      {/*  <div className="feature-item">*/}
      {/*    <article>*/}
      {/*      <h2 className="title">HMR</h2>*/}
      {/*      <p className="detail">*/}
      {/*        Edit <span>src/renderer</span> files to test HMR. See{' '}*/}
      {/*        <a*/}
      {/*          target="_blank"*/}
      {/*          href="https://electron-vite.org/guide/hmr.html"*/}
      {/*          rel="noopener noreferrer"*/}
      {/*        >*/}
      {/*          docs*/}
      {/*        </a>*/}
      {/*        .*/}
      {/*      </p>*/}
      {/*    </article>*/}
      {/*  </div>*/}
      {/*  <div className="feature-item">*/}
      {/*    <article>*/}
      {/*      <h2 className="title">Hot Reloading</h2>*/}
      {/*      <p className="detail">*/}
      {/*        Run{' '}*/}
      {/*        <span>*/}
      {/*          {"'"}electron-vite dev --watch{"'"}*/}
      {/*        </span>{' '}*/}
      {/*        to enable. See{' '}*/}
      {/*        <a*/}
      {/*          target="_blank"*/}
      {/*          href="https://electron-vite.org/guide/hot-reloading.html"*/}
      {/*          rel="noopener noreferrer"*/}
      {/*        >*/}
      {/*          docs*/}
      {/*        </a>*/}
      {/*        .*/}
      {/*      </p>*/}
      {/*    </article>*/}
      {/*  </div>*/}
      {/*  <div className="feature-item">*/}
      {/*    <article>*/}
      {/*      <h2 className="title">Debugging</h2>*/}
      {/*      <p className="detail">*/}
      {/*        Check out <span>.vscode/launch.json</span>. See{' '}*/}
      {/*        <a*/}
      {/*          target="_blank"*/}
      {/*          href="https://electron-vite.org/guide/debugging.html"*/}
      {/*          rel="noopener noreferrer"*/}
      {/*        >*/}
      {/*          docs*/}
      {/*        </a>*/}
      {/*        .*/}
      {/*      </p>*/}
      {/*    </article>*/}
      {/*  </div>*/}
      {/*  <div className="feature-item">*/}
      {/*    <article>*/}
      {/*      <h2 className="title">Source Code Protection</h2>*/}
      {/*      <p className="detail">*/}
      {/*        Supported via built-in plugin <span>bytecodePlugin</span>. See{' '}*/}
      {/*        <a*/}
      {/*          target="_blank"*/}
      {/*          href="https://electron-vite.org/guide/source-code-protection.html"*/}
      {/*          rel="noopener noreferrer"*/}
      {/*        >*/}
      {/*          docs*/}
      {/*        </a>*/}
      {/*        .*/}
      {/*      </p>*/}
      {/*    </article>*/}
      {/*  </div>*/}
      {/*  <div className="feature-item">*/}
      {/*    <article>*/}
      {/*      <h2 className="title">Packaging</h2>*/}
      {/*      <p className="detail">*/}
      {/*        Use{' '}*/}
      {/*        <a target="_blank" href="https://www.electron.build" rel="noopener noreferrer">*/}
      {/*          electron-builder*/}
      {/*        </a>{' '}*/}
      {/*        and pre-configured to pack your app.*/}
      {/*      </p>*/}
      {/*    </article>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  );
}

export default App;

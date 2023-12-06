import { FC, ReactNode } from 'react';
import Header from '@renderer/components/Header';

function WithPageLayout<T extends object>(Page: FC<T>): FC<T> {
  function PageContent(props): ReactNode {
    return (
      <div>
        <Header />
        <Page {...props} />
      </div>
    );
  }

  return PageContent;
}

export default WithPageLayout;

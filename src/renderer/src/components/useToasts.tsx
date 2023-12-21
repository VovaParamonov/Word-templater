import { useToast } from '@renderer/components/ui/use-toast';
import { useCallback } from 'react';

export function useToasts(): { toast: ReturnType<typeof useToast>['toast'] } {
  const { toast: toastOrigin } = useToast();

  const toast = useCallback(
    (...options: Parameters<typeof toastOrigin>) => {
      const [config, ...otherOptions] = options;

      return toastOrigin(
        {
          ...config,
          description: (
            <div style={{ maxWidth: '12rem' }} className={'text-ellipsis overflow-hidden'}>
              {config.description}
            </div>
          )
        },
        ...otherOptions
      );
    },
    [toastOrigin]
  );

  return { toast };
}

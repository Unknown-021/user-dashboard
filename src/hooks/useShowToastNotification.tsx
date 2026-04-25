import { useEffect } from 'react';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';

import { toaster } from '../components/ui/toaster/toaster';

interface AdditionalInfo {
  errorTitle?: string;
  errorDefaultDescription?: string;
  successTitle?: string;
  successDefaultDescription?: string;
  isShowSuccess: boolean;
  isShowError: boolean;
  successCb?: () => void;
  duration?: number;
}

type RequestError = FetchBaseQueryError | SerializedError;

interface Info {
  isError: boolean;
  isSuccess?: boolean;
  error?: RequestError;
}

const getErrorDescription = (error: RequestError | undefined, defaultDescription = '') => {
  if (!error) return defaultDescription;

  if ('data' in error) {
    const data = error.data;

    if (typeof data === 'object' && data !== null) {
      const message = 'message' in data ? data.message : undefined;
      const nestedError = 'error' in data ? data.error : undefined;

      if (
        typeof nestedError === 'object' &&
        nestedError !== null &&
        'message' in nestedError &&
        typeof nestedError.message === 'string'
      ) {
        return nestedError.message;
      }

      if (typeof message === 'string') {
        return message;
      }
    }
  }

  if ('message' in error && error.message) {
    return error.message;
  }

  return defaultDescription;
};

export const useShowToastNotification = (
  info: Info,
  {
    errorTitle,
    errorDefaultDescription,
    successTitle,
    successDefaultDescription,
    isShowSuccess,
    isShowError,
    successCb,
    duration = 5000,
  }: AdditionalInfo,
) => {
  useEffect(() => {
    if (!isShowError || !info.isError) return;

    const description = getErrorDescription(info.error, errorDefaultDescription);

    queueMicrotask(() => {
      toaster.create({
        id: 'request-error',
        title: errorTitle || 'Ошибка',
        description,
        type: 'error',
        duration,
        closable: true,
      });
    });
  }, [isShowError, info.isError, info.error, errorTitle, errorDefaultDescription, duration]);

  useEffect(() => {
    if (!isShowSuccess || !info.isSuccess) return;

    queueMicrotask(() => {
      successCb?.();

      toaster.create({
        id: 'request-success',
        title: successTitle || 'Успешно',
        description: successDefaultDescription || '',
        type: 'success',
        duration,
        closable: true,
      });
    });
  }, [isShowSuccess, info.isSuccess, successTitle, successDefaultDescription, successCb, duration]);
};

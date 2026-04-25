import type { EditUserFormValues } from '..';

export const convertFormToApi = (values: EditUserFormValues): EditUserFormValues => {
  return {
    firstName: values?.firstName ?? '',
    lastName: values?.lastName ?? '',
    phone: values?.phone ?? '',
    email: values?.email ?? '',
    ein: values?.ein ?? '',
  };
};

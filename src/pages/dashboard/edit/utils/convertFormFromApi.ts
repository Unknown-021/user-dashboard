import type { EditUserFormValues } from '..';
import type { User } from '../../../../store/api/endpoints/types';

export const convertFormFromApi = (values: User): EditUserFormValues => {
  return {
    firstName: values?.firstName ?? '',
    lastName: values?.lastName ?? '',
    phone: values?.phone ?? '',
    email: values?.email ?? '',
    ein: values?.ein ?? '',
  };
};

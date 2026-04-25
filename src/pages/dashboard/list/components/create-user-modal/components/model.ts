export type EditUserFormValues = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  ein: string;
};

export const initValues = (): EditUserFormValues => {
  return {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    ein: '',
  };
};

import { Button, CloseButton, Dialog, Portal } from '@chakra-ui/react';
import { memo, useCallback, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import CreateUserForm from './components/CreateUserForm';
import { type EditUserFormValues, initValues } from '../create-user-modal/components/model';
import { useAppDispatch } from '../../../../../store/hooks';
import { useShowToastNotification } from '../../../../../hooks/useShowToastNotification';
import { useCreateUserMutation } from '../../../../../store/api/endpoints/users';
import api from '../../../../../store/api/api';
import { TAGS } from '../../../../../store/api/tags';
import { convertFormToApi } from '../../../edit/utils/convertFormToApi';

const CreateUserModal = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();

  const methods = useForm<EditUserFormValues>({
    defaultValues: initValues(),
    mode: 'onBlur',
  });

  const [createUser, { isLoading: isCreateLoading, ...createInfo }] = useCreateUserMutation();

  useShowToastNotification(createInfo, {
    isShowError: true,
    isShowSuccess: true,
    errorTitle: 'Error saving data',
    successTitle: 'Data saved successfully',
  });

  const resetForm = useCallback(() => {
    methods.reset(initValues());
  }, [methods]);

  const onSubmit = useCallback(
    async (values: EditUserFormValues) => {
      await createUser({
        body: convertFormToApi(values),
      }).unwrap();

      dispatch(api.util.invalidateTags([{ type: TAGS.USERS }]));
      resetForm();
      setOpen(false);
    },
    [createUser, dispatch, resetForm],
  );

  return (
    <Dialog.Root
      lazyMount
      open={open}
      onOpenChange={(e) => {
        setOpen(e.open);
        if (!e.open) {
          methods.reset(initValues());
        }
      }}
    >
      {' '}
      <Dialog.Trigger asChild>
        <Button variant='outline' size='sm'>
          Add new user
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />

        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Add new user modal</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <FormProvider {...methods}>
                <form id='create-user-form' onSubmit={methods.handleSubmit(onSubmit)}>
                  <CreateUserForm methods={methods} />
                </form>
              </FormProvider>
            </Dialog.Body>

            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant='outline'>Cancel</Button>
              </Dialog.ActionTrigger>

              <Button type='submit' form='create-user-form' loading={isCreateLoading}>
                Save
              </Button>
            </Dialog.Footer>

            <Dialog.CloseTrigger asChild>
              <CloseButton size='sm' />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default memo(CreateUserModal);

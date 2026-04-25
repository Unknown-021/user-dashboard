import { memo, useCallback, useEffect } from 'react';
import { Box, Button, Flex, Heading, Spinner } from '@chakra-ui/react';
import { FormProvider, useForm } from 'react-hook-form';
import { Navigate, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { cloneDeep } from 'lodash';
import { skipToken } from '@reduxjs/toolkit/query';

import { convertFormFromApi } from './utils/convertFormFromApi';
import { convertFormToApi } from './utils/convertFormToApi';
import api from '../../../store/api/api';
import { TAGS } from '../../../store/api/tags';
import { useAppDispatch } from '../../../store/hooks';
import { useShowToastNotification } from '../../../hooks/useShowToastNotification';
import { requiredRuleValidation } from '../../../constants/validation';
import { ROUTES } from '../../../router/paths';
import { useGetUserByIdQuery, useModifyUserMutation } from '../../../store/api/endpoints/users';
import loadingBreadcrumb from '../../../constants/loadingBreadcrumb';
import { BreadcrumbsVariableSync } from '../../../components/ui/breadcrumbs';
import InputField from '../../../components/ui/input-field';
import { numberMask } from '../../../constants/masks';

type AppOutletContext = {
  setBreadcrumbVariable: (payload: { name: string; value: string }) => void;
};

export type EditUserFormValues = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  ein: string;
};

const initValues = (): EditUserFormValues => {
  return {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    ein: '',
  };
};

const EditPage = () => {
  const { setBreadcrumbVariable } = useOutletContext<AppOutletContext>();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const params = useParams();
  const userId = params?.id ? Number(params.id) : undefined;

  const {
    isSuccess: isSuccessLoadUserInfo,
    data,
    ...getInfo
  } = useGetUserByIdQuery(userId ?? skipToken, { skip: !params?.id });

  const methods = useForm<EditUserFormValues>({
    values:
      params.id && isSuccessLoadUserInfo ? cloneDeep(convertFormFromApi(data || {})) : initValues(),
    resetOptions: {
      keepDirtyValues: true,
    },
    mode: 'onBlur',
  });

  const [modifyUser, { isLoading: isModifyLoading, ...modifyInfo }] = useModifyUserMutation();

  useShowToastNotification(getInfo, {
    isShowError: true,
    isShowSuccess: false,
    errorTitle: 'Error receiving data',
    errorDefaultDescription: 'Error retrieving user data',
  });

  useShowToastNotification(modifyInfo, {
    isShowError: true,
    isShowSuccess: true,
    errorTitle: 'Error saving data',
    successTitle: 'Data saved successfully',
  });

  useEffect(() => {
    if (modifyInfo.isSuccess) {
      dispatch(api.util.invalidateTags([{ type: TAGS.USERS }]));
      navigate(ROUTES.users);
    }
  }, [modifyInfo.isSuccess, dispatch, navigate]);

  const onSubmit = useCallback(
    async (values: EditUserFormValues) => {
      if (userId) {
        await modifyUser({
          id: userId,
          body: convertFormToApi(values),
        });
      }
    },
    [userId, modifyUser],
  );

  const onClickCancel = () => {
    if (!params.id) {
      return;
    }

    navigate(ROUTES.userDetails.replace(':id', params.id));
  };

  if (getInfo.isLoading) {
    return <Spinner />;
  }

  if (getInfo.isError) {
    return <Navigate to={ROUTES.users} />;
  }

  return (
    <>
      <BreadcrumbsVariableSync
        isReady={isSuccessLoadUserInfo}
        value={data ? `${data.firstName} ${data.lastName}` : null}
        name='userItem'
        onSetVariable={setBreadcrumbVariable}
        loadingValue={loadingBreadcrumb}
      />

      <FormProvider {...methods}>
        <form style={{ width: '100%', height: '100%' }} onSubmit={methods.handleSubmit(onSubmit)}>
          <Flex flexDirection='column' maxW='xl' height='100%'>
            <Flex alignItems='center' height={'40px'} justifyContent={'space-between'}>
              <Box>
                <Heading>{`${data?.firstName ?? ''} ${data?.lastName ?? ''}`}</Heading>
              </Box>

              <Flex gap={4}>
                <Button
                  background='mainAccent'
                  textStyle='lineMedium'
                  color='black'
                  loading={isModifyLoading}
                  loadingText='Cancel'
                  spinnerPlacement='start'
                  height={8}
                  variant='outline'
                  onClick={onClickCancel}
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  background='mainAccent'
                  textStyle='lineMedium'
                  color='white'
                  loading={isModifyLoading}
                  loadingText='Save'
                  spinnerPlacement='start'
                  height={8}
                >
                  Save
                </Button>
              </Flex>
            </Flex>

            <Box mt='6' flex='1'>
              <Flex gap='4' flexDirection='column' maxW='xl'>
                <InputField
                  name='firstName'
                  label='First name'
                  placeholder='Enter First name'
                  register={methods.register}
                  rules={requiredRuleValidation}
                  error={methods.formState.errors.firstName?.message}
                  required
                />

                <InputField
                  name='lastName'
                  label='Last name'
                  placeholder='Enter Last name'
                  register={methods.register}
                  rules={requiredRuleValidation}
                  error={methods.formState.errors.lastName?.message}
                  required
                />

                <InputField
                  name='phone'
                  label='Phone'
                  placeholder='Enter Phone'
                  register={methods.register}
                  rules={requiredRuleValidation}
                  error={methods.formState.errors.phone?.message}
                  mask={numberMask}
                  required
                />

                <InputField
                  name='email'
                  label='Email'
                  type='email'
                  placeholder='Enter Email'
                  register={methods.register}
                  rules={requiredRuleValidation}
                  error={methods.formState.errors.email?.message}
                  required
                />

                <InputField
                  name='ein'
                  label='Ein'
                  placeholder='Enter Ein'
                  register={methods.register}
                  rules={requiredRuleValidation}
                  error={methods.formState.errors.ein?.message}
                  mask={numberMask}
                  required
                />
              </Flex>
            </Box>
          </Flex>
        </form>
      </FormProvider>
    </>
  );
};

export default memo(EditPage);

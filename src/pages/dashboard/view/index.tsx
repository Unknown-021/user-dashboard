import { memo, useMemo } from 'react';
import { Box, Flex, Spinner, Heading, DataList } from '@chakra-ui/react';
import { Navigate, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { skipToken } from '@reduxjs/toolkit/query';
import { MdEdit } from 'react-icons/md';

import { useShowToastNotification } from '../../../hooks/useShowToastNotification';
import { useGetUserByIdQuery } from '../../../store/api/endpoints/users';
import { ROUTES } from '../../../router/paths';
import loadingBreadcrumb from '../../../constants/loadingBreadcrumb';
import { BreadcrumbsVariableSync } from '../../../components/ui/breadcrumbs';
import CopyBtn from '../../../components/ui/copy-btn';

type AppOutletContext = {
  setBreadcrumbVariable: (payload: { name: string; value: string }) => void;
};

const ViewPage = () => {
  const { setBreadcrumbVariable } = useOutletContext<AppOutletContext>();
  const navigate = useNavigate();

  const params = useParams();
  const userId = params?.id ? Number(params.id) : undefined;

  const {
    isSuccess: isSuccessLoadUserInfo,
    data,
    ...getInfo
  } = useGetUserByIdQuery(userId ?? skipToken, { skip: !params?.id });

  const onClickEdit = () => {
    if (!params.id) {
      return;
    }

    navigate(ROUTES.userEdit.replace(':id', params.id));
  };

  useShowToastNotification(getInfo, {
    isShowError: true,
    isShowSuccess: false,
    errorTitle: 'Error receiving data',
    errorDefaultDescription: 'Error retrieving user data',
  });

  const infoItems = useMemo(
    () => [
      {
        label: 'First name',
        value: data?.firstName ?? '-',
      },
      {
        label: 'Last name',
        value: data?.lastName ?? '-',
      },
      {
        label: 'Phone',
        value: data?.phone ?? '-',
      },
      {
        label: 'Email',
        value: data?.email ?? '-',
      },
      {
        label: 'Ein',
        value: data?.ein ?? '-',
      },
    ],
    [data],
  );

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

      <Flex flexDirection='column' maxW='xl' height='100%'>
        <Flex alignItems='center' gap={4} height={'40px'}>
          <Heading>{`${data?.firstName ?? ''} ${data?.lastName ?? ''}`}</Heading>
          <MdEdit cursor='pointer' onClick={onClickEdit} />
        </Flex>

        <Box mt='6' flex='1'>
          <Flex gap='4' flexDirection='column'>
            <DataList.Root orientation='horizontal' divideY='1px' maxW='xl'>
              {infoItems.map((item) => (
                <DataList.Item key={item.label} pt='4'>
                  <DataList.ItemLabel>{item.label}</DataList.ItemLabel>
                  <DataList.ItemValue>{item.value}</DataList.ItemValue>
                  <CopyBtn value={item.value} />
                </DataList.Item>
              ))}
            </DataList.Root>
          </Flex>
        </Box>
      </Flex>
    </>
  );
};

export default memo(ViewPage);

import { useCallback, useEffect, useState } from 'react';
import { Box, Flex, Heading } from '@chakra-ui/react';

import { VirtualTable } from './../../../components/ui/data-table';
import { userColumns } from '../list/columns';
import { useLazyGetUsersQuery } from '../../../store/api/endpoints/users';
import FullHeightScrollBox from '../../../components/ui/full-height-scroll-box';
import Search from '../../../components/ui/search';
import type { User } from '../../../store/api/endpoints/types';
import CreateUserModal from './components/create-user-modal';

const LIMIT = 20;

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [searchValue, setSearchValue] = useState('');

  const [trigger, { isFetching }] = useLazyGetUsersQuery();

  const hasMore = users.length < total || total === 0;

  const fetchNextPage = useCallback(async () => {
    if (isFetching || !hasMore) return;

    const response = await trigger({
      limit: LIMIT,
      skip: users.length,
      search: searchValue.trim(),
    }).unwrap();

    setUsers((prev) => {
      const existingIds = new Set(prev.map((item) => item.id));
      const nextUsers = response.users.filter((item) => !existingIds.has(item.id));

      return [...prev, ...nextUsers];
    });

    setTotal(response.total);
  }, [trigger, isFetching, hasMore, users.length, searchValue]);

  const onSearchChange = useCallback((value: string) => {
    setUsers([]);
    setTotal(0);
    setSearchValue(value);
  }, []);

  useEffect(() => {
    const loadFirstPage = async () => {
      const response = await trigger({
        limit: LIMIT,
        skip: 0,
        search: searchValue.trim(),
      }).unwrap();

      setUsers(response.users);
      setTotal(response.total);
    };

    loadFirstPage();
  }, [trigger, searchValue]);

  return (
    <Flex direction='column' width='100%'>
      <Box mb={4}>
        <Heading size='lg'>Users</Heading>
      </Box>
      <Box mb={4}>
        <Flex justifyContent={'space-between'}>
          <Search
            value={searchValue}
            onChange={onSearchChange}
            placeholder='Search by name or email'
          />
          <CreateUserModal />
        </Flex>
      </Box>
      <Box flex={1} minH={0}>
        <FullHeightScrollBox>
          <VirtualTable<User>
            columns={userColumns}
            data={users}
            isFetching={isFetching}
            fetchNextPage={fetchNextPage}
          />
        </FullHeightScrollBox>
      </Box>
    </Flex>
  );
};

export default UsersPage;

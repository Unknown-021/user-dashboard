import { useCallback, useEffect, useState } from 'react';
import { Box, Flex, Heading } from '@chakra-ui/react';
import type { SortingState } from '@tanstack/react-table';

import { VirtualTable } from './../../../components/ui/data-table';
import { userColumns } from '../list/columns';
import { useLazyGetUsersQuery } from '../../../store/api/endpoints/users';
import FullHeightScrollBox from '../../../components/ui/full-height-scroll-box';
import Search from '../../../components/ui/search';
import type { User } from '../../../store/api/endpoints/types';
import CreateUserModal from './components/create-user-modal';

const LIMIT = 20;
const SORT_FIELD_MAP: Record<string, string> = {
  id: 'id',
  name: 'firstName',
  email: 'email',
};

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);

  const [trigger, { isFetching }] = useLazyGetUsersQuery();

  const hasMore = users.length < total || total === 0;
  const currentSort = sorting[0];
  const sortBy = currentSort ? SORT_FIELD_MAP[currentSort.id] : undefined;
  const order = currentSort ? (currentSort.desc ? 'desc' : 'asc') : undefined;

  const fetchNextPage = useCallback(async () => {
    if (isFetching || !hasMore) return;

    const response = await trigger({
      limit: LIMIT,
      skip: users.length,
      search: searchValue.trim(),
      sortBy,
      order,
    }).unwrap();

    setUsers((prev) => {
      const existingIds = new Set(prev.map((item) => item.id));
      const nextUsers = response.users.filter((item) => !existingIds.has(item.id));

      return [...prev, ...nextUsers];
    });

    setTotal(response.total);
  }, [trigger, isFetching, hasMore, users.length, searchValue, sortBy, order]);

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
        sortBy,
        order,
      }).unwrap();

      setUsers(response.users);
      setTotal(response.total);
    };

    loadFirstPage();
  }, [trigger, searchValue, sortBy, order]);

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
            sorting={sorting}
            onSortingChange={setSorting}
            manualSorting
          />
        </FullHeightScrollBox>
      </Box>
    </Flex>
  );
};

export default UsersPage;

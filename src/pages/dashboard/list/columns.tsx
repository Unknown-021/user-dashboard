import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import type { User } from '../../../store/api/endpoints/types';

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => row.original.id,
    size: 30,
    minSize: 30,
    maxSize: 30,
  },
  {
    id: 'name',
    header: 'Name',
    cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => row.original.email,
  },
  {
    accessorKey: 'company',
    id: 'company',
    enableSorting: false,
    header: 'Company',
    cell: ({ row }) => row.original.company?.name ?? '—',
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <RouterLink to={`/users/${row.original.id}/view`}>
        <Button size='xs' variant='subtle'>
          Open
        </Button>
      </RouterLink>
    ),
    size: 50,
    minSize: 50,
    maxSize: 50,
  },
];

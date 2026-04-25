import { memo, useEffect, useRef, useState, type JSX } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import type { Column, ColumnDef, Row, SortingState } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Box, Center, Spinner, Table, Text } from '@chakra-ui/react';

interface Props<TData> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  isFetching?: boolean;
  fetchNextPage?: () => void;
  emptyText?: string;
}

type ColumnAlign = 'left' | 'center' | 'right';

const isColumnAlign = (value: unknown): value is ColumnAlign =>
  value === 'left' || value === 'center' || value === 'right';

function VirtualTableComponent<TData>({
  columns,
  data,
  isFetching = false,
  fetchNextPage,
  emptyText = 'No data',
}: Props<TData>) {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable<TData>({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    defaultColumn: {
      size: 180,
      minSize: 80,
      maxSize: 500,
    },
  });

  const rows = table.getRowModel().rows;
  const visibleColumns = table.getVisibleLeafColumns();
  const totalWidth = table.getTotalSize();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 56,
    overscan: 10,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  const paddingTop = virtualItems.length > 0 ? (virtualItems[0]?.start ?? 0) : 0;
  const paddingBottom =
    virtualItems.length > 0
      ? rowVirtualizer.getTotalSize() - (virtualItems[virtualItems.length - 1]?.end ?? 0)
      : 0;

  useEffect(() => {
    if (!fetchNextPage || isFetching || rows.length === 0) return;

    const lastItem = virtualItems[virtualItems.length - 1];
    if (!lastItem) return;

    if (lastItem.index >= rows.length - 3) {
      fetchNextPage();
    }
  }, [virtualItems, rows.length, isFetching, fetchNextPage]);

  const renderColGroup = () => (
    <colgroup>
      {visibleColumns.map((column) => (
        <col
          key={column.id}
          style={{
            width: `${column.getSize()}px`,
          }}
        />
      ))}
    </colgroup>
  );

  const getAlign = (column: Column<TData, unknown>): ColumnAlign => {
    const align = (column.columnDef.meta as { align?: unknown } | undefined)?.align;
    return isColumnAlign(align) ? align : 'left';
  };

  const getSortIcon = (column: Column<TData, unknown>) => {
    const sort = column.getIsSorted();

    if (sort === 'asc') return ' ↑';
    if (sort === 'desc') return ' ↓';

    return '';
  };

  if (!data.length && isFetching) {
    return (
      <Center minH='240px'>
        <Spinner />
      </Center>
    );
  }

  if (!data.length && !isFetching) {
    return (
      <Center minH='240px'>
        <Text>{emptyText}</Text>
      </Center>
    );
  }

  return (
    <Box
      ref={tableContainerRef}
      overflow='auto'
      height='100%'
      minH={0}
      borderWidth='1px'
      borderRadius='lg'
      className='table-scrollbar'
    >
      <Table.Root
        size='sm'
        variant='outline'
        style={{
          tableLayout: 'fixed',
          width: `${totalWidth}px`,
          minWidth: '100%',
        }}
      >
        {renderColGroup()}

        <Table.Header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 2,
            background: 'white',
          }}
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Row key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort();

                return (
                  <Table.ColumnHeader
                    key={header.id}
                    px='4'
                    py='3'
                    onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                    style={{
                      textAlign: getAlign(header.column),
                      verticalAlign: 'middle',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      background: 'white',
                      cursor: canSort ? 'pointer' : 'default',
                      userSelect: 'none',
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {getSortIcon(header.column)}
                      </>
                    )}
                  </Table.ColumnHeader>
                );
              })}
            </Table.Row>
          ))}
        </Table.Header>

        <Table.Body>
          {paddingTop > 0 && (
            <Table.Row>
              <Table.Cell p={0} height={`${paddingTop}px`} colSpan={visibleColumns.length} />
            </Table.Row>
          )}

          {virtualItems.map((virtualRow) => {
            const row = rows[virtualRow.index] as Row<TData>;
            if (!row) return null;

            return (
              <Table.Row key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Table.Cell
                    key={cell.id}
                    px='4'
                    py='3'
                    style={{
                      textAlign: getAlign(cell.column),
                      verticalAlign: 'middle',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.Cell>
                ))}
              </Table.Row>
            );
          })}

          {paddingBottom > 0 && (
            <Table.Row>
              <Table.Cell p={0} height={`${paddingBottom}px`} colSpan={visibleColumns.length} />
            </Table.Row>
          )}
        </Table.Body>
      </Table.Root>

      {isFetching && (
        <Box py={4}>
          <Center>
            <Spinner size='sm' />
          </Center>
        </Box>
      )}
    </Box>
  );
}

VirtualTableComponent.displayName = 'VirtualTable';

export const VirtualTable = memo(VirtualTableComponent) as <TData>(
  props: Props<TData>,
) => JSX.Element;

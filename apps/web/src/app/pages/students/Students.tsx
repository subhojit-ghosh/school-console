import {
  ActionIcon,
  Box,
  Button,
  Group,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import { IconEdit, IconPlus, IconSearch } from '@tabler/icons-react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import endpoints from '../../api/endpoints';
import httpClient from '../../api/http-client';
import StudentForm from './StudentForm';

export default function StudentsPage() {
  const [isListLoading, setIsListLoading] = useState(true);
  const [listData, setListData] = useState({
    data: [],
    totalRecords: 0,
    totalPages: 0,
    size: 10,
    page: 1,
  });
  const [filters, setFilters] = useDebouncedState(
    {
      id: '',
      name: '',
      fatherName: '',
    },
    200
  );
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: '',
    direction: 'asc',
  });
  const [formOpened, setFormOpened] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sortStatus]);

  const fetchList = async (page: number | null = null) => {
    setIsListLoading(true);

    try {
      const { data } = await httpClient.get(endpoints.students.list(), {
        params: {
          ...filters,
          size: listData.size,
          page: page || listData.page,
          ...(sortStatus.columnAccessor
            ? {
                sortBy: sortStatus.columnAccessor,
                sortOrder: sortStatus.direction,
              }
            : {}),
        },
      });

      setListData({
        ...listData,
        ...data,
      });
    } catch (error) {
      console.error(error);
    }

    setIsListLoading(false);
  };

  return (
    <>
      <Group justify="space-between">
        <Title size="lg" mb="lg">
          Students
        </Title>
        <Button
          variant="filled"
          size="xs"
          radius="sm"
          leftSection={<IconPlus size={14} />}
          onClick={() => {
            setFormMode('add');
            setFormData(null);
            setFormOpened(true);
          }}
        >
          Add
        </Button>
      </Group>

      <DataTable
        withTableBorder
        withColumnBorders
        borderRadius="sm"
        striped
        highlightOnHover
        minHeight={300}
        fetching={isListLoading}
        totalRecords={listData.totalRecords}
        recordsPerPage={listData.size}
        page={listData.page}
        onPageChange={(p) => fetchList(p)}
        records={listData.data}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        columns={[
          {
            accessor: 'id',
            title: 'ID',
            sortable: true,
            filter: (
              <TextInput
                label="ID"
                leftSection={<IconSearch size={16} />}
                defaultValue={filters.id}
                onChange={(e) =>
                  setFilters({ ...filters, id: e.currentTarget.value })
                }
              />
            ),
            filtering: !!filters.id,
          },
          {
            accessor: 'name',
            title: 'Name',
            sortable: true,
            filter: (
              <TextInput
                label="Name"
                leftSection={<IconSearch size={16} />}
                defaultValue={filters.name}
                onChange={(e) =>
                  setFilters({ ...filters, name: e.currentTarget.value })
                }
              />
            ),
            filtering: !!filters.name,
          },
          {
            accessor: 'fatherName',
            title: "Father's Name",
            sortable: true,
            filter: (
              <TextInput
                label="Father's Name"
                leftSection={<IconSearch size={16} />}
                defaultValue={filters.fatherName}
                onChange={(e) =>
                  setFilters({ ...filters, fatherName: e.currentTarget.value })
                }
              />
            ),
            filtering: !!filters.fatherName,
          },
          {
            accessor: 'actions',
            title: <Box mr={6}>Actions</Box>,
            textAlign: 'center',
            render: (row: any) => (
              <Group gap={4} justify="center" wrap="nowrap">
                <Tooltip label="Edit" withArrow>
                  <ActionIcon
                    size="sm"
                    variant="subtle"
                    onClick={() => {
                      setFormMode('edit');
                      setFormData(row);
                      setFormOpened(true);
                    }}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            ),
          },
        ]}
      />

      <StudentForm
        opened={formOpened}
        close={() => setFormOpened(false)}
        mode={formMode}
        data={formData}
        fetchList={fetchList}
      />
    </>
  );
}

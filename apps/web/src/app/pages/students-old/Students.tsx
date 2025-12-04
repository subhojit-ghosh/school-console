import {
  ActionIcon,
  Box,
  Button,
  Group,
  Tabs,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import { IconEdit, IconPlus, IconSearch } from '@tabler/icons-react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import endpoints from '../../api/endpoints';
import httpClient from '../../api/http-client';
import StudentForm from './StudentForm';

export default function StudentsPage() {
  const [type, setType] = useState<string | null>('enrolled');
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
      <Group justify="space-between" align="center" mb="md">
        <Title size="lg">Students</Title>
        <Button
          variant="filled"
          leftSection={<IconPlus size={14} />}
          component={Link}
          to="/students/add"
        >
          Add
        </Button>
      </Group>
      <Tabs value={type} onChange={setType} my={10}>
        <Tabs.List>
          <Tabs.Tab value="enrolled" color='green'>Enrolled</Tabs.Tab>
          <Tabs.Tab value="registration">New Registrations</Tabs.Tab>
        </Tabs.List>
      </Tabs>
      <DataTable
        withTableBorder
        withColumnBorders
       
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

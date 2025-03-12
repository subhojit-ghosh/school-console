import {
  ActionIcon,
  Box,
  Button,
  Group,
  Select,
  Switch,
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
import { roles } from '../../data/roles';
import UserForm from './UserForm';

export default function UsersPage() {
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
      name: '',
      username: '',
      role: '',
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
      const { data } = await httpClient.get(endpoints.users.list(), {
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

  const updateStatus = async (id: string, isActive: boolean) => {
    try {
      setIsListLoading(true);
      await httpClient.put(endpoints.users.updateStatus(id), { isActive });
      fetchList();
    } catch (error) {
      console.error(error);
      setIsListLoading(false);
    }
  };

  return (
    <>
      <Group justify="space-between">
        <Title size="lg" mb="lg">
          Users
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
            accessor: 'username',
            title: 'Username',
            sortable: true,
            filter: (
              <TextInput
                label="Username"
                leftSection={<IconSearch size={16} />}
                defaultValue={filters.username}
                onChange={(e) =>
                  setFilters({ ...filters, username: e.currentTarget.value })
                }
              />
            ),
            filtering: !!filters.username,
          },
          {
            accessor: 'role',
            title: 'Role',
            sortable: true,
            render: (row: any) =>
              roles.find((r) => r.value === row.role)?.label,
            filter: (
              <Select
                data={roles}
                label="Role"
                placeholder="Select"
                clearable
                comboboxProps={{ withinPortal: false }}
                defaultValue={filters.role}
                onChange={(value) =>
                  setFilters({ ...filters, role: value || '' })
                }
              />
            ),
            filtering: !!filters.role,
          },
          {
            accessor: 'isActive',
            title: 'Status',
            sortable: true,
            render: (row: any) => (
              <Switch
                checked={row.isActive}
                color="green"
                size="xs"
                style={{ cursor: 'pointer' }}
                onChange={() => updateStatus(row.id, !row.isActive)}
              />
            ),
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

      <UserForm
        opened={formOpened}
        close={() => setFormOpened(false)}
        mode={formMode}
        data={formData}
        fetchList={fetchList}
      />
    </>
  );
}

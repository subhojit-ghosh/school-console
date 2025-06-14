import {
  ActionIcon,
  Box,
  Button,
  Grid,
  Group,
  Switch,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import { IconEdit, IconPlus, IconSearch } from '@tabler/icons-react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import moment from 'moment';
import { useEffect, useState } from 'react';
import endpoints from '../../api/endpoints';
import httpClient from '../../api/http-client';
import AcademicYearForm from './AcademicYearForm';
import Currency from '../../components/Currency';
import IsAccessiable from '../../components/IsAccessiable';
import { useAuthStore } from '../../stores/authStore';
import { DeniedUserRoles } from '../../data/roles';

export default function AcademicYearsPage() {
  const [isListLoading, setIsListLoading] = useState(true);
  const authStore = useAuthStore();
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
    },
    200
  );
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'name',
    direction: 'desc',
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
      const { data } = await httpClient.get(endpoints.academicYears.list(), {
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
      await httpClient.put(endpoints.academicYears.updateStatus(id), {
        isActive,
      });
      fetchList();
    } catch (error) {
      console.error(error);
      setIsListLoading(false);
    }
  };

  return (
    <>
      <Group justify="space-between" align="center" mb="md">
        <Title size="lg">Academic Years</Title>
        <IsAccessiable>
          <Button
            variant="filled"
            leftSection={<IconPlus size={16} />}
            onClick={() => {
              setFormMode('add');
              setFormData(null);
              setFormOpened(true);
            }}
          >
            Add
          </Button>
        </IsAccessiable>
      </Group>
      <Grid mb="md">
        <Grid.Col span={6}>
          <TextInput
            placeholder="Search by name"
            leftSection={<IconSearch size={16} />}
            defaultValue={filters.name}
            onChange={(e) =>
              setFilters({ ...filters, name: e.currentTarget.value })
            }
          />
        </Grid.Col>
      </Grid>
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
            accessor: 'name',
            title: 'Name',
            sortable: true,
          },
          {
            accessor: 'startDate',
            title: 'Start Date',
            render: (row: any) => moment(row.startDate).format('MMMM DD, YYYY'),
          },
          {
            accessor: 'endDate',
            title: 'End Date',
            render: (row: any) => moment(row.endDate).format('MMMM DD, YYYY'),
          },
          {
            accessor: 'studentIdPrefix',
            title: 'Student ID Prefix',
          },
          {
            accessor: 'lateFinePerDay',
            title: 'Late Fine Per Day',
            render: (row: any) => <Currency value={row.lateFinePerDay} />,
          },
          {
            accessor: 'isActive',
            title: 'Status',
            sortable: true,
            render: (row: any) => (
              <Switch
                disabled={DeniedUserRoles.includes(authStore.user?.role || '')}
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
                <IsAccessiable>
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
                </IsAccessiable>
              </Group>
            ),
          },
        ]}
      />

      <IsAccessiable>
        <AcademicYearForm
          opened={formOpened}
          close={() => setFormOpened(false)}
          mode={formMode}
          data={formData}
          fetchList={fetchList}
        />
      </IsAccessiable>
    </>
  );
}

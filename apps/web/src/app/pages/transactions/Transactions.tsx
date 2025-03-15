import {
  ActionIcon,
  Box,
  Button,
  Group,
  Switch,
  Tabs,
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

export default function TransactionsPage() {
  const [type, setType] = useState<string | null>('student');
  const [isListLoading, setIsListLoading] = useState(true);
  const [listData, setListData] = useState({
    data: [
      {
        id: 1,
        studentId: 'J-001',
        studentName: 'Rahul Kumar',
        type: 'Fee',
        amount: 500,
        date: '2021-09-01',
        mode: 'Cash',
      },
    ],
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
  }, [filters, sortStatus]);

  const fetchList = async (page: number | null = null) => {
    setIsListLoading(true);

    // try {
    //   const { data } = await httpClient.get(endpoints.academicYears.list(), {
    //     params: {
    //       ...filters,
    //       size: listData.size,
    //       page: page || listData.page,
    //       ...(sortStatus.columnAccessor
    //         ? {
    //             sortBy: sortStatus.columnAccessor,
    //             sortOrder: sortStatus.direction,
    //           }
    //         : {}),
    //     },
    //   });

    //   setListData({
    //     ...listData,
    //     ...data,
    //   });
    // } catch (error) {
    //   console.error(error);
    // }

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
        <Title size="lg">Transactions</Title>
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
      </Group>
      <Tabs value={type} onChange={setType}>
        <Tabs.List>
          <Tabs.Tab value="student">Student Fees</Tabs.Tab>
          <Tabs.Tab value="registration">Registration</Tabs.Tab>
        </Tabs.List>
      </Tabs>
      <DataTable
        my={10}
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
          },
          {
            accessor: 'studentId',
            title: 'Student ID',
            sortable: true,
            filter: (
              <TextInput
                label="Student ID"
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
            accessor: 'studentName',
            title: 'Student Name',
            sortable: true,
            filter: (
              <TextInput
                label="Student Name"
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
    </>
  );
}

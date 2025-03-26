import {
  ActionIcon,
  Box,
  Button,
  Group,
  Select,
  Tabs,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import {
  IconPlus,
  IconPrinter,
  IconSearch,
  IconUserCheck,
  IconUserPlus,
} from '@tabler/icons-react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import endpoints from '../../api/endpoints';
import httpClient from '../../api/http-client';
import tabStyles from '../../styles/Tab.module.scss';

export default function TransactionsPage() {
  const [type, setType] = useState<string | null>('enrolled');
  const [isListLoading, setIsListLoading] = useState(true);
  const [listData, setListData] = useState<any>({
    data: [],
    totalRecords: 0,
    totalPages: 0,
    size: 10,
    page: 1,
  });
  const [filters, setFilters] = useDebouncedState(
    {
      name: '',
      academicYearId: '',
    },
    200
  );
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'createdAt',
    direction: 'desc',
  });
  const [academicYears, setAcademicYears] = useState<any[]>([]);

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sortStatus, type]);

  useEffect(() => {
    fetchAcademicYears();
  }, []);

  const fetchAcademicYears = async () => {
    try {
      const { data } = await httpClient.get(endpoints.academicYears.dropdown());
      setAcademicYears(data.data);
      const currentAcademicYear = data.data.find((item: any) => item.isActive);
      setFilters({
        ...filters,
        academicYearId: String(currentAcademicYear.id),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const fetchList = async (page: number | null = null) => {
    setIsListLoading(true);

    try {
      const { data } = await httpClient.get(endpoints.transactions.list(), {
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
        <Title size="lg">Transactions</Title>
      </Group>
      <Tabs
        value={type}
        onChange={setType}
        variant="unstyled"
        classNames={{ tab: tabStyles.tab }}
      >
        <Tabs.List grow>
          <Tabs.Tab
            value="enrolled"
            color="green"
            leftSection={<IconUserCheck size={18} />}
          >
            Enrolled Students
          </Tabs.Tab>
          <Tabs.Tab
            value="registration"
            leftSection={<IconUserPlus size={18} />}
          >
            New Registrations
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>
      <Group justify="space-between" my={10}>
        <Select
          data={academicYears.map((item: any) => ({
            label: item.name,
            value: String(item.id),
          }))}
          value={filters.academicYearId}
          onChange={(value) =>
            setFilters({ ...filters, academicYearId: value || '' })
          }
        />
        <Button
          variant="filled"
          leftSection={<IconPlus size={14} />}
          component={Link}
          to={`/transactions/add/${type}`}
        >
          Take Fee
        </Button>
      </Group>
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
            title: 'Student',
            render: (row: any) =>
              `${row.studentName} (${
                row.isEnrolled ? row.enrolledNo : row.regId
              })`,
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
            accessor: 'class',
            title: 'Class',
          },
          {
            accessor: 'payable',
            title: 'Payable',
            render: (row: any) => `₹${row.payable}`,
          },
          {
            accessor: 'paid',
            title: 'Paid',
            render: (row: any) => `₹${row.paid}`,
          },
          {
            accessor: 'due',
            title: 'Due',
            render: (row: any) => `₹${row.due}`,
          },
          {
            accessor: 'mode',
            title: 'Mode',
          },
          {
            accessor: 'createdAt',
            title: 'Date',
            render: (row: any) =>
              row.createdAt
                ? moment(row.createdAt).format('DD-MMM-YYYY hh:mm A')
                : '',
            sortable: true,
          },
          {
            accessor: 'actions',
            title: <Box mr={6}>Actions</Box>,
            textAlign: 'center',
            render: (row: any) => (
              <Group gap={4} justify="center" wrap="nowrap">
                <Tooltip label="Print Receipt" withArrow>
                  <ActionIcon size="sm" variant="subtle">
                    <IconPrinter size={16} />
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

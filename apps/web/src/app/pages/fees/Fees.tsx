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
import { FeeCategory } from '@school-console/utils';
import { IconEdit, IconPlus, IconSearch } from '@tabler/icons-react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import endpoints from '../../api/endpoints';
import httpClient from '../../api/http-client';
import FeeForm from './FeeForm';
import moment from 'moment';

function FeesPage() {
  const [category, setCategory] = useState<string | null>(
    FeeCategory.Enrollment
  );
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
      academicYearId: '',
      classId: '',
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
  const [academicYears, setAcademicYears] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);

  useEffect(() => {
    if (!filters.academicYearId) {
      return;
    }
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, filters, sortStatus]);

  useEffect(() => {
    fetchAcademicYears();
    fetchClasses();
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

  const fetchClasses = async () => {
    try {
      const { data } = await httpClient.get(endpoints.classes.dropdown());
      setClasses(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchList = async (page: number | null = null) => {
    setIsListLoading(true);

    try {
      const { data } = await httpClient.get(endpoints.fees.list(), {
        params: {
          category,
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
        <Title size="lg">Fees</Title>
      </Group>
      <Tabs value={category} onChange={setCategory}>
        <Tabs.List>
          <Tabs.Tab value={FeeCategory.Enrollment}>Enrollment</Tabs.Tab>
          <Tabs.Tab value={FeeCategory.Tuition}>Tuition</Tabs.Tab>
          <Tabs.Tab value={FeeCategory.Material}>Material</Tabs.Tab>
          <Tabs.Tab value={FeeCategory.Miscellaneous}>Miscellaneous</Tabs.Tab>
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
          size="xs"
          radius="sm"
        />
        <Button
          variant="filled"
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
            accessor: 'amount',
            title: 'Amount',
            sortable: true,
          },
          {
            accessor: 'classId',
            title: 'Class',
            render: (row: any) =>
              classes.find((item) => item.id === row.classId)?.name,
            sortable: true,
            filter: (
              <Select
                data={classes.map((item) => ({
                  label: item.name,
                  value: String(item.id),
                }))}
                label="Class"
                placeholder="Select"
                clearable
                comboboxProps={{ withinPortal: false }}
                defaultValue={filters.classId}
                onChange={(value) =>
                  setFilters({ ...filters, classId: value || '' })
                }
              />
            ),
            filtering: !!filters.classId,
          },
          ...(category !== FeeCategory.Enrollment
            ? [
                {
                  accessor: 'dueDate',
                  title: 'Due Date',
                  render: (row: any) =>
                    row.dueDate
                      ? moment(row.dueDate).format('MMMM DD, YYYY')
                      : '',
                  sortable: true,
                },
              ]
            : []),
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

      <FeeForm
        opened={formOpened}
        close={() => setFormOpened(false)}
        mode={formMode}
        data={formData}
        fetchList={fetchList}
        academicYears={academicYears}
        classes={classes}
        category={category}
      />
    </>
  );
}

export default FeesPage;

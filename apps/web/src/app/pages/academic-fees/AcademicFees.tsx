import {
  ActionIcon,
  Box,
  Button,
  Group,
  Select,
  Title,
  Tooltip,
} from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import { IconEdit, IconPlus } from '@tabler/icons-react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import moment from 'moment';
import { useEffect, useState } from 'react';
import endpoints from '../../api/endpoints';
import httpClient from '../../api/http-client';
import { titleCase } from '../../utils/text-formating';
import AcademicFeeForm from './AcademicFeeForm';

export default function AcademicFeesPage() {
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
      academicYearId: '',
      classId: '',
    },
    200
  );
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'category',
    direction: 'asc',
  });
  const [formOpened, setFormOpened] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [formData, setFormData] = useState<any>(null);
  const [academicYears, setAcademicYears] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);

  useEffect(() => {
    if (!filters.academicYearId || !filters.classId) {
      return;
    }
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sortStatus]);

  useEffect(() => {
    fetchDropdowns();
  }, []);

  const fetchDropdowns = async () => {
    try {
      const [{ data: academicYearsDropdown }, { data: classesDropdown }] =
        await Promise.all([
          httpClient.get(endpoints.academicYears.dropdown()),
          httpClient.get(endpoints.classes.dropdown()),
        ]);

      setAcademicYears(academicYearsDropdown.data);
      setClasses(classesDropdown.data);

      const newFilters: any = {};

      if (academicYearsDropdown.data.length) {
        const currentAcademicYear = academicYearsDropdown.data.find(
          (item: any) => item.isActive
        );
        Object.assign(newFilters, {
          academicYearId: String(
            currentAcademicYear
              ? currentAcademicYear.id
              : academicYearsDropdown.data[0].id
          ),
        });
      }

      if (classesDropdown.data.length) {
        Object.assign(newFilters, {
          classId: String(classesDropdown.data[0].id),
        });
      }

      setFilters((prev) => ({
        ...prev,
        ...newFilters,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchList = async (page: number | null = null) => {
    setIsListLoading(true);

    try {
      const { data } = await httpClient.get(endpoints.academicFees.list(), {
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
        <Title size="lg">Academic Fees</Title>
      </Group>
      <Group justify="space-between" my={10}>
        <div className="flex flex-row">
          <Select
            label="Academic Year"
            data={academicYears.map((item: any) => ({
              label: item.name,
              value: String(item.id),
            }))}
            value={filters.academicYearId}
            onChange={(value) =>
              setFilters({ ...filters, academicYearId: value || '' })
            }
            mr="md"
          />
          <Select
            label="Class"
            data={classes.map((item: any) => ({
              label: item.name,
              value: String(item.id),
            }))}
            value={filters.classId}
            onChange={(value) =>
              setFilters({ ...filters, classId: value || '' })
            }
          />
        </div>
        <Button
          variant="filled"
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
            accessor: 'category',
            title: 'Category',
            render: (row: any) => titleCase(row.category),
            sortable: true,
          },
          {
            accessor: 'name',
            title: 'Name',
            sortable: true,
          },
          {
            accessor: 'amount',
            title: 'Amount',
            render: (row: any) => `₹${row.amount}`,
            sortable: true,
          },
          {
            accessor: 'dueDate',
            title: 'Due Date',
            render: (row: any) =>
              row.dueDate ? moment(row.dueDate).format('MMMM DD, YYYY') : '',
            sortable: true,
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

      <AcademicFeeForm
        opened={formOpened}
        close={() => setFormOpened(false)}
        mode={formMode}
        data={formData}
        fetchList={fetchList}
        academicYears={academicYears}
        classes={classes}
        filters={filters}
      />
    </>
  );
}

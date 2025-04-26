import {
  ActionIcon,
  Box,
  Button,
  Group,
  NumberInput,
  Select,
  Text,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import {
  IconCalendarStats,
  IconCurrencyRupee,
  IconEdit,
  IconPlus,
} from '@tabler/icons-react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import moment from 'moment';
import { useEffect, useState } from 'react';
import endpoints from '../../api/endpoints';
import httpClient from '../../api/http-client';
import Currency from '../../components/Currency';
import AcademicFeeForm from './AcademicFeeForm';
import IsAccessiable from '../../components/IsAccessiable';
import { academicFeeNames } from '../../data/academic-fee-names';
import { DateInput } from '@mantine/dates';

export default function AcademicFeesPageNew() {
  const academicFeeLabelsList = academicFeeNames.map((rec) => rec.label);
  const [isListLoading, setIsListLoading] = useState(true);
  const [toggleEdit, setToggleEdit] = useState<boolean>(false);
  const [listData, setListData] = useState({
    data: [],
    totalRecords: 0,
    totalPages: 0,
    size: 20,
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
    columnAccessor: '',
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
      console.log('debug-data', data);

      setListData({
        ...listData,
        ...data,
        data: data.data.map((rec: any, index: any) => ({ ...rec, index })),
      });
    } catch (error) {
      console.error(error);
    }

    setIsListLoading(false);
  };

  const onChangeInput = (v, key, index) => {
    const data: any = listData;
    data.data[index][key] = v;
    setListData({ ...data });
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
        <IsAccessiable>
          <Button
            variant="filled"
            leftSection={<IconPlus size={14} />}
            onClick={() => {
              // setFormMode('add');
              // setFormData(null);
              // setFormOpened(true);
              setToggleEdit(!toggleEdit);
            }}
          >
            {!toggleEdit ? 'Edit' : 'Save'}
          </Button>
        </IsAccessiable>
      </Group>
      <DataTable
        withTableBorder
        withColumnBorders
        borderRadius="sm"
        striped
        highlightOnHover
        minHeight={300}
        fetching={isListLoading}
        // totalRecords={listData.totalRecords}
        // recordsPerPage={listData.size}
        // page={listData.page}
        // onPageChange={(p) => fetchList(p)}
        records={listData.data}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        columns={[
          {
            accessor: 'name',
            title: 'Name',
            sortable: true,
            render: (row: any) =>
              !academicFeeLabelsList.includes(row.name) && toggleEdit ? (
                <TextInput
                  size="xs"
                  value={row.name}
                  onChange={(e) =>
                    onChangeInput(e.target.value, 'name', row.index)
                  }
                />
              ) : (
                <Text size="xs" lh={0}>
                  {row.name}
                </Text>
              ),
          },
          {
            accessor: 'amount',
            title: 'Amount',
            width: 207,
            render: (row: any) =>
              !toggleEdit ? (
                <Currency value={row.amount} />
              ) : (
                <NumberInput
                  maw="190px"
                  miw="190px"
                  size="xs"
                  min={0}
                  value={row.amount}
                  decimalScale={2}
                  fixedDecimalScale
                  hideControls
                  leftSection={<IconCurrencyRupee size={18} stroke={2} />}
                  styles={{
                    input: {
                      height: '20px',
                    },
                  }}
                  onChange={(e) => onChangeInput(e, 'amount', row.index)}
                />
              ),
            sortable: true,
          },
          {
            accessor: 'dueDate',
            title: 'Due Date',
            render: (row: any) =>
              toggleEdit ? (
                <DateInput
                  valueFormat="DD/MM/YYYY"
                  value={row.dueDate ? moment(row.dueDate).toDate() : null}
                  size="xs"
                  leftSection={<IconCalendarStats size={18} stroke={2} />}
                  styles={{
                    input: {
                      height: '20px',
                    },
                  }}
                  onChange={(e) => onChangeInput(e, 'dueDate', row.index)}
                />
              ) : row.dueDate ? (
                moment(row.dueDate).format('MMMM DD, YYYY')
              ) : (
                ''
              ),
            sortable: true,
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

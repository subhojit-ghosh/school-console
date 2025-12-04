import { Button, Grid, Group, Select, TextInput } from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import { IconDownload, IconSearch } from '@tabler/icons-react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import moment from 'moment';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { DatePickerInput } from '@mantine/dates';
import endpoints from '../../api/endpoints';
import httpClient from '../../api/http-client';
import Currency from '../../components/Currency';

export default function TransactionHistoryReport() {
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [listData, setListData] = useState<any>({
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
      student: '',
      mode: '',
      dateFrom: null as Date | null,
      dateTo: null as Date | null,
    },
    200
  );
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'createdAt',
    direction: 'desc',
  });
  const [academicYears, setAcademicYears] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);

  const today = dayjs();
  const datePresets = [
    {
      value: [today.subtract(2, 'day').toDate(), today.toDate()],
      label: 'Last two days',
    },
    {
      value: [today.subtract(7, 'day').toDate(), today.toDate()],
      label: 'Last 7 days',
    },
    {
      value: [today.startOf('month').toDate(), today.toDate()],
      label: 'This month',
    },
    {
      value: [
        today.subtract(1, 'month').startOf('month').toDate(),
        today.subtract(1, 'month').endOf('month').toDate(),
      ],
      label: 'Last month',
    },
    {
      value: [
        today.subtract(1, 'year').startOf('year').toDate(),
        today.subtract(1, 'year').endOf('year').toDate(),
      ],
      label: 'Last year',
    },
  ];

  useEffect(() => {
    fetchDropdowns();
  }, []);

  useEffect(() => {
    if (!filters.academicYearId) {
      return;
    }
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sortStatus]);

  const fetchDropdowns = async () => {
    try {
      const [{ data: academicYearsDropdown }, { data: classesDropdown }] =
        await Promise.all([
          httpClient.get(endpoints.academicYears.dropdown()),
          httpClient.get(endpoints.classes.dropdown()),
        ]);

      setAcademicYears(academicYearsDropdown.data);
      setClasses(classesDropdown.data);

      const currentAcademicYear = academicYearsDropdown.data.find(
        (item: any) => item.isActive
      );

      setFilters((prev) => ({
        ...prev,
        academicYearId: String(
          currentAcademicYear
            ? currentAcademicYear.id
            : academicYearsDropdown.data[0]?.id
        ),
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchList = async (page: number | null = null) => {
    setIsLoading(true);

    try {
      const params: any = {
        academicYearId: filters.academicYearId || undefined,
        classId: filters.classId || undefined,
        student: filters.student || undefined,
        mode: filters.mode || undefined,
        dateFrom: filters.dateFrom
          ? moment(filters.dateFrom).format('YYYY-MM-DD')
          : undefined,
        dateTo: filters.dateTo
          ? moment(filters.dateTo).format('YYYY-MM-DD')
          : undefined,
        size: listData.size,
        page: page || listData.page,
        ...(sortStatus.columnAccessor
          ? {
              sortBy: sortStatus.columnAccessor,
              sortOrder: sortStatus.direction,
            }
          : {}),
      };

      const { data } = await httpClient.get(
        endpoints.reports.transactions(),
        {
          params,
        }
      );

      setListData((prev: any) => ({
        ...prev,
        ...data,
      }));
    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);
  };

  const downloadExcel = async () => {
    setIsDownloading(true);
    try {
      const params: any = {
        academicYearId: filters.academicYearId || undefined,
        classId: filters.classId || undefined,
        student: filters.student || undefined,
        mode: filters.mode || undefined,
        dateFrom: filters.dateFrom
          ? moment(filters.dateFrom).format('YYYY-MM-DD')
          : undefined,
        dateTo: filters.dateTo
          ? moment(filters.dateTo).format('YYYY-MM-DD')
          : undefined,
        size: 5000,
        page: 1,
        ...(sortStatus.columnAccessor
          ? {
              sortBy: sortStatus.columnAccessor,
              sortOrder: sortStatus.direction,
            }
          : {}),
      };

      const { data } = await httpClient.get(
        endpoints.reports.transactionsExport(),
        {
          params,
          responseType: 'blob',
        }
      );

      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      const parts: string[] = [];
      if (filters.academicYearId) {
        const year = academicYears.find(
          (a: any) => a.id === Number(filters.academicYearId)
        );
        if (year) parts.push(year.name);
      }
      if (filters.classId) {
        const klass = classes.find(
          (c: any) => c.id === Number(filters.classId)
        );
        if (klass) parts.push(klass.name);
      }

      link.download = `Transaction History - ${
        parts.join(' - ') || 'All'
      }.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <Grid my={10}>
        <Grid.Col span={3}>
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
          />
        </Grid.Col>
        <Grid.Col span={3}>
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
            clearable
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <DatePickerInput
            type="range"
            allowSingleDateInRange
            label="Date range"
            placeholder="Select date range"
            value={[filters.dateFrom, filters.dateTo]}
            onChange={([from, to]) =>
              setFilters((prev) => ({
                ...prev,
                dateFrom: from,
                dateTo: to,
              }))
            }
            presets={datePresets}
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <Select
            label="Mode"
            data={[
              { label: 'Cash', value: 'Cash' },
              { label: 'Card', value: 'Card' },
              { label: 'Online', value: 'Online' },
              { label: 'UPI', value: 'UPI' },
              { label: 'Cheque', value: 'Cheque' },
            ]}
            value={filters.mode}
            onChange={(value) =>
              setFilters({ ...filters, mode: value || '' })
            }
            clearable
          />
        </Grid.Col>
      </Grid>

      <Grid my={10}>
        <Grid.Col span={6}>
          <TextInput
            label="Student"
            leftSection={<IconSearch size={16} />}
            placeholder="Name / Reg No / Enrolled No"
            value={filters.student}
            onChange={(e) =>
              setFilters({ ...filters, student: e.currentTarget.value })
            }
          />
        </Grid.Col>
        <Grid.Col span={6} style={{ display: 'flex', alignItems: 'end' }}>
          <Group justify="flex-end" w="100%">
            <Button
              rightSection={<IconDownload size={14} />}
              disabled={isLoading}
              loading={isDownloading}
              onClick={downloadExcel}
            >
              Download
            </Button>
          </Group>
        </Grid.Col>
      </Grid>

      <DataTable
        my={10}
        withTableBorder
        withColumnBorders
       
        striped
        highlightOnHover
        minHeight={300}
        fetching={isLoading}
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
          },
          {
            accessor: 'classId',
            title: 'Class',
            render: (row: any) =>
              classes.find((item) => item.id === row.classId)?.name,
          },
          {
            accessor: 'totalAmount',
            title: 'Total Amount',
            render: (row: any) => <Currency value={row.totalAmount} />,
          },
          {
            accessor: 'lateFine',
            title: 'Late Fine',
            render: (row: any) => <Currency value={row.lateFine} />,
          },
          {
            accessor: 'concession',
            title: 'Concession',
            render: (row: any) => <Currency value={row.concession} />,
          },
          {
            accessor: 'payable',
            title: 'Payable',
            render: (row: any) => <Currency value={row.payable} />,
          },
          {
            accessor: 'paid',
            title: 'Paid',
            render: (row: any) => <Currency value={row.paid} />,
          },
          {
            accessor: 'due',
            title: 'Due',
            render: (row: any) => <Currency value={row.due} />,
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
        ]}
      />
    </>
  );
}



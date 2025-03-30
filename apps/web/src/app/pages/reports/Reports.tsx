import { Grid, Group, Select, Title } from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import endpoints from '../../api/endpoints';
import httpClient from '../../api/http-client';
import Currency from '../../components/Currency';
import DuesTable from './DuesTable';

export default function ReportsPage() {
  const [isListLoading, setIsListLoading] = useState(true);
  const [listData, setListData] = useState([]);
  const [filters, setFilters] = useDebouncedState(
    {
      academicYearId: '',
      classId: '',
      studentId: '',
    },
    200
  );
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: '',
    direction: 'asc',
  });
  const [academicYears, setAcademicYears] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [studentSearchValue, setStudentSearchValue] = useState('');
  const [students, setStudents] = useState<any[]>([]);

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

  useEffect(() => {
    if (filters.classId) {
      setFilters((prev) => ({
        ...prev,
        studentId: '',
      }));
      setStudentSearchValue('');
      fetchStudents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.classId]);

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

  const fetchStudents = async () => {
    try {
      const { data } = await httpClient.get(endpoints.students.list(), {
        params: {
          size: 9999,
          classId: filters.classId,
        },
      });
      setStudents(
        data.data.map((item: any) => ({
          label: `${item.name} (${
            item.isEnrolled ? item.enrolledNo : item.regId
          })`,
          value: String(item.id),
        }))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const fetchList = async (page: number | null = null) => {
    setIsListLoading(true);

    try {
      const { data } = await httpClient.get(endpoints.reports.dues(), {
        params: {
          ...filters,
          ...(sortStatus.columnAccessor
            ? {
                sortBy: sortStatus.columnAccessor,
                sortOrder: sortStatus.direction,
              }
            : {}),
        },
      });

      setListData(data);
    } catch (error) {
      console.error(error);
    }

    setIsListLoading(false);
  };

  return (
    <>
      <Group justify="space-between" align="center" mb="md">
        <Title size="lg">Reports</Title>
      </Group>
      <Grid my={10}>
        <Grid.Col span={2}>
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
        <Grid.Col span={2}>
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
        </Grid.Col>
        <Grid.Col span={4}>
          <Select
            label="Student"
            data={students}
            searchable
            searchValue={studentSearchValue}
            onSearchChange={setStudentSearchValue}
            clearable
            allowDeselect
            value={filters.studentId}
            onChange={(value) =>
              setFilters({ ...filters, studentId: value || '' })
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
        records={listData}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        columns={[
          {
            accessor: 'id',
            title: 'Student',
            render: (row: any) =>
              `${row.name} (${row.isEnrolled ? row.enrolledNo : row.regId})`,
          },
          {
            accessor: 'totalAmount',
            title: 'Total Amount',
            render: (row: any) => <Currency value={row.totalAmount} />,
          },
          {
            accessor: 'totalConcession',
            title: 'Total Concession',
            render: (row: any) => <Currency value={row.totalConcession} />,
          },
          {
            accessor: 'totalPaid',
            title: 'Total Paid',
            render: (row: any) => <Currency value={row.totalPaid} />,
          },
          {
            accessor: 'totalOverdue',
            title: 'Total Overdue',
            render: (row: any) => <Currency value={row.totalOverdue} />,
          },
          {
            accessor: 'totalDue',
            title: 'Total Due',
            render: (row: any) => <Currency value={row.totalDue} />,
          },
        ]}
        rowExpansion={{
          content: ({ record }: any) => <DuesTable items={record.dues} />,
        }}
      />
    </>
  );
}

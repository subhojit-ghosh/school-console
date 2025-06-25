import {
  Button,
  Grid,
  Group,
  Paper,
  Select,
  Skeleton,
  Text,
  Title,
} from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import { IconDownload } from '@tabler/icons-react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import endpoints from '../../api/endpoints';
import httpClient from '../../api/http-client';
import Currency from '../../components/Currency';
import DuesTable from './DuesTable';
import * as XLSX from 'xlsx';
import moment from 'moment';

export default function ReportsPage() {
  const [isListLoading, setIsListLoading] = useState(true);
  const [listData, setListData] = useState<any>([]);
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

  const downloadAsExcel = async () => {
    const data = [];

    for (const student of listData) {
      for (const item of student.dues) {
        data.push({
          student: `${student.name} (${
            student.isEnrolled ? student.enrolledNo : student.regId
          })`,
          feeName: item.name,
          dueDate: item.dueDate
            ? moment(item.dueDate).format('YYYY-MM-DD')
            : '',
          amount: item.amount,
          lateFine: item.lateFine,
          lateDays: item.lateDays,
          totalConcession: item.totalConcession,
          totalPayable: item.totalPayable,
          totalPaid: item.totalPaid,
          totalDue: item.totalDue,
          overdue: item.isOverdue ? 'Yes' : 'No',
        });
      }
    }

    console.log('Data to be exported:', data);

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet);

    const filterParts = [
      filters.academicYearId
        ? academicYears.find(
            (item) => item.id === Number(filters.academicYearId)
          )?.name
        : null,
      filters.classId
        ? classes.find((item) => item.id === Number(filters.classId))?.name
        : null,
      filters.studentId
        ? students.find((item) => item.value === filters.studentId)?.label
        : null,
    ]
      .filter((value) => value)
      .join(' - ');

    const filename = `Dues Report - ${filterParts}.xlsx`;

    console.log('Downloading file:', filename);

    XLSX.writeFile(workbook, filename);
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
        <Grid.Col span={2} style={{ display: 'flex', alignItems: 'end' }}>
          <Button
            rightSection={<IconDownload size={14} />}
            disabled={isListLoading}
            onClick={downloadAsExcel}
          >
            Download
          </Button>
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={4}>
          <Paper withBorder p="md" key="q" mb="md">
            <Group justify="apart">
              <div>
                <Text tt="uppercase" fw={700} fz="sm" c="indigo">
                  Total student(s)
                </Text>
                {isListLoading ? (
                  <Skeleton height={20} mt={10} />
                ) : (
                  <Text fw={700} fz="xl">
                    {listData.length}
                  </Text>
                )}
              </div>
            </Group>
          </Paper>
        </Grid.Col>
        <Grid.Col span={4}>
          <Paper withBorder p="md" key="q" mb="md">
            <Group justify="apart">
              <div>
                <Text tt="uppercase" fw={700} fz="sm" c="indigo">
                  Total Overdue
                </Text>
                {isListLoading ? (
                  <Skeleton height={20} mt={10} />
                ) : (
                  <Text fw={700} fz="xl">
                    <Currency
                      value={listData.reduce(
                        (acc: any, rec: any) => acc + rec?.totalOverdue,
                        0
                      )}
                    />
                  </Text>
                )}
              </div>
            </Group>
          </Paper>
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

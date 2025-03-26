import {
  ActionIcon,
  Box,
  Button,
  Group,
  Tabs,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import {
  IconCheck,
  IconEdit,
  IconPlus,
  IconSearch,
  IconUserCheck,
  IconUserPlus,
} from '@tabler/icons-react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  useEnrolledStudent,
  useGetEnrolledStudents,
  useGetStudents,
} from '../../services/students/apiQuery';
import tabStyles from '../../styles/Tab.module.scss';
import { showSuccessNotification } from '../../utils/notification';

export default function StudentsPage() {
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
      id: '',
      name: '',
      fatherName: '',
    },
    200
  );
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: '',
    direction: 'asc',
  });

  const {
    data: enrolledStudentLists = [],
    isFetching: isEnrolledStudentFetching,
    isFetched: isEnrolledStudentFetched,
    refetch: refetchEnrolledStudent,
  } = useGetEnrolledStudents();

  const {
    data: studentLists = [],
    isFetching: isStudentFetching,
    isFetched: isStudentFetched,
    refetch: refetchStudent,
  } = useGetStudents();

  useEffect(() => {
    if (type === 'enrolled' && isEnrolledStudentFetched) {
      setListData({
        data: enrolledStudentLists.data || [],
        totalRecords: (enrolledStudentLists.data || []).length,
        totalPages: 1,
        size: 10,
        page: 1,
      });
    }
    if (type === 'registration' && isStudentFetched) {
      setListData({
        data: studentLists.data || [],
        totalRecords: (studentLists.data || []).length,
        totalPages: 1,
        size: 10,
        page: 1,
      });
    }
  }, [
    type,
    isEnrolledStudentFetched,
    isStudentFetched,
    studentLists,
    enrolledStudentLists,
  ]);

  useEffect(() => {
    fetchList();
  }, [filters, sortStatus]);

  const fetchList = async (page: number | null = null) => {
    setIsListLoading(true);

    // try {
    //   const { data } = await httpClient.get(endpoints.students.list(), {
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

  const enrolled = useEnrolledStudent();

  function enrolledStudent({ id }: any) {
    enrolled.mutate(
      {
        id,
      },
      {
        onSuccess: () => {
          showSuccessNotification('Student enrolled successfully.');
          refetchStudent();
          refetchEnrolledStudent();
        },
      }
    );
  }

  return (
    <>
      <Group justify="space-between" align="center" mb="md">
        <Title size="lg">Students</Title>
        <Button
          variant="filled"
          leftSection={<IconPlus size={14} />}
          component={Link}
          to="/students/add"
        >
          Add
        </Button>
      </Group>
      <Tabs
        value={type}
        onChange={setType}
        my={10}
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
            accessor: 'recordNo',
            title: 'ID',
            sortable: true,
            filter: (
              <TextInput
                label="ID"
                leftSection={<IconSearch size={16} />}
                defaultValue={filters.id}
                onChange={(e) =>
                  setFilters({ ...filters, id: e.currentTarget.value })
                }
              />
            ),
            filtering: !!filters.id,
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
            accessor: 'fathersName',
            title: "Father's Name",
          },
          {
            accessor: 'mothersName',
            title: "Mother's Name",
          },
          {
            accessor: 'class',
            title: 'Class',
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
                    component={Link}
                    to={`/students/${row.id}/edit`}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                </Tooltip>
                {type == 'registration' && (
                  <Tooltip label="Enroll" withArrow>
                    <ActionIcon
                      size="sm"
                      variant="subtle"
                      onClick={() => enrolledStudent(row)}
                    >
                      <IconCheck size={16} />
                    </ActionIcon>
                  </Tooltip>
                )}
              </Group>
            ),
          },
        ]}
      />
    </>
  );
}

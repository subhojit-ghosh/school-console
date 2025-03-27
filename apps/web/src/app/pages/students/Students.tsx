import {
  ActionIcon,
  Box,
  Button,
  Group,
  Modal,
  Tabs,
  Text,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';
import { useDebouncedState, useDisclosure } from '@mantine/hooks';
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
import httpClient from '../../api/http-client';
import endpoints from '../../api/endpoints';

export default function StudentsPage() {
  const [type, setType] = useState<string | null>('enrolled');
  const [isListLoading, setIsListLoading] = useState(true);
  const [clickedStudent, setClickedStudent] = useState<any>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [listData, setListData] = useState<any>({
    data: [],
    totalRecords: 0,
    totalPages: 0,
    size: 10,
    page: 1,
  });
  const [filters, setFilters] = useDebouncedState(
    {
      enrolledNo: '',
      regId: '',
      name: '',
      fatherName: '',
    },
    200
  );
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: '',
    direction: 'asc',
  });

  // const {
  //   data: enrolledStudentLists = [],
  //   isFetching: isEnrolledStudentFetching,
  //   isFetched: isEnrolledStudentFetched,
  //   refetch: refetchEnrolledStudent,
  // } = useGetEnrolledStudents();

  // const {
  //   data: studentLists = [],
  //   isFetching: isStudentFetching,
  //   isFetched: isStudentFetched,
  //   refetch: refetchStudent,
  // } = useGetStudents();

  // useEffect(() => {
  //   if (type === 'enrolled' && isEnrolledStudentFetched) {
  //     setListData({
  //       data: enrolledStudentLists.data || [],
  //       totalRecords: (enrolledStudentLists.data || []).length,
  //       totalPages: 1,
  //       size: 10,
  //       page: 1,
  //     });
  //   }
  //   if (type === 'registration' && isStudentFetched) {
  //     setListData({
  //       data: studentLists.data || [],
  //       totalRecords: (studentLists.data || []).length,
  //       totalPages: 1,
  //       size: 10,
  //       page: 1,
  //     });
  //   }
  // }, [
  //   type,
  //   isEnrolledStudentFetched,
  //   isStudentFetched,
  //   studentLists,
  //   enrolledStudentLists,
  // ]);

  useEffect(() => {
    fetchList();
  }, [filters, sortStatus, type]);

  const fetchList = async (page: number | null = null) => {
    setIsListLoading(true);

    try {
      const { data } = await httpClient.get(endpoints.students.list(), {
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
          ...(type === 'enrolled'
            ? { isEnrolled: true, regId: undefined }
            : { isEnrolled: false, enrolledNo: undefined }),
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

  const enrolled = useEnrolledStudent();

  function enrolledStudent({ id }: any) {
    console.log('debug-id', id);
    enrolled.mutate(
      {
        id,
      },
      {
        onSuccess: () => {
          showSuccessNotification('Student enrolled successfully.');
          fetchList();
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
          type === 'enrolled'
            ? {
                accessor: 'enrolledNo',
                title: 'ID',
                sortable: true,
                filter: (
                  <TextInput
                    label="ID"
                    leftSection={<IconSearch size={16} />}
                    defaultValue={filters.enrolledNo}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        enrolledNo: e.currentTarget.value,
                      })
                    }
                  />
                ),
                filtering: !!filters.enrolledNo,
              }
            : {
                accessor: 'regId',
                title: 'ID',
                sortable: true,
                filter: (
                  <TextInput
                    label="ID"
                    leftSection={<IconSearch size={16} />}
                    defaultValue={filters.regId}
                    onChange={(e) =>
                      setFilters({ ...filters, regId: e.currentTarget.value })
                    }
                  />
                ),
                filtering: !!filters.regId,
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
                      onClick={() => {
                        setClickedStudent(row);
                        open();
                      }}
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

      <Modal
        opened={opened}
        withCloseButton={false}
        onClose={() => {}}
        centered
        size="sm"
        padding="lg"
      >
        <Text size="sm" fw={600}>
          Are you sure you want to enroll this student?
        </Text>
        <Group justify="flex-end" gap="sm" align="center" mt="lg">
          <Button onClick={close} size="xs" variant="default">
            Close
          </Button>
          <Button
            size="xs"
            color="indigo"
            onClick={() => enrolledStudent(clickedStudent)}
          >
            Enroll
          </Button>
        </Group>
      </Modal>
    </>
  );
}

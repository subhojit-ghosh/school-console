import {
  ActionIcon,
  Box,
  Button,
  Group,
  NumberInput,
  Select,
  Text,
  TextInput,
  ThemeIcon,
  Title,
  Tooltip,
} from '@mantine/core';
import { randomId, useDebouncedState } from '@mantine/hooks';
import {
  IconCalendarStats,
  IconCurrencyRupee,
  IconDeviceFloppy,
  IconEdit,
  IconPencil,
  IconPlus,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import moment from 'moment';
import { useEffect, useState } from 'react';
import endpoints from '../../api/endpoints';
import httpClient from '../../api/http-client';
import Currency from '../../components/Currency';
import IsAccessiable from '../../components/IsAccessiable';
import { academicFeeNames } from '../../data/academic-fee-names';
import { DateInput } from '@mantine/dates';
import { AcademicFeesRecord } from '../../types/academicFees';
import {
  showErrorNotification,
  showSuccessNotification,
} from '../../utils/notification';

export default function AcademicFees() {
  const academicFeeLabelsList = academicFeeNames
    .filter((rec) => rec.value !== 'Other')
    .map((rec) => rec.label);
  const academicFeeNamesObj = academicFeeNames.reduce(
    (acc, item) => ({
      ...acc,
      [item.value]: item.label,
    }),
    {}
  );
  const [isListLoading, setIsListLoading] = useState(true);
  const [toggleEdit, setToggleEdit] = useState<boolean>(false);
  const [listData, setListData] = useState<{
    data: AcademicFeesRecord[];
    totalRecords: number;
    totalPages: number;
    size: number;
    page: number;
  }>({
    data: [],
    totalRecords: 0,
    totalPages: 0,
    size: 100,
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
    setToggleEdit(false);
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

      const existsNames = data.data.reduce(
        (acc: any, rec: AcademicFeesRecord) => ({
          ...acc,
          [rec.name]: { ...rec },
        }),
        {}
      );

      let tbData: AcademicFeesRecord[] = academicFeeNames
        .filter((rec) => rec.label !== 'Other')
        .map((rec: { value: string; label: string }, index: number) => {
          if (existsNames[rec.value]) {
            return {
              uid: randomId(),
              ...existsNames[rec.value],
            };
          }
          return {
            uid: randomId(),
            id: null,
            academicYearId: filters.academicYearId,
            classId: filters.classId,
            name: rec.value,
            amount: 0,
            dueDate: undefined,
          };
        });

      data.data.forEach((ele: AcademicFeesRecord) => {
        if (!academicFeeLabelsList.includes(ele.name)) {
          tbData = [
            ...tbData,
            {
              ...ele,
              uid: randomId(),
            },
          ];
        }
      });

      setListData({
        ...listData,
        ...data,
        data: tbData.map((rec: any, index: any) => ({ ...rec, index })),
      });
    } catch (error) {
      console.error(error);
    }

    setIsListLoading(false);
  };

  const onChangeInput = (v: any, key: string, index: number) => {
    const data: any = listData;
    data.data[index][key] = v;
    setListData({ ...data });
  };

  function addNewRow() {
    let { data }: { data: any } = listData;
    data.push({
      index: listData.data.length,
      id: null,
      academicYearId: filters.academicYearId,
      classId: filters.classId,
      name: null,
      amount: 0,
      dueDate: null,
    });

    setListData({
      ...listData,
      data: [...data],
    });
  }

  function handleSubmit() {
    let isError: boolean = false;
    listData.data.every((rec: AcademicFeesRecord, index) => {
      if (!rec.name) {
        isError = true;
        showErrorNotification(`Name is required on row no ${index + 1}`);
        return false;
      }
      return true;
    });

    if (!isError) {
      httpClient
        .post(
          endpoints.academicFees.bulkAddEdit(),
          listData.data.map((rec) => ({
            ...rec,
            id: rec.id ? rec.id : undefined,
            academicYearId: Number(rec.academicYearId),
            classId: Number(rec.classId),
            index: undefined,
            dueDate: rec.dueDate
              ? moment(rec.dueDate).format('YYYY-MM-DD')
              : undefined,
          }))
        )
        .then((res) => {
          showSuccessNotification('Data Edited Successfully.');
          fetchList();
        })
        .catch((error) => {
          if (error.response) {
            showErrorNotification(`${error.response.data}`);
          }
        });
    }
  }

  function deleteRow(id: number) {
    httpClient
      .post(endpoints.academicFees.deleteById(id.toString()), {})
      .then((res) => {
        setToggleEdit(false);
        showSuccessNotification('Record Deleted Successfully.');
        fetchList();
      })
      .catch((error) => {
        if (error.response) {
          showErrorNotification(`${error.response.data}`);
        }
      });
  }

  return (
    <>
      <Group justify="space-between" align="center" mb="md">
        <Title size="lg">Academic Fees</Title>
      </Group>
      <Group justify="space-between" align="flex-end" my={10}>
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
            leftSection={
              !toggleEdit ? <IconPencil size={14} /> : <IconX size={14} />
            }
            onClick={() => {
              // setFormMode('add');
              // setFormData(null);
              // setFormOpened(true);
              setToggleEdit(!toggleEdit);
            }}
          >
            {!toggleEdit ? 'Edit' : 'Cancel'}
          </Button>
        </IsAccessiable>
      </Group>

      {!toggleEdit && (
        <DataTable
          withTableBorder
          withColumnBorders
          borderRadius="sm"
          striped
          highlightOnHover
          minHeight={300}
          fetching={isListLoading}
          records={listData.data}
          sortStatus={sortStatus}
          onSortStatusChange={setSortStatus}
          columns={[
            {
              accessor: '',
              title: '#',
              sortable: false,
              //@ts-ignore
              render: (row: any) => listData.data.indexOf(row) + 1,
            },
            {
              accessor: 'name',
              title: 'Name',
              // sortable: true,
              render: (row: any) => (
                <Text size="xs" lh={0}>
                  {row.name}
                </Text>
              ),
            },
            {
              accessor: 'amount',
              title: 'Amount',
              width: 207,
              render: (row: any) => <Currency value={row.amount} />,
              // sortable: true,
            },
            {
              accessor: 'dueDate',
              title: 'Due Date',
              render: (row: any) =>
                row.dueDate ? moment(row.dueDate).format('MMMM DD, YYYY') : '',
              // sortable: true,
            },
            {
              accessor: 'action',
              title: '',
              width: 50,
              render: (row: any) =>
                !academicFeeLabelsList.includes(row.name) && (
                  <Tooltip label="Delete Row">
                    <ActionIcon
                      variant="transparent"
                      p={0}
                      m={0}
                      onClick={() => deleteRow(row.id)}
                    >
                      <ThemeIcon color="red" variant="outline">
                        <IconTrash size={16} />
                      </ThemeIcon>
                    </ActionIcon>
                  </Tooltip>
                ),
            },
          ]}
          idAccessor="uid"
        />
      )}

      {toggleEdit && (
        <DataTable
          withTableBorder
          withColumnBorders
          borderRadius="sm"
          striped
          highlightOnHover
          minHeight={300}
          fetching={isListLoading}
          records={listData.data}
          sortStatus={sortStatus}
          onSortStatusChange={setSortStatus}
          columns={[
            {
              accessor: '',
              title: '#',
              sortable: false,
              //@ts-ignore
              render: (row: any) => listData.data.indexOf(row) + 1,
            },
            {
              accessor: 'name',
              title: 'Name',
              // sortable: true,
              render: (row: any) =>
                !academicFeeLabelsList.includes(row.name) && toggleEdit ? (
                  <TextInput
                    size="xs"
                    value={row.name}
                    onChange={(e) =>
                      onChangeInput(e.target.value, 'name', row.index)
                    }
                    error={!row.name && 'This field is required.'}
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
                    onChange={(e) => onChangeInput(e || 0, 'amount', row.index)}
                  />
                ),
              // sortable: true,
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
              // sortable: true,
            },
          ]}
          idAccessor="uid"
        />
      )}

      {toggleEdit && (
        <Group justify="right" align="center" mt="sm">
          <Button onClick={addNewRow} leftSection={<IconPlus size={14} />}>
            Add Row
          </Button>
          <Button
            onClick={handleSubmit}
            leftSection={<IconDeviceFloppy size={16} />}
          >
            Save
          </Button>
        </Group>
      )}
    </>
  );
}

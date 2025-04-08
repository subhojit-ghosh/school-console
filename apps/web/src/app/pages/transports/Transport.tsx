import {
  ActionIcon,
  Box,
  Button,
  Grid,
  Group,
  Modal,
  MultiSelect,
  NumberInput,
  Select,
  Skeleton,
  Text,
  TextInput,
  ThemeIcon,
  Title,
  Tooltip,
} from '@mantine/core';
import {
  IconChevronDown,
  IconChevronLeft,
  IconPrinter,
  IconSettings,
  IconX,
} from '@tabler/icons-react';
import {
  useGetAcadDropdown,
  useGetClasses,
  useGetStudentsByClassIdDropwdown,
  useGetTransportTakenStudentsByClassIdDropwdown,
} from '../../services/utils/apiQuery';
import { useEffect, useRef, useState } from 'react';
import {
  useGetTransportFeeDropdownItemsByStudentAcadId,
  useGetTransportFeeItemById,
  useGetTransportListByAcadId,
  useGetTransportReceiptById,
  useGetTransportSettingByAcadId,
  useSaveTransportFee,
  useSaveTransportSetting,
} from '../../services/transports/apiQuery';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { showSuccessNotification } from '../../utils/notification';
import { DataTable } from 'mantine-datatable';
import classes from './NestedTable.module.css';
import classNames from 'classnames';
import moment from 'moment';
import { modals } from '@mantine/modals';
import IsAccessiable from '../../components/IsAccessiable';

export default function TransportPage() {
  const [acadId, setAcadId] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [receiptLoadingId, setReceiptLoadingId] = useState<number | null>(null);

  const [months, setMonths] = useState<any>([
    {
      value: '1',
      label: 'January',
    },
    {
      value: '2',
      label: 'February',
    },
    {
      value: '3',
      label: 'March',
    },
    {
      value: '4',
      label: 'April',
    },
    {
      value: '5',
      label: 'May',
    },
    {
      value: '6',
      label: 'June',
    },
    {
      value: '7',
      label: 'July',
    },
    {
      value: '8',
      label: 'August',
    },
    {
      value: '9',
      label: 'September',
    },
    {
      value: '10',
      label: 'Ocotober',
    },
    {
      value: '11',
      label: 'November',
    },
    {
      value: '12',
      label: 'December',
    },
  ]);
  const [expandedTransportIds, setExpandedTransportIds] = useState<string[]>(
    []
  );
  const transportSettingInitialValue = {
    id: null,
    academicYearId: null,
    baseAmount: null,
    perKmCharge: null,
  };
  const transportFeeInitialValue = {
    id: undefined,
    academicYearId: undefined,
    classId: undefined,
    studentId: undefined,
    baseAmount: undefined,
    perKmCharge: undefined,
    months: [],
    amount: undefined,
    mode: undefined,
    note: undefined,
  };
  const [opened, { open, close }] = useDisclosure(false);
  const [openTransportFee, handlers] = useDisclosure(false);
  const form = useForm<{
    id?: string | null;
    academicYearId: string | null;
    baseAmount: number | null;
    perKmCharge: number | null;
  }>({
    initialValues: transportSettingInitialValue,
    validate: {
      academicYearId: (v) => (!v ? 'Field is required' : null),
      baseAmount: (v) => (!v ? 'Field is required' : null),
      perKmCharge: (v) => (!v ? 'Field is required' : null),
    },
  });

  const transportFeeForm = useForm<{
    id?: string | null | undefined;
    academicYearId: string | null | undefined;
    classId: string | null | undefined;
    studentId: string | null | undefined;
    months: string[] | null | undefined;
    baseAmount: number | null | undefined;
    perKmCharge: number | null | undefined;
    amount: number | null | undefined;
    mode: string | null | undefined;
    note: string | null | undefined;
  }>({
    initialValues: transportFeeInitialValue,
    validate: {
      academicYearId: (v) => (!v ? 'Field is required' : null),
      months: (v) => (!v?.length ? 'Field is required' : null),
      classId: (v) => (!v ? 'Field is required' : null),
      studentId: (v) => (!v ? 'Field is required' : null),
      baseAmount: (v) => (!v ? 'Field is required' : null),
      perKmCharge: (v) => (!v ? 'Field is required' : null),
      mode: (v) => (!v ? 'Field is required' : null),
    },
  });

  const { data: academicYears = [] } = useGetAcadDropdown();
  const { data: classLists = [] } = useGetClasses();
  const { data: studentsList = [] } =
    useGetTransportTakenStudentsByClassIdDropwdown(
      transportFeeForm.getValues().classId as string
    );
  const { data: transportSettingByAcadId = {}, refetch } =
    useGetTransportSettingByAcadId(acadId as any);

  const {
    data: feeItemsList = {},
    isFetching: feeItemIsFetching,
    isFetched: feeItemIsFetched,
  } = useGetTransportFeeDropdownItemsByStudentAcadId(
    transportFeeForm.getValues().academicYearId || '',
    transportFeeForm.getValues().studentId || ''
  );

  const {
    data: tableList = [],
    isFetching: tableIsFetching,
    refetch: tableListRefetch,
  } = useGetTransportListByAcadId(acadId || '');

  const {
    data: tableDetailList = [],
    isFetching: tableDetailIsFetching,
    refetch: tableDetailRefetch,
  } = useGetTransportFeeItemById(
    expandedTransportIds.length > 0 ? expandedTransportIds[0] : ''
  );
  const saveTransportSetting = useSaveTransportSetting();
  const saveTransportFee = useSaveTransportFee();
  const receptTransport = useGetTransportReceiptById();

  useEffect(() => {
    if (feeItemIsFetched) {
      setMonths((pState: any) => {
        return (pState || []).map((item: any) => ({
          ...item,
          disabled: (feeItemsList.feeItems || [])
            .map((rItem: { month: number }) => rItem.month.toString())
            .includes(item.value.toString()),
        }));
      });
    }
  }, [feeItemIsFetched, feeItemsList]);

  useEffect(() => {
    const activeYr = academicYears.filter((item: any) => item.isActive);
    if (activeYr.length > 0) setAcadId(String(activeYr[0].id));
  }, [academicYears]);

  useEffect(() => {
    if (transportSettingByAcadId.id) {
      form.setValues({
        ...transportSettingByAcadId,
        academicYearId: String(transportSettingByAcadId.academicYearId),
      });
      transportFeeForm.setValues({
        ...transportSettingByAcadId,
        academicYearId: String(transportSettingByAcadId.academicYearId),
        amount: 0,
      });
    } else
      form.setValues({
        ...transportSettingInitialValue,
        academicYearId: String(acadId),
      });
  }, [transportSettingByAcadId]);

  function onSaveTransportSetting(e: any) {
    saveTransportSetting.mutate(
      { ...e, academicYearId: Number(e.academicYearId) },
      {
        onSuccess: () => {
          showSuccessNotification('Setting(s) Updated Successfully.');
          refetch();
          close();
        },
      }
    );
  }

  function calculateAmount(monthArr: any) {
    return monthArr.length === 0
      ? 0
      : (transportFeeForm.values.baseAmount || 0) +
          Number(
            (transportFeeForm.values.perKmCharge || 0) *
              (feeItemsList.studentRecord.isTransportTaken
                ? feeItemsList.studentRecord.transportKm * 2
                : 1)
          ) *
            monthArr.length;
  }

  function resetTransportFeeForm() {
    transportFeeForm.setValues({
      classId: '',
      studentId: '',
      months: [],
      amount: undefined,
      mode: '',
      note: '',
    });
  }

  function onSaveTransportFee(e: any) {
    modals.openConfirmModal({
      title: 'Confirmation',
      children: (
        <Text size="sm">
          Are you sure you want to save this transaction? This action cannot be
          undone.
        </Text>
      ),
      centered: true,
      labels: { confirm: 'Save', cancel: 'Cancel' },
      onConfirm: () => {
        saveTransportFee.mutate(
          {
            ...e,
            academicYearId: Number(e.academicYearId),
            baseAmount: Number(e.baseAmount),
            perKmCharge: Number(e.perKmCharge),
            amount: Number(e.amount),
            payableAmount: calculateAmount(transportFeeForm.values.months),
            studentId: Number(e.studentId),
          },
          {
            onSuccess: () => {
              showSuccessNotification('Record Created');
              handlers.close();
              resetTransportFeeForm();
              tableListRefetch();
              setExpandedTransportIds([]);
            },
          }
        );
      },
    });
  }

  function getReceiptById(id: any) {
    setReceiptLoadingId(id);
    receptTransport.mutate(
      { id },
      {
        onSuccess: (pdfUrl) => {
          if (iframeRef.current) {
            iframeRef.current.src = pdfUrl;
            iframeRef.current.onload = () => {
              iframeRef.current?.contentWindow?.print();
            };
          }
          setReceiptLoadingId(null);
        },
        onError: () => {
          setReceiptLoadingId(null);
        },
      }
    );
  }

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="Manage Transport Setting(s)"
        size="lg"
        centered={true}
      >
        <form onSubmit={form.onSubmit((e) => onSaveTransportSetting(e))}>
          <Grid columns={12} mb="lg">
            <Grid.Col span={4}>
              {academicYears.length ? (
                <Select
                  label="Academic Year"
                  placeholder="Select"
                  data={academicYears || []}
                  withAsterisk
                  {...form.getInputProps('academicYearId')}
                  disabled
                  nothingFoundMessage="No record(s) found"
                />
              ) : (
                <Skeleton height={50} mt={10}></Skeleton>
              )}
            </Grid.Col>
            <Grid.Col span={4}>
              <NumberInput
                label="Base Amount"
                withAsterisk
                min={1}
                hideControls={true}
                {...form.getInputProps('baseAmount')}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <NumberInput
                label="Charge Per (K.M)"
                withAsterisk
                min={1}
                hideControls={true}
                {...form.getInputProps('perKmCharge')}
              />
            </Grid.Col>
          </Grid>
          <Group justify="flex-end" align="center" gap="xs">
            <Button size="sm" variant="default" onClick={close}>
              Close
            </Button>
            <Button size="sm" type="submit">
              Save
            </Button>
          </Group>
        </form>
      </Modal>

      <Modal
        opened={openTransportFee}
        onClose={handlers.close}
        title="Add Transport Fee(s)"
        size="xl"
        centered={true}
      >
        <form
          onSubmit={transportFeeForm.onSubmit((e) => onSaveTransportFee(e))}
        >
          <Grid columns={12} mb="lg">
            <Grid.Col span={3}>
              {academicYears.length ? (
                <Select
                  label="Academic Year"
                  placeholder="Select"
                  data={academicYears || []}
                  withAsterisk
                  {...form.getInputProps('academicYearId')}
                  disabled
                  nothingFoundMessage="No record(s) found"
                />
              ) : (
                <Skeleton height={50} mt={10}></Skeleton>
              )}
            </Grid.Col>
            <Grid.Col span={3}>
              <Select
                label="Class"
                withAsterisk
                data={classLists}
                {...transportFeeForm.getInputProps('classId')}
                key={transportFeeForm.key('classId')}
                onChange={(dt) => {
                  transportFeeForm.setValues({
                    classId: dt,
                    studentId: null,
                    months: [],
                    amount: 0,
                  });
                }}
                allowDeselect={false}
                nothingFoundMessage="No record(s) found"
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <Select
                label="Student"
                withAsterisk
                data={studentsList}
                {...transportFeeForm.getInputProps('studentId')}
                key={transportFeeForm.key('studentId')}
                nothingFoundMessage="No record(s) found"
                allowDeselect={false}
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <MultiSelect
                label="Select Month(s)"
                data={months}
                withAsterisk
                {...transportFeeForm.getInputProps('months')}
                onChange={(dt) => {
                  transportFeeForm.setValues({
                    months: [...dt],
                    amount: calculateAmount(dt),
                  });
                }}
                disabled={!transportFeeForm.getValues().studentId}
                nothingFoundMessage="No record(s) found"
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <NumberInput
                label="Base Amount"
                withAsterisk
                min={1}
                hideControls={true}
                disabled={true}
                {...transportFeeForm.getInputProps('baseAmount')}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <Group align="center" justify="flex-start" gap={2} mt="lg">
                <Text size="sm">Charge</Text>
                <Text fw="bold" fs="italic" size="sm">
                  @ ₹{transportFeeForm.values.perKmCharge}/-
                </Text>
                <IconX size="15" />
                <Text size="md" fw="bold">
                  {(feeItemsList.studentRecord &&
                    feeItemsList.studentRecord.transportKm * 2) ||
                    ''}{' '}
                  Km.
                </Text>
              </Group>
              <Text></Text>
              {/* <NumberInput
                label="Per Km Charge"
                withAsterisk
                min={1}
                hideControls={true}
                disabled={true}
                {...transportFeeForm.getInputProps('perKmCharge')}
              /> */}
            </Grid.Col>
            <Grid.Col span={4}>
              <NumberInput
                label="Amount"
                withAsterisk
                min={1}
                hideControls={true}
                // disabled={true}
                {...transportFeeForm.getInputProps('amount')}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <Select
                label="Mode"
                data={['Cash', 'Cheque', 'UPI']}
                withAsterisk
                {...transportFeeForm.getInputProps('mode')}
                nothingFoundMessage="No record(s) found"
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Note"
                {...transportFeeForm.getInputProps('note')}
              />
            </Grid.Col>
          </Grid>
          <Group justify="flex-end" align="center" gap="xs">
            <Button size="sm" variant="default" onClick={handlers.close}>
              Close
            </Button>
            <Button size="sm" type="submit">
              Save
            </Button>
          </Group>
        </form>
      </Modal>

      <Group justify="space-between" align="center" mb="md">
        <Title size="lg">Transport</Title>
        <IsAccessiable>
          <ActionIcon color="indigo" variant="transparent" onClick={open}>
            <ThemeIcon variant="transparent">
              <IconSettings />
            </ThemeIcon>
          </ActionIcon>
        </IsAccessiable>
      </Group>
      <Group justify="space-between" align="center" mb="md">
        {academicYears.length ? (
          <Select
            label="Academic Year"
            placeholder="Select"
            data={academicYears || []}
            withAsterisk
            value={acadId}
            onChange={setAcadId}
            nothingFoundMessage="No record(s) found"
          />
        ) : (
          <Skeleton height={50} mt={10}></Skeleton>
        )}
        <Button
          onClick={() => {
            resetTransportFeeForm();
            handlers.open();
          }}
        >
          Add New
        </Button>
      </Group>

      <DataTable
        withTableBorder
        withColumnBorders
        striped
        highlightOnHover
        columns={[
          {
            accessor: 'id',
            title: '#',
            render: (record) => tableList?.indexOf(record) + 1,
          },
          { accessor: 'studentName' },
          { accessor: 'baseAmount' },
          { accessor: 'perKmCharge' },
          { accessor: 'amount' },
          { accessor: 'mode' },
          { accessor: 'note' },
          {
            accessor: 'createdAt',
            render: (dt) => moment(dt.createdAt).format('DD/MM/YYYY'),
          },
          {
            accessor: 'actions',
            render: ({ id }) => (
              <>
                <Group gap={4} wrap="nowrap">
                  <IconChevronLeft
                    className={classNames(classes.icon, classes.expandIcon, {
                      [classes.expandIconRotated]:
                        expandedTransportIds.includes(id),
                    })}
                  />
                  <Tooltip label="Print">
                    <ActionIcon
                      size="sm"
                      variant="subtle"
                      onClick={(e) => {
                        e.stopPropagation();
                        getReceiptById(id);
                      }}
                      loading={receiptLoadingId === id}
                    >
                      <IconPrinter size={16} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </>
            ),
          },
        ]}
        records={tableList || []}
        minHeight={150}
        fetching={tableIsFetching}
        rowExpansion={{
          allowMultiple: false,
          expanded: {
            recordIds: expandedTransportIds,
            onRecordIdsChange: setExpandedTransportIds,
          },
          content: () => (
            <Box bg="gray.1" p="sm">
              <DataTable
                withTableBorder
                withColumnBorders
                striped
                highlightOnHover
                columns={[
                  {
                    accessor: 'id',
                    title: '#',
                    render: (record) => tableDetailList?.indexOf(record) + 1,
                  },
                  {
                    accessor: 'month',
                    render: (dt) => {
                      return [
                        'January',
                        'February',
                        'March',
                        'April',
                        'May',
                        'June',
                        'July',
                        'August',
                        'September',
                        'October',
                        'November',
                        'December',
                      ][dt.month - 1];
                    },
                  },
                ]}
                records={tableDetailList || []}
                minHeight={150}
                fetching={tableDetailIsFetching}
              />
            </Box>
          ),
        }}
      />
      <iframe title="Receipt" ref={iframeRef} style={{ display: 'none' }} />
    </>
  );
}

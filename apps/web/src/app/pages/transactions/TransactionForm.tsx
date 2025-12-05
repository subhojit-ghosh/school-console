import {
  Badge,
  Button,
  Checkbox,
  Grid,
  Group,
  NumberInput,
  Paper,
  Select,
  Skeleton,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import { IconArrowBack } from '@tabler/icons-react';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import endpoints from '../../api/endpoints';
import httpClient from '../../api/http-client';
import Currency from '../../components/Currency';
import {
  useGetTrasnsactionReceiptById,
  useSaveTransactionFee,
} from '../../services/transactions/apiQuery';
import {
  showInfoNotification,
  showSuccessNotification,
} from '../../utils/notification';
import { modals } from '@mantine/modals';

export default function TransactionForm() {
  const [academicYears, setAcademicYears] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [studentSearchValue, setStudentSearchValue] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  const [fees, setFees] = useState<any>(null);
  const [feesRight, setFeesRight] = useState<any>([]);
  const [feesLoading, setFeesLoading] = useState<any>(false);
  const [saving, setSaving] = useState<any>(false);
  const receptTransaction = useGetTrasnsactionReceiptById();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const form = useForm<{
    academicYearId: any;
    classId: any;
    studentId: any;
    mode: any;
    note: any;
  }>({
    validateInputOnChange: true,
    initialValues: {
      academicYearId: null,
      classId: null,
      studentId: null,
      mode: null,
      note: '',
    },
    validate: yupResolver(
      yup.object().shape({
        academicYearId: yup
          .string()
          .trim()
          .required('Academic Year is required'),
        classId: yup.string().trim().required('Class is required'),
        studentId: yup.string().trim().required('Student is required'),
        mode: yup.string().trim().required('Mode is required'),
      })
    ),
  });

  useEffect(() => {
    fetchAcademicYears();
    fetchClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (form.values.classId) {
      form.setFieldValue('studentId', null);
      setStudentSearchValue('');
      setFees(null);
      setFeesRight([]);
      fetchStudents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values.classId]);

  useEffect(() => {
    if (form.values.studentId) {
      fetchFees();
      setFeesRight([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values.studentId]);

  const fetchAcademicYears = async () => {
    try {
      const { data } = await httpClient.get(endpoints.academicYears.dropdown());
      setAcademicYears(data.data);
      const currentAcademicYear = data.data.find((item: any) => item.isActive);
      form.setFieldValue('academicYearId', String(currentAcademicYear.id));
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

  const fetchStudents = async () => {
    try {
      const { data } = await httpClient.get(endpoints.students.list(), {
        params: {
          size: 9999,
          classId: form.values.classId,
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

  const fetchFees = async () => {
    setFeesLoading(true);
    try {
      const { data } = await httpClient.get(
        endpoints.transactions.fees(
          form.values.academicYearId,
          form.values.classId,
          form.values.studentId
        )
      );
      setFees({
        ...data,
        feesWithDue: data.feesWithDue.map((rec: any) => ({
          ...rec,
          isChecked: false,
          disabled: !rec.totalDue,
        })),
      });
    } catch (error) {
      console.error(error);
    }
    setFeesLoading(false);
  };

  const saveTransacriotnFee = useSaveTransactionFee();

  function resetForm() {
    form.setValues({
      studentId: null,
      mode: null,
      note: null,
    });
    setFees(null);
    setFeesRight([]);
  }

  const handleSubmit = async () => {
    console.log(form.values);
    let isGreaterError = false;
    feesRight.every((item: any, index: number) => {
      if (Number(item.concession) + Number(item.paid) > item.totalDue) {
        isGreaterError = true;
        showInfoNotification(
          `Sum of concession & paid can not be greater than total due which is ${
            item.totalDue
          } for item ${item.name} at row ${index + 1}`
        );
        return false;
      }
      return true;
    });
    if (isGreaterError) return;
    const payload = {
      academicYearId: Number(form.values.academicYearId),
      classId: Number(form.values.classId),
      studentId: Number(form.values.studentId),
      mode: form.values.mode,
      note: form.values.note,
      items: feesRight.map((rec: any) => ({
        academicFeeId: rec.id,
        concession: Number(rec.concession),
        paid: Number(rec.paid),
      })),
    };

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
        setSaving(true);
        setSaving(true);
        saveTransacriotnFee.mutate(
          {
            ...payload,
          },
          {
            onSuccess: (response) => {
              showSuccessNotification('Transaction saved successfully');
              receptTransaction.mutate(
                { id: response.id },
                {
                  onSuccess: (pdfUrl) => {
                    if (iframeRef.current) {
                      iframeRef.current.src = pdfUrl;

                      iframeRef.current.onload = () => {
                        iframeRef.current?.contentWindow?.print();
                        resetForm();
                        setSaving(false);
                      };
                    }
                  },
                }
              );
            },
          }
        );
      },
    });
  };

  function onChangeChekbox(checked: boolean, item: any) {
    let items: any = feesRight || [];
    if (checked) {
      items.push({ ...item, concession: '', paid: String(item.totalDue) });
    } else {
      items = items.filter((rec: any) => rec.id !== item.id);
    }
    setFeesRight([...items]);
  }

  function onConcessionChange(v: number, index: number) {
    const items: any = feesRight || [];
    items[index].concession = v;
    items[index].paid = items[index].totalDue - v;
    setFeesRight([...items]);
  }

  function onPaidChange(v: number, index: number) {
    const items: any = feesRight || [];
    items[index].paid = v;
    setFeesRight([...items]);
  }

  return (
    <>
      <Group justify="space-between" align="center" mb="md">
        <Title size="lg">New Transaction</Title>
        <Button
          variant="light"
          leftSection={<IconArrowBack size={14} />}
          component={Link}
          to="/transactions"
        >
          Back
        </Button>
      </Group>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Paper withBorder shadow="md" p="md">
          <Grid>
            <Grid.Col span={12}>
              <Grid>
                <Grid.Col span={2}>
                  {academicYears.length ? (
                    <Select
                      label="Academic Year"
                      placeholder="Select"
                      data={academicYears.map((item: any) => ({
                        label: item.name,
                        value: String(item.id),
                      }))}
                      withAsterisk
                      {...form.getInputProps('academicYearId')}
                    />
                  ) : (
                    <Skeleton height={50} mt={10}></Skeleton>
                  )}
                </Grid.Col>
                <Grid.Col span={2}>
                  <Select
                    label="Class"
                    placeholder="Select"
                    data={classes.map((item: any) => ({
                      label: item.name,
                      value: String(item.id),
                    }))}
                    withAsterisk
                    {...form.getInputProps('classId')}
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
                    withAsterisk
                    allowDeselect
                    value={form.values.studentId}
                    {...form.getInputProps('studentId')}
                  />
                </Grid.Col>
              </Grid>
            </Grid.Col>
            {feesLoading && (
              <Grid.Col span={6}>
                <Skeleton height={20} mb={5} />
                <Skeleton height={20} mb={5} />
                <Skeleton height={20} mb={5} />
                <Skeleton height={20} mb={5} />
                <Skeleton height={20} mb={5} />
                <Skeleton height={20} mb={5} />
                <Skeleton height={20} mb={5} />
                <Skeleton height={20} mb={5} />
                <Skeleton height={20} mb={5} />
                <Skeleton height={20} mb={5} />
                <Skeleton height={20} mb={5} />
                <Skeleton height={20} mb={5} />
              </Grid.Col>
            )}
            {fees && !feesLoading && (
              <>
                <Grid.Col span={6}>
                  <Grid>
                    <Grid.Col span={4}>
                      <Text>Total Paid</Text>
                      <Badge color="teal">
                        <Currency value={fees.stats.totalPaid} />
                      </Badge>
                    </Grid.Col>
                    <Grid.Col span={4}>
                      <Text>Total Due</Text>
                      <Badge color="orange">
                        <Currency value={fees.stats.totalDue} />
                      </Badge>
                    </Grid.Col>
                    <Grid.Col span={4}>
                      <Text>Over Due</Text>
                      <Badge color="red">
                        <Currency value={fees.stats.overDue} />
                      </Badge>
                    </Grid.Col>
                    <Grid.Col span={12}>
                      <Table
                        withTableBorder
                        withColumnBorders
                        style={{
                          fontSize: 13,
                        }}
                      >
                        <Table.Thead>
                          <Table.Tr>
                            <Table.Th>Name</Table.Th>
                            <Table.Th>Amount</Table.Th>
                            <Table.Th>Due</Table.Th>
                          </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                          {fees.feesWithDue.map((item: any) => (
                            <Table.Tr key={item.id}>
                              <Table.Td>
                                <Checkbox
                                  size="sm"
                                  label={item.name}
                                  disabled={item.disabled}
                                  onChange={(e) =>
                                    onChangeChekbox(e.target.checked, item)
                                  }
                                />
                              </Table.Td>
                              <Table.Td>
                                <Currency value={item.amount} />
                              </Table.Td>
                              <Table.Td
                                style={{
                                  color:
                                    item.totalDue === 0
                                      ? 'green'
                                      : item.isOverdue
                                      ? 'red'
                                      : 'black',
                                }}
                              >
                                <Currency value={item.totalDue} />{' '}
                                {!!(item.dueDate && item.totalDue) &&
                                  `(${moment(item.dueDate).format(
                                    'DD-MMM-YYYY'
                                  )})`}
                              </Table.Td>
                            </Table.Tr>
                          ))}
                        </Table.Tbody>
                      </Table>
                    </Grid.Col>
                  </Grid>
                </Grid.Col>
                <Grid.Col span={6}>
                  {!!feesRight.length && (
                    <Grid>
                      <Grid.Col span={12} mt="65">
                        <Table
                          withTableBorder
                          withColumnBorders
                          style={{
                            fontSize: 13,
                          }}
                        >
                          <Table.Thead>
                            <Table.Tr>
                              <Table.Th>Name</Table.Th>
                              <Table.Th>Due</Table.Th>
                              <Table.Th style={{ width: 110 }}>
                                Concession
                              </Table.Th>
                              <Table.Th style={{ width: 110 }}>
                                Payable
                              </Table.Th>
                              <Table.Th style={{ width: 110 }}>Paid</Table.Th>
                            </Table.Tr>
                          </Table.Thead>

                          <Table.Tbody>
                            {feesRight.map((item: any, index: number) => (
                              <Table.Tr key={item.id}>
                                <Table.Td>
                                  <Text size="sm">{item.name}</Text>
                                </Table.Td>
                                <Table.Td>
                                  <p>
                                    <Currency value={item.totalDue} />
                                  </p>
                                  {!!item.lateFine && (
                                    <p style={{ color: 'red' }}>
                                      <Currency value={item.lateFine} /> (
                                      {item.lateDays}d)
                                    </p>
                                  )}
                                </Table.Td>

                                <Table.Td>
                                  <NumberInput
                                    hideControls
                                    min={0}
                                    value={item.concession}
                                    onChange={(e) =>
                                      onConcessionChange(Number(e), index)
                                    }
                                    prefix="₹"
                                    thousandSeparator=","
                                  />
                                </Table.Td>
                                <Table.Td>
                                  <p>
                                    <Currency value={item.totalDue} />
                                  </p>
                                </Table.Td>
                                <Table.Td>
                                  <NumberInput
                                    hideControls
                                    min={0}
                                    value={item.paid}
                                    onChange={(e) =>
                                      onPaidChange(Number(e), index)
                                    }
                                    prefix="₹"
                                    thousandSeparator=","
                                  />
                                </Table.Td>
                              </Table.Tr>
                            ))}
                            <Table.Tr className="font-bold">
                              <Table.Td>Total</Table.Td>
                              <Table.Td>
                                <Currency
                                  value={feesRight.reduce(
                                    (acc: number, item: any) =>
                                      acc + Number(item.totalDue),
                                    0
                                  )}
                                />
                              </Table.Td>
                              <Table.Td>
                                <Currency
                                  value={feesRight.reduce(
                                    (acc: number, item: any) =>
                                      acc + Number(item.concession),
                                    0
                                  )}
                                />
                              </Table.Td>
                              <Table.Td>
                                <Currency
                                  value={feesRight.reduce(
                                    (acc: number, item: any) =>
                                      acc + Number(item.totalDue),
                                    0
                                  )}
                                />
                              </Table.Td>
                              <Table.Td>
                                <Currency
                                  value={feesRight.reduce(
                                    (acc: number, item: any) =>
                                      acc + Number(item.paid),
                                    0
                                  )}
                                />
                              </Table.Td>
                            </Table.Tr>
                          </Table.Tbody>
                        </Table>
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <Select
                          label="Mode"
                          data={['Cash', 'Cheque', 'UPI']}
                          withAsterisk
                          {...form.getInputProps('mode')}
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <TextInput
                          label="Note"
                          {...form.getInputProps('note')}
                        />
                      </Grid.Col>
                      <Grid.Col
                        span={12}
                        style={{ display: 'flex', justifyContent: 'flex-end' }}
                      >
                        <Button type="submit" loading={saving}>
                          Save
                        </Button>
                      </Grid.Col>
                    </Grid>
                  )}
                </Grid.Col>
              </>
            )}
          </Grid>
        </Paper>
      </form>
      <iframe title="Receipt" ref={iframeRef} style={{ display: 'none' }} />
    </>
  );
}

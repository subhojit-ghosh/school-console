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
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import endpoints from '../../api/endpoints';
import httpClient from '../../api/http-client';
import { titleCase } from '../../utils/text-formating';

export default function TransactionForm() {
  const [academicYears, setAcademicYears] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [studentSearchValue, setStudentSearchValue] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  const [fees, setFees] = useState<any>(null);

  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      academicYearId: '',
      classId: '',
      studentId: '',
    },
    validate: yupResolver(
      yup.object().shape({
        academicYearId: yup
          .string()
          .trim()
          .required('Academic Year is required'),
        classId: yup.string().trim().required('Class is required'),
        studentId: yup.string().trim().required('Student is required'),
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
      form.setFieldValue('studentId', '');
      setStudentSearchValue('');
      setFees(null);
      fetchStudents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values.classId]);

  useEffect(() => {
    if (form.values.studentId) {
      fetchFees();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values.studentId]);

  const fetchAcademicYears = async () => {
    try {
      const { data } = await httpClient.get(endpoints.academicYears.dropdown());
      setAcademicYears(data.data);
      const currentAcademicYear = data.data.find((item: any) => item.isActive);
      form.setFieldValue('academicYearId', currentAcademicYear.id);
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
    try {
      const { data } = await httpClient.get(
        endpoints.transactions.fees(
          form.values.academicYearId,
          form.values.classId,
          form.values.studentId
        )
      );
      setFees(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    console.log(form.values);
  };

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
      <form
        onSubmit={form.onSubmit(handleSubmit, () => {
          console.log(form.errors);
        })}
      >
        <Paper withBorder shadow="md" p="md">
          <Grid>
            <Grid.Col span={12}>
              <Grid>
                <Grid.Col span={2}>
                  {academicYears.length ? (
                    <Select
                      label="Academic Year"
                      placeholder="Select"
                      defaultValue={form.values.academicYearId}
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
            {fees && (
              <>
                <Grid.Col span={6}>
                  <Grid>
                    <Grid.Col span={4}>
                      <Text>Total Paid</Text>
                      <Badge leftSection="₹" color="green">
                        {fees.stats.totalPaid}
                      </Badge>
                    </Grid.Col>
                    <Grid.Col span={4}>
                      <Text>Current Due</Text>
                      <Badge leftSection="₹" color="red">
                        {fees.stats.currentDue}
                      </Badge>
                    </Grid.Col>
                    <Grid.Col span={4}>
                      <Text>Total Due</Text>
                      <Badge leftSection="₹" color="orange">
                        {fees.stats.totalDue}
                      </Badge>
                    </Grid.Col>
                    <Grid.Col span={12}>
                      <Table withTableBorder withColumnBorders>
                        <Table.Thead>
                          <Table.Tr>
                            <Table.Th>Type</Table.Th>
                            <Table.Th>Name</Table.Th>
                            <Table.Th>Amount</Table.Th>
                          </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                          {Object.keys(
                            fees.feesWithDue.reduce((acc: any, fee: any) => {
                              if (!acc[fee.category]) {
                                acc[fee.category] = [];
                              }
                              acc[fee.category].push(fee);
                              return acc;
                            }, {})
                          ).map((category: any) => {
                            const items = fees.feesWithDue.filter(
                              (fee: any) => fee.category === category
                            );
                            return items.map((item: any, index: number) => (
                              <Table.Tr key={index}>
                                {index === 0 && (
                                  <Table.Td rowSpan={items.length}>
                                    {titleCase(category)}
                                  </Table.Td>
                                )}
                                <Table.Td>
                                  <Checkbox label={item.name} />
                                </Table.Td>
                                <Table.Td>₹{item.amount}</Table.Td>
                              </Table.Tr>
                            ));
                          })}
                        </Table.Tbody>
                      </Table>
                    </Grid.Col>
                  </Grid>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Grid>
                    <Grid.Col span={12} mt="65">
                      <Table withTableBorder withColumnBorders>
                        <Table.Thead>
                          <Table.Tr>
                            <Table.Th>Type</Table.Th>
                            <Table.Th>Name</Table.Th>
                            <Table.Th>Amount</Table.Th>
                            <Table.Th>Concession</Table.Th>
                            <Table.Th>Paid</Table.Th>
                          </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                          <Table.Tr>
                            <Table.Td rowSpan={2}>Enrollment</Table.Td>
                            <Table.Td>Admission</Table.Td>
                            <Table.Td>₹1000</Table.Td>
                            <Table.Td>
                              <NumberInput
                                hideControls
                                leftSection={<Text size="sm">₹</Text>}
                              />
                            </Table.Td>
                            <Table.Td>
                              <NumberInput
                                hideControls
                                leftSection={<Text size="sm">₹</Text>}
                              />
                            </Table.Td>
                          </Table.Tr>
                          <Table.Tr>
                            <Table.Td>Development</Table.Td>
                            <Table.Td>₹1000</Table.Td>
                            <Table.Td>
                              <NumberInput
                                hideControls
                                leftSection={<Text size="sm">₹</Text>}
                              />
                            </Table.Td>
                            <Table.Td>
                              <NumberInput
                                hideControls
                                leftSection={<Text size="sm">₹</Text>}
                              />
                            </Table.Td>
                          </Table.Tr>
                          <Table.Tr>
                            <Table.Td rowSpan={1}>Tution</Table.Td>
                            <Table.Td>Quarter 1 (April - June)</Table.Td>
                            <Table.Td>₹1000</Table.Td>
                            <Table.Td>
                              <NumberInput
                                hideControls
                                leftSection={<Text size="sm">₹</Text>}
                              />
                            </Table.Td>
                            <Table.Td>
                              <NumberInput
                                hideControls
                                leftSection={<Text size="sm">₹</Text>}
                              />
                            </Table.Td>
                          </Table.Tr>
                          <Table.Tr>
                            <Table.Td rowSpan={3}>Material</Table.Td>
                            <Table.Td>Books</Table.Td>
                            <Table.Td>₹100</Table.Td>
                            <Table.Td>
                              <NumberInput
                                hideControls
                                leftSection={<Text size="sm">₹</Text>}
                              />
                            </Table.Td>
                            <Table.Td>
                              <NumberInput
                                hideControls
                                leftSection={<Text size="sm">₹</Text>}
                              />
                            </Table.Td>
                          </Table.Tr>
                          <Table.Tr>
                            <Table.Td>Shoes</Table.Td>
                            <Table.Td>₹50</Table.Td>
                            <Table.Td>
                              <NumberInput
                                hideControls
                                leftSection={<Text size="sm">₹</Text>}
                              />
                            </Table.Td>
                            <Table.Td>
                              <NumberInput
                                hideControls
                                leftSection={<Text size="sm">₹</Text>}
                              />
                            </Table.Td>
                          </Table.Tr>
                          <Table.Tr>
                            <Table.Td>ID Card</Table.Td>
                            <Table.Td>₹10</Table.Td>
                            <Table.Td>
                              <NumberInput
                                hideControls
                                leftSection={<Text size="sm">₹</Text>}
                              />
                            </Table.Td>
                            <Table.Td>
                              <NumberInput
                                hideControls
                                leftSection={<Text size="sm">₹</Text>}
                              />
                            </Table.Td>
                          </Table.Tr>
                          <Table.Tr fw="bold">
                            <Table.Td colSpan={2}>Total</Table.Td>
                            <Table.Td>₹3160</Table.Td>
                            <Table.Td>₹160</Table.Td>
                            <Table.Td>3000</Table.Td>
                          </Table.Tr>
                        </Table.Tbody>
                      </Table>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Select
                        label="Mode"
                        data={['Cash', 'Cheque', 'UPI']}
                        withAsterisk
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <TextInput label="Note" />
                    </Grid.Col>
                    <Grid.Col
                      span={12}
                      style={{ display: 'flex', justifyContent: 'flex-end' }}
                    >
                      <Button>Save</Button>
                    </Grid.Col>
                  </Grid>
                </Grid.Col>
              </>
            )}
          </Grid>
        </Paper>
      </form>
    </>
  );
}

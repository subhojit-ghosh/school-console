import {
  ActionIcon,
  Button,
  Checkbox,
  Divider,
  FileInput,
  Grid,
  Group,
  NumberInput,
  Paper,
  Radio,
  Select,
  Space,
  Stepper,
  Table,
  Text,
  Textarea,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';
import { DateInput, YearPickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { randomId } from '@mantine/hooks';
import {
  IconArrowBack,
  IconArrowLeft,
  IconArrowRight,
  IconCalendar,
  IconCalendarMonth,
  IconDeviceFloppy,
  IconPlus,
  IconTrash,
  IconUpload,
} from '@tabler/icons-react';
import moment from 'moment';
import { Fragment, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { StudentPersonalType } from '../../types/student';
import { titleCase } from '../../utils/text-formating';
import { useGetClasses } from '../../services/utils/apiQuery';
import {
  useAddStudent,
  useAddStudentPersonal,
} from '../../services/students/apiQuery';
import {
  showErrorNotification,
  showSuccessNotification,
} from '../../utils/notification';

type StudentFormProps = {
  action: 'add' | 'edit';
};

const stepsCount = 3;

const StepperNavigation = ({
  prevStep = () => {},
  activeStep,
}: {
  prevStep: (dt: any) => void;
  activeStep: number;
}) => (
  <Group justify="space-between" mt="xl">
    <Button
      variant="default"
      onClick={prevStep}
      leftSection={<IconArrowLeft size={16} />}
    >
      Back
    </Button>
    {activeStep < stepsCount - 1 ? (
      <Button type="submit" leftSection={<IconArrowRight size={16} />}>
        Next
      </Button>
    ) : (
      <Button>Save</Button>
    )}
  </Group>
);

export default function StudentForm({ action }: StudentFormProps) {
  const { id } = useParams();
  const [activeStep, setActiveStep] = useState(0);

  const prevStep = () =>
    setActiveStep((current) => (current > 0 ? current - 1 : current));
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  const studentPersonalForm = useForm<Partial<StudentPersonalType>>({
    mode: 'uncontrolled',
    initialValues: {
      // regNo: '',
      // admissionDate: null,
      classId: '1',
      name: 'Aniruddha Roy',
      dob: new Date('2020-12-06'),
      gender: 'M',
      religion: 'Hindu',
      nationality: 'Indian',
      nativeLanguage: 'Bengali',
      caste: 'General',

      fathersName: 'AAA',
      fathersPhone: '1232323323',
      mothersName: 'AAA',
      mothersPhone: '1232323323',

      presentAddess: 'Test',
      presentPo: 'ER',
      presentPs: 'WEE',
      presentPin: 123456,

      isBothAddressSame: true,

      permanentAddess: 'Test',
      permanentPo: 'ER',
      permanentPs: 'WEE',
      permanentPin: 123456,

      // studentPhoto: null,
      // fatherPhoto: null,
      // motherPhoto: null,

      // medicalHistory: 'N',
      // medicalFile: null,

      previousSchoolDetails: [
        {
          key: randomId(),
          name: 'A',
          place: 'E',
          affilatedBoard: 'W',
          standard: 'W',
          periodStart: new Date('2021-01-01'),
          periodEnd: new Date('2021-01-01'),
        },
      ],
      siblingDetails: [
        {
          key: randomId(),
          name: 'E',
          dob: new Date('2024-01-01'),
          classId: '2',
          presentSchool: 'Test',
        },
      ],
      // consent: false,
    },
    onValuesChange: ({ consent }, ...rest) => {
      setIsFormValid(consent as boolean);
    },
    transformValues: (values) => ({
      ...values,
      dob: moment(values.dob).format('YYYY-MM-DD'),
      classId: Number(values.classId),
      fathersPhone: String(values.fathersPhone),
      mothersPhone: String(values.mothersPhone),
      previousSchoolDetails: (values.previousSchoolDetails || []).map(
        (rec) => ({
          ...rec,
          periodStart: moment(rec.periodStart).format('YYYY-MM-DD'),
          periodEnd: moment(rec.periodEnd).format('YYYY-MM-DD'),
        })
      ),
      siblingDetails: (values.siblingDetails || []).map((rec) => ({
        ...rec,
        dob: moment(rec.dob).format('YYYY-MM-DD'),
      })),
    }),
  });

  const form = useForm<Partial<StudentPersonalType>>({
    mode: 'uncontrolled',
    initialValues: {
      // regNo: '',
      // admissionDate: null,
      classId: '1',
      name: 'Aniruddha Roy',
      dob: new Date('2020-12-06'),
      gender: 'M',
      religion: 'Hindu',
      nationality: 'Indian',
      nativeLanguage: 'Bengali',
      caste: 'General',

      fathersName: 'AAA',
      fathersPhone: 1232323323,
      mothersName: 'AAA',
      mothersPhone: 1232323323,

      presentAddess: 'Test',
      presentPo: 'ER',
      presentPs: 'WEE',
      presentPin: 123456,

      isBothAddressSame: true,

      permanentAddess: 'Test',
      permanentPo: 'ER',
      permanentPs: 'WEE',
      permanentPin: 123456,

      // studentPhoto: null,
      // fatherPhoto: null,
      // motherPhoto: null,

      // medicalHistory: 'N',
      // medicalFile: null,

      previousSchoolDetails: [
        {
          key: randomId(),
          name: 'A',
          place: 'E',
          affilatedBoard: 'W',
          standard: 'W',
          periodStart: new Date('2021-01-01'),
          periodEnd: new Date('2021-01-01'),
        },
      ],
      siblingDetails: [
        {
          key: randomId(),
          name: 'E',
          dob: new Date('2024-01-01'),
          classId: '1',
          presentSchool: 'Test',
        },
      ],
      // consent: false,
    },
    onValuesChange: ({ consent }, ...rest) => {
      setIsFormValid(consent as boolean);
    },
    transformValues: (values) => ({
      ...values,
      dob: moment(values.dob).format('YYYY-MM-DD'),
      classId: Number(values.classId),
    }),
  });

  function addRecord() {
    studentPersonalForm.insertListItem('previousSchoolDetails', {
      key: randomId(),
      name: '',
      place: '',
      affilatedBoard: '',
      standard: '',
      periodStart: null,
      periodEnd: null,
    });
  }

  function addSiblingRecord() {
    studentPersonalForm.insertListItem('siblingDetails', {
      key: randomId(),
      name: '',
      dob: null,
      classId: '',
      presentSchool: '',
    });
  }

  const guardianArr = [
    {
      head: 'Father / First Guardian',
      fields: {
        qualification: 'fatherQualification',
        profession: 'fatherProfession',
        annualIncome: 'fatherAnnualIncome',
        address: 'fatherAddress',
        city: 'fatherCity',
        pin: 'fatherPin',
        state: 'fatherState',
        country: 'fatherCountry',
        mobile: 'fatherMobile',
        email: 'fatherEmail',
        sign: 'fatherSign',
        place: 'fatherPlace',
      },
    },
    {
      head: 'Mother / Second Guardian',
      fields: {
        qualification: 'motherQualification',
        profession: 'motherProfession',
        annualIncome: 'motherAnnualIncome',
        address: 'motherAddress',
        city: 'motherCity',
        pin: 'motherPin',
        state: 'motherState',
        country: 'motherCountry',
        mobile: 'motherMobile',
        email: 'motherEmail',
        sign: 'motherSign',
        place: 'motherPlace',
      },
    },
    {
      head: 'Local Guardian (If Any)',
      fields: {
        qualification: 'guardianQualification',
        profession: 'guardianProfession',
        annualIncome: 'guardianAnnualIncome',
        address: 'guardianAddress',
        city: 'guardianCity',
        pin: 'guardianPin',
        state: 'guardianState',
        country: 'guardianCountry',
        mobile: 'guardianMobile',
        email: 'guardianEmail',
        sign: 'guardianSign',
        place: 'guardianPlace',
      },
    },
  ];

  useEffect(() => {
    console.log('debug-isFormValid', isFormValid);
  }, [isFormValid]);

  const { data: classLists = [] } = useGetClasses();
  const saveStudentPersonal = useAddStudentPersonal();

  function onFormSubmit(v: Partial<StudentPersonalType>) {
    if (!v.previousSchoolDetails?.length) {
      showErrorNotification('One school details is required.');
      return;
    }
    if (!v.siblingDetails?.length) {
      showErrorNotification('One sibling details is required.');
      return;
    }

    saveStudentPersonal.mutate({
      ...(v as any),
      name: 'AAA',
      previousSchoolDetails: JSON.stringify(v.previousSchoolDetails),
      siblingDetails: JSON.stringify(v.siblingDetails),
    });
  }

  function onSavePersonalRecords(v: Partial<StudentPersonalType>) {
    saveStudentPersonal.mutate(
      {
        ...v,
        previousSchoolDetails: JSON.stringify(v.previousSchoolDetails),
        siblingDetails: JSON.stringify(v.siblingDetails),
      },
      {
        onSuccess: (dt) => {
          showSuccessNotification(
            'Student Personal Record created successfully.'
          );
          nextStep();
        },
      }
    );
  }

  const nextStep = () => {
    console.log(
      'debug-activeStep',
      activeStep,
      studentPersonalForm.getValues()
    );
    setActiveStep((current) => (current < stepsCount ? current + 1 : current));
  };

  return (
    <>
      <Group justify="space-between" align="center" mb="md">
        <Title size="lg">
          {titleCase(action)} Student {id && <>({id})</>}
        </Title>
        <Button
          variant="light"
          leftSection={<IconArrowBack size={14} />}
          component={Link}
          to="/students"
        >
          Back
        </Button>
      </Group>
      <Paper withBorder shadow="md" p="md">
        <Stepper active={activeStep} onStepClick={setActiveStep}>
          {classLists.length > 0 && (
            <Stepper.Step label="Student's Information">
              <form
                onSubmit={studentPersonalForm.onSubmit(onSavePersonalRecords)}
              >
                <Space h={20} />
                <Grid>
                  <Grid.Col span={3}>
                    <TextInput
                      label="Name"
                      withAsterisk
                      key={studentPersonalForm.key('name')}
                      {...studentPersonalForm.getInputProps('name')}
                    />
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <Select
                      label="Class"
                      withAsterisk
                      data={classLists}
                      {...studentPersonalForm.getInputProps('classId')}
                      key={studentPersonalForm.key('classId')}
                    />
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <DateInput
                      label="Date of Birth"
                      maxDate={moment(new Date()).subtract(3, 'years').toDate()}
                      defaultDate={moment(new Date())
                        .subtract(3, 'years')
                        .toDate()}
                      defaultLevel="decade"
                      leftSection={<IconCalendar size={18} />}
                      withAsterisk
                      key={studentPersonalForm.key('dob')}
                      {...studentPersonalForm.getInputProps('dob')}
                    />
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <Radio.Group
                      name="gender"
                      label="Gender"
                      withAsterisk
                      key={studentPersonalForm.key('gender')}
                      {...studentPersonalForm.getInputProps('gender')}
                    >
                      <Group mt="xs">
                        <Radio value="M" label="Male" />
                        <Radio value="F" label="Female" />
                      </Group>
                    </Radio.Group>
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <Select
                      label="Religion"
                      data={['Hindu', 'Muslim', 'Christian', 'Sikh']}
                      withAsterisk
                      key={studentPersonalForm.key('religion')}
                      {...studentPersonalForm.getInputProps('religion')}
                    />
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <Select
                      label="Nationality"
                      data={['Indian']}
                      withAsterisk
                      key={studentPersonalForm.key('nationality')}
                      {...studentPersonalForm.getInputProps('nationality')}
                    />
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <Select
                      label="Native Language"
                      data={['Bengali', 'Hindi', 'English']}
                      withAsterisk
                      key={studentPersonalForm.key('nativeLanguage')}
                      {...studentPersonalForm.getInputProps('nativeLanguage')}
                    />
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <Select
                      label="Caste"
                      data={['General', 'OBC', 'SC', 'ST']}
                      withAsterisk
                      key={studentPersonalForm.key('caste')}
                      {...studentPersonalForm.getInputProps('caste')}
                    />
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <TextInput
                      label="Father's Name"
                      withAsterisk
                      key={studentPersonalForm.key('fathersName')}
                      {...studentPersonalForm.getInputProps('fathersName')}
                    />
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <TextInput
                      label="Father's Ph No."
                      minLength={10}
                      maxLength={10}
                      withAsterisk
                      key={studentPersonalForm.key('fathersPhone')}
                      {...studentPersonalForm.getInputProps('fathersPhone')}
                      leftSection={<Text size="sm">+91</Text>}
                    />
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <TextInput
                      label="Mother's Name"
                      withAsterisk
                      key={studentPersonalForm.key('mothersName')}
                      {...studentPersonalForm.getInputProps('mothersName')}
                    />
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <TextInput
                      label="Mother's Ph No."
                      minLength={10}
                      maxLength={10}
                      withAsterisk
                      key={studentPersonalForm.key('mothersPhone')}
                      {...studentPersonalForm.getInputProps('mothersPhone')}
                      leftSection={<Text size="sm">+91</Text>}
                    />
                  </Grid.Col>

                  <Grid.Col span={12}>
                    <Textarea
                      label="Present Address"
                      withAsterisk
                      key={studentPersonalForm.key('presentAddess')}
                      {...studentPersonalForm.getInputProps('presentAddess')}
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <TextInput
                      label="P.O"
                      withAsterisk
                      key={studentPersonalForm.key('presentPo')}
                      {...studentPersonalForm.getInputProps('presentPo')}
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <TextInput
                      label="P.S"
                      withAsterisk
                      key={studentPersonalForm.key('presentPs')}
                      {...studentPersonalForm.getInputProps('presentPs')}
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <NumberInput
                      label="Pin"
                      withAsterisk
                      key={studentPersonalForm.key('presentPin')}
                      {...studentPersonalForm.getInputProps('presentPin')}
                      hideControls
                    />
                  </Grid.Col>

                  <Grid.Col span={12}>
                    <Checkbox
                      label="Is Both Address are same?"
                      key={studentPersonalForm.key('isBothAddressSame')}
                      {...studentPersonalForm.getInputProps(
                        'isBothAddressSame'
                      )}
                    />
                  </Grid.Col>

                  <Grid.Col span={12}>
                    <Textarea
                      label="Permanent Address"
                      withAsterisk
                      key={studentPersonalForm.key('permanentAddess')}
                      {...studentPersonalForm.getInputProps('permanentAddess')}
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <TextInput
                      label="P.O"
                      withAsterisk
                      key={studentPersonalForm.key('permanentPo')}
                      {...studentPersonalForm.getInputProps('permanentPo')}
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <TextInput
                      label="P.S"
                      withAsterisk
                      key={studentPersonalForm.key('permanentPs')}
                      {...studentPersonalForm.getInputProps('permanentPs')}
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <NumberInput
                      label="Pin"
                      withAsterisk
                      key={studentPersonalForm.key('permanentPin')}
                      {...studentPersonalForm.getInputProps('permanentPin')}
                      hideControls
                    />
                  </Grid.Col>

                  <Grid.Col span={12}>
                    <Text size="sm" fw={800} mb="sm">
                      Details of Previous School (If any)
                    </Text>

                    <Table striped withTableBorder withColumnBorders>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Name</Table.Th>
                          <Table.Th>Place</Table.Th>
                          <Table.Th>Affiliated Board</Table.Th>
                          <Table.Th>Standard</Table.Th>
                          <Table.Th>Period (YYYY to YYYY)</Table.Th>
                          <Table.Th></Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {(
                          studentPersonalForm.getValues()
                            ?.previousSchoolDetails || []
                        ).map((item, index) => (
                          <Table.Tr key={index}>
                            <Table.Td>
                              <TextInput
                                key={studentPersonalForm.key(
                                  `previousSchoolDetails.${index}.name`
                                )}
                                {...studentPersonalForm.getInputProps(
                                  `previousSchoolDetails.${index}.name`
                                )}
                              />
                            </Table.Td>
                            <Table.Td>
                              <TextInput
                                key={studentPersonalForm.key(
                                  `previousSchoolDetails.${index}.place`
                                )}
                                {...studentPersonalForm.getInputProps(
                                  `previousSchoolDetails.${index}.place`
                                )}
                              />
                            </Table.Td>
                            <Table.Td>
                              <TextInput
                                key={studentPersonalForm.key(
                                  `previousSchoolDetails.${index}.affilatedBoard`
                                )}
                                {...studentPersonalForm.getInputProps(
                                  `previousSchoolDetails.${index}.affilatedBoard`
                                )}
                              />
                            </Table.Td>
                            <Table.Td>
                              <TextInput
                                key={studentPersonalForm.key(
                                  `previousSchoolDetails.${index}.standard`
                                )}
                                {...studentPersonalForm.getInputProps(
                                  `previousSchoolDetails.${index}.standard`
                                )}
                              />
                            </Table.Td>

                            <Table.Td>
                              <Group align="center" style={{ width: '100%' }}>
                                <YearPickerInput
                                  dropdownType="modal"
                                  key={studentPersonalForm.key(
                                    `previousSchoolDetails.${index}.periodStart`
                                  )}
                                  {...studentPersonalForm.getInputProps(
                                    `previousSchoolDetails.${index}.periodStart`
                                  )}
                                  leftSection={<IconCalendarMonth size={18} />}
                                  style={{ flex: 1 }}
                                />
                                <Text>-</Text>
                                <YearPickerInput
                                  dropdownType="modal"
                                  key={studentPersonalForm.key(
                                    `previousSchoolDetails.${index}.periodEnd`
                                  )}
                                  {...studentPersonalForm.getInputProps(
                                    `previousSchoolDetails.${index}.periodEnd`
                                  )}
                                  leftSection={<IconCalendarMonth size={18} />}
                                  style={{ flex: 1 }}
                                />
                              </Group>
                            </Table.Td>
                            <Table.Td>
                              {(
                                studentPersonalForm.getValues()
                                  .previousSchoolDetails || []
                              )?.length > 1 && (
                                <Tooltip label="Delete Row">
                                  <ActionIcon
                                    variant="outline"
                                    color="red"
                                    onClick={() =>
                                      studentPersonalForm.removeListItem(
                                        'previousSchoolDetails',
                                        index
                                      )
                                    }
                                  >
                                    <IconTrash size={16} />
                                  </ActionIcon>
                                </Tooltip>
                              )}
                            </Table.Td>
                          </Table.Tr>
                        ))}
                      </Table.Tbody>
                    </Table>
                    <Group justify="right" mt="sm">
                      <Button
                        onClick={addRecord}
                        leftSection={<IconPlus />}
                        variant="light"
                      >
                        Add
                      </Button>
                    </Group>
                  </Grid.Col>

                  <Grid.Col span={12}>
                    <Text size="sm" fw={800} mb="sm">
                      Details of Siblings (If any)
                    </Text>

                    <Table striped withTableBorder withColumnBorders>
                      <Table.Tbody>
                        <Table.Tr>
                          <Table.Th>Name</Table.Th>
                          <Table.Th>D.O.B</Table.Th>
                          <Table.Th>Class</Table.Th>
                          <Table.Th>Present School</Table.Th>
                          <Table.Th></Table.Th>
                        </Table.Tr>
                        <>
                          {(
                            studentPersonalForm.getValues()?.siblingDetails ||
                            []
                          ).map((item, index) => (
                            <Table.Tr key={index}>
                              <Table.Td>
                                <TextInput
                                  key={studentPersonalForm.key(
                                    `siblingDetails.${index}.name`
                                  )}
                                  {...studentPersonalForm.getInputProps(
                                    `siblingDetails.${index}.name`
                                  )}
                                />
                              </Table.Td>
                              <Table.Td>
                                <DateInput
                                  key={studentPersonalForm.key(
                                    `siblingDetails.${index}.dob`
                                  )}
                                  {...studentPersonalForm.getInputProps(
                                    `siblingDetails.${index}.dob`
                                  )}
                                  leftSection={<IconCalendar size={18} />}
                                />
                              </Table.Td>
                              <Table.Td>
                                <Select
                                  data={classLists}
                                  key={studentPersonalForm.key(
                                    `siblingDetails.${index}.classId`
                                  )}
                                  {...studentPersonalForm.getInputProps(
                                    `siblingDetails.${index}.classId`
                                  )}
                                />
                              </Table.Td>
                              <Table.Td>
                                <TextInput
                                  key={studentPersonalForm.key(
                                    `siblingDetails.${index}.presentSchool`
                                  )}
                                  {...studentPersonalForm.getInputProps(
                                    `siblingDetails.${index}.presentSchool`
                                  )}
                                />
                              </Table.Td>

                              <Table.Td>
                                {(
                                  studentPersonalForm.getValues()
                                    .siblingDetails || []
                                )?.length > 1 && (
                                  <Tooltip label="Delete Row">
                                    <ActionIcon
                                      variant="outline"
                                      color="red"
                                      onClick={() =>
                                        studentPersonalForm.removeListItem(
                                          'siblingDetails',
                                          index
                                        )
                                      }
                                    >
                                      <IconTrash size={16} />
                                    </ActionIcon>
                                  </Tooltip>
                                )}
                              </Table.Td>
                            </Table.Tr>
                          ))}
                        </>
                      </Table.Tbody>
                    </Table>
                    <Group justify="right" mt="sm">
                      <Tooltip label="Add New Row">
                        <Button
                          onClick={addSiblingRecord}
                          leftSection={<IconPlus />}
                          variant="light"
                        >
                          Add
                        </Button>
                      </Tooltip>
                    </Group>
                  </Grid.Col>
                </Grid>

                <StepperNavigation
                  prevStep={prevStep}
                  activeStep={activeStep}
                />
              </form>
            </Stepper.Step>
          )}

          <Stepper.Step label="Parents / Guardian's Information">
            {guardianArr.map((item, index) => (
              <Fragment key={index}>
                <Space h={20} />
                <Divider
                  my="xs"
                  variant="dashed"
                  labelPosition="center"
                  label={
                    <Text c="indigo" fw={600} size="sm">
                      {item.head}
                    </Text>
                  }
                />
                <Grid columns={12}>
                  <Grid.Col span={4}>
                    <TextInput
                      label="Qualification"
                      key={form.key(
                        `${guardianArr[index].fields.qualification}`
                      )}
                      {...studentPersonalForm.getInputProps(
                        `${guardianArr[index].fields.qualification}`
                      )}
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <TextInput
                      label="Profession"
                      key={form.key(`${guardianArr[index].fields.profession}`)}
                      {...form.getInputProps(
                        `${guardianArr[index].fields.profession}`
                      )}
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <NumberInput
                      label="Annual Income"
                      key={form.key(
                        `${guardianArr[index].fields.annualIncome}`
                      )}
                      {...form.getInputProps(
                        `${guardianArr[index].fields.annualIncome}`
                      )}
                      hideControls
                    />
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <Textarea
                      label="Office Address"
                      key={form.key(`${guardianArr[index].fields.address}`)}
                      {...form.getInputProps(
                        `${guardianArr[index].fields.address}`
                      )}
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <TextInput
                      label="Town/City"
                      key={form.key(`${guardianArr[index].fields.city}`)}
                      {...form.getInputProps(
                        `${guardianArr[index].fields.city}`
                      )}
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <TextInput
                      label="Pin"
                      key={form.key(`${guardianArr[index].fields.pin}`)}
                      {...form.getInputProps(
                        `${guardianArr[index].fields.pin}`
                      )}
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <Select
                      label="State"
                      data={['West Bengal']}
                      key={form.key(`${guardianArr[index].fields.state}`)}
                      {...form.getInputProps(
                        `${guardianArr[index].fields.state}`
                      )}
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <Select
                      label="Country"
                      data={['India']}
                      key={form.key(`${guardianArr[index].fields.country}`)}
                      {...form.getInputProps(
                        `${guardianArr[index].fields.country}`
                      )}
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <NumberInput
                      label="Mobile"
                      key={form.key(`${guardianArr[index].fields.mobile}`)}
                      {...form.getInputProps(
                        `${guardianArr[index].fields.mobile}`
                      )}
                      hideControls
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <TextInput
                      label="Email"
                      key={form.key(`${guardianArr[index].fields.email}`)}
                      {...form.getInputProps(
                        `${guardianArr[index].fields.email}`
                      )}
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <FileInput
                      label="Signature"
                      key={form.key(`${guardianArr[index].fields.sign}`)}
                      {...form.getInputProps(
                        `${guardianArr[index].fields.sign}`
                      )}
                      leftSection={<IconUpload size={18} />}
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <TextInput
                      label="Place"
                      key={form.key(`${guardianArr[index].fields.place}`)}
                      {...form.getInputProps(
                        `${guardianArr[index].fields.place}`
                      )}
                    />
                  </Grid.Col>
                </Grid>
              </Fragment>
            ))}
          </Stepper.Step>
        </Stepper>
      </Paper>
    </>
  );
}

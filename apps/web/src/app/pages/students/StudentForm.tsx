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

type StudentFormProps = {
  action: 'add' | 'edit';
};

const stepsCount = 3;

export default function StudentForm({ action }: StudentFormProps) {
  const { id } = useParams();
  const [activeStep, setActiveStep] = useState(0);
  const nextStep = () =>
    setActiveStep((current) => (current < stepsCount ? current + 1 : current));
  const prevStep = () =>
    setActiveStep((current) => (current > 0 ? current - 1 : current));
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const form = useForm<Partial<StudentPersonalType>>({
    mode: 'uncontrolled',
    initialValues: {
      regNo: '',
      admissionDate: null,
      classId: null,

      studentPhoto: null,
      fatherPhoto: null,
      motherPhoto: null,

      medicalHistory: 'N',
      medicalFile: null,

      previousSchoolDetails: [
        {
          key: randomId(),
          name: '',
          place: '',
          affilatedBoard: '',
          standard: '',
          periodStart: null,
          periodEnd: null,
        },
      ],
      siblingDetails: [
        {
          key: randomId(),
          name: '',
          dob: null,
          classId: '',
          presentSchool: '',
        },
      ],
      consent: false,
    },
    onValuesChange: ({ consent }, ...rest) => {
      setIsFormValid(consent as boolean);
    },
  });

  function addRecord() {
    form.insertListItem('previousSchoolDetails', {
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
    form.insertListItem('siblingDetails', {
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
        qualification: 'qualificationF',
        profession: 'professionF',
        annualIncome: 'annualIncomeF',
        address: 'addressF',
        city: 'cityF',
        pin: 'pinF',
        state: 'stateF',
        country: 'countryF',
        mobile: 'mobileF',
        email: 'emailF',
        sign: 'signF',
        place: 'placeF',
      },
    },
    {
      head: 'Mother / Second Guardian',
      fields: {
        qualification: 'qualificationM',
        profession: 'professionM',
        annualIncome: 'annualIncomeM',
        address: 'addressM',
        city: 'cityM',
        pin: 'pinM',
        state: 'stateM',
        country: 'countryM',
        mobile: 'mobileM',
        email: 'emailM',
        sign: 'signM',
        place: 'placeM',
      },
    },
    {
      head: 'Local Guardian (If Any)',
      fields: {
        qualification: 'qualificationO',
        profession: 'professionO',
        annualIncome: 'annualIncomeO',
        address: 'addressO',
        city: 'cityO',
        pin: 'pinO',
        state: 'stateO',
        country: 'countryO',
        mobile: 'mobileO',
        email: 'emailO',
        sign: 'signO',
        place: 'placeO',
      },
    },
  ];

  useEffect(() => {
    console.log('debug-isFormValid', isFormValid);
  }, [isFormValid]);

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
        <form onSubmit={form.onSubmit((values) => console.log(values))}>
          <Stepper active={activeStep} onStepClick={setActiveStep}>
            <Stepper.Step label="Student's Information">
              <Space h={20} />
              <Grid>
                <Grid.Col span={3}>
                  <TextInput
                    label="Name"
                    withAsterisk
                    {...form.getInputProps('studentName')}
                  />
                </Grid.Col>
                <Grid.Col span={3}>
                  <Select
                    label="Class"
                    withAsterisk
                    {...form.getInputProps('classId')}
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
                    {...form.getInputProps('dob')}
                  />
                </Grid.Col>
                <Grid.Col span={3}>
                  <Radio.Group
                    name="gender"
                    label="Gender"
                    withAsterisk
                    {...form.getInputProps('gender')}
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
                    {...form.getInputProps('religion')}
                  />
                </Grid.Col>
                <Grid.Col span={3}>
                  <Select
                    label="Nationality"
                    data={['Indian']}
                    withAsterisk
                    {...form.getInputProps('nationality')}
                  />
                </Grid.Col>
                <Grid.Col span={3}>
                  <Select
                    label="Native Language"
                    data={['Bengali', 'Hindi', 'English']}
                    withAsterisk
                    {...form.getInputProps('nativeLanguage')}
                  />
                </Grid.Col>
                <Grid.Col span={3}>
                  <Select
                    label="Caste"
                    data={['General', 'OBC', 'SC', 'ST']}
                    withAsterisk
                    {...form.getInputProps('caste')}
                  />
                </Grid.Col>
                <Grid.Col span={3}>
                  <TextInput
                    label="Father's Name"
                    withAsterisk
                    {...form.getInputProps('fatherName')}
                  />
                </Grid.Col>
                <Grid.Col span={3}>
                  <TextInput
                    label="Father's Ph No."
                    minLength={10}
                    maxLength={10}
                    withAsterisk
                    {...form.getInputProps('fatherNo')}
                    leftSection={<Text size="sm">+91</Text>}
                  />
                </Grid.Col>
                <Grid.Col span={3}>
                  <TextInput
                    label="Mother's Name"
                    withAsterisk
                    {...form.getInputProps('motherName')}
                  />
                </Grid.Col>
                <Grid.Col span={3}>
                  <TextInput
                    label="Mother's Ph No."
                    minLength={10}
                    maxLength={10}
                    withAsterisk
                    {...form.getInputProps('motherNo')}
                    leftSection={<Text size="sm">+91</Text>}
                  />
                </Grid.Col>
                <Grid.Col span={12}>
                  <Textarea
                    label="Present Address"
                    withAsterisk
                    {...form.getInputProps('pAddress')}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <TextInput
                    label="P.O"
                    withAsterisk
                    {...form.getInputProps('pPo')}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <TextInput
                    label="P.S"
                    withAsterisk
                    {...form.getInputProps('pPs')}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <NumberInput
                    label="Pin"
                    withAsterisk
                    {...form.getInputProps('pPin')}
                    hideControls
                  />
                </Grid.Col>

                <Grid.Col span={12}>
                  <Checkbox
                    label="Is Both Address are same?"
                    key={form.key('isBothAddressSame')}
                    {...form.getInputProps('isBothAddressSame')}
                  />
                </Grid.Col>

                <Grid.Col span={12}>
                  <Textarea
                    label="Permanent Address"
                    withAsterisk
                    {...form.getInputProps('prAddress')}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <TextInput
                    label="P.O"
                    withAsterisk
                    {...form.getInputProps('prPo')}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <TextInput
                    label="P.S"
                    withAsterisk
                    {...form.getInputProps('prPs')}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <NumberInput
                    label="Pin"
                    withAsterisk
                    {...form.getInputProps('prPin')}
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
                      {(form.getValues()?.previousSchoolDetails || []).map(
                        (item, index) => (
                          <Table.Tr key={index}>
                            <Table.Td>
                              <TextInput
                                key={form.key(
                                  `previousSchoolDetails.${index}.name`
                                )}
                                {...form.getInputProps(
                                  `previousSchoolDetails.${index}.name`
                                )}
                              />
                            </Table.Td>
                            <Table.Td>
                              <TextInput
                                key={form.key(
                                  `previousSchoolDetails.${index}.place`
                                )}
                                {...form.getInputProps(
                                  `previousSchoolDetails.${index}.place`
                                )}
                              />
                            </Table.Td>
                            <Table.Td>
                              <TextInput
                                key={form.key(
                                  `previousSchoolDetails.${index}.affilatedBoard`
                                )}
                                {...form.getInputProps(
                                  `previousSchoolDetails.${index}.affilatedBoard`
                                )}
                              />
                            </Table.Td>
                            <Table.Td>
                              <TextInput
                                key={form.key(
                                  `previousSchoolDetails.${index}.standard`
                                )}
                                {...form.getInputProps(
                                  `previousSchoolDetails.${index}.standard`
                                )}
                              />
                            </Table.Td>

                            <Table.Td>
                              <Group align="center" style={{ width: '100%' }}>
                                <YearPickerInput
                                  dropdownType="modal"
                                  key={form.key(
                                    `previousSchoolDetails.${index}.periodStart`
                                  )}
                                  {...form.getInputProps(
                                    `previousSchoolDetails.${index}.periodStart`
                                  )}
                                  leftSection={<IconCalendarMonth size={18} />}
                                  style={{ flex: 1 }}
                                />
                                <Text>-</Text>
                                <YearPickerInput
                                  dropdownType="modal"
                                  key={form.key(
                                    `previousSchoolDetails.${index}.periodEnd`
                                  )}
                                  {...form.getInputProps(
                                    `previousSchoolDetails.${index}.periodEnd`
                                  )}
                                  leftSection={<IconCalendarMonth size={18} />}
                                  style={{ flex: 1 }}
                                />
                              </Group>
                            </Table.Td>
                            <Table.Td>
                              {(form.getValues().previousSchoolDetails || [])
                                ?.length > 1 && (
                                <Tooltip label="Delete Row">
                                  <ActionIcon
                                    variant="outline"
                                    color="red"
                                    onClick={() =>
                                      form.removeListItem(
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
                        )
                      )}
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
                        {(form.getValues()?.siblingDetails || []).map(
                          (item, index) => (
                            <Table.Tr key={index}>
                              <Table.Td>
                                <TextInput
                                  key={form.key(`siblingDetails.${index}.name`)}
                                  {...form.getInputProps(
                                    `siblingDetails.${index}.name`
                                  )}
                                />
                              </Table.Td>
                              <Table.Td>
                                <DateInput
                                  key={form.key(`siblingDetails.${index}.dob`)}
                                  {...form.getInputProps(
                                    `siblingDetails.${index}.dob`
                                  )}
                                  leftSection={<IconCalendar size={18} />}
                                />
                              </Table.Td>
                              <Table.Td>
                                <Select
                                  data={[]}
                                  key={form.key(
                                    `siblingDetails.${index}.classId`
                                  )}
                                  {...form.getInputProps(
                                    `siblingDetails.${index}.classId`
                                  )}
                                />
                              </Table.Td>
                              <Table.Td>
                                <TextInput
                                  key={form.key(
                                    `siblingDetails.${index}.presentSchool`
                                  )}
                                  {...form.getInputProps(
                                    `siblingDetails.${index}.presentSchool`
                                  )}
                                />
                              </Table.Td>

                              <Table.Td>
                                {(form.getValues().siblingDetails || [])
                                  ?.length > 1 && (
                                  <Tooltip label="Delete Row">
                                    <ActionIcon
                                      variant="outline"
                                      color="red"
                                      onClick={() =>
                                        form.removeListItem(
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
                          )
                        )}
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
            </Stepper.Step>
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
                        {...form.getInputProps(
                          `${guardianArr[index].fields.qualification}`
                        )}
                      />
                    </Grid.Col>
                    <Grid.Col span={4}>
                      <TextInput
                        label="Profession"
                        key={form.key(
                          `${guardianArr[index].fields.profession}`
                        )}
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
                        data={[]}
                        key={form.key(`${guardianArr[index].fields.state}`)}
                        {...form.getInputProps(
                          `${guardianArr[index].fields.state}`
                        )}
                      />
                    </Grid.Col>
                    <Grid.Col span={4}>
                      <Select
                        label="Country"
                        data={[]}
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
            <Stepper.Step label="Photos / Documents">
              <Space h={20} />
              <Grid>
                <Grid.Col span={4}>
                  <FileInput
                    label="Student's Photo"
                    leftSection={<IconUpload size={18} />}
                    withAsterisk
                    {...form.getInputProps('studentPhoto')}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <FileInput
                    label="Father's Photo"
                    leftSection={<IconUpload size={18} />}
                    withAsterisk
                    {...form.getInputProps('fatherPhoto')}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <FileInput
                    label="Mother's Photo"
                    leftSection={<IconUpload size={18} />}
                    withAsterisk
                    {...form.getInputProps('motherPhoto')}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <FileInput
                    label="Student's Birth Certificate"
                    leftSection={<IconUpload size={18} />}
                    withAsterisk
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <FileInput
                    label="Student's Vaccination Record"
                    leftSection={<IconUpload size={18} />}
                    withAsterisk
                    {...form.getInputProps('vaccinationRecord')}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <Radio.Group
                    name="medicalHistory"
                    label="Medical History"
                    withAsterisk
                    {...form.getInputProps('medicalHistory')}
                    onChange={(e) => {
                      form.setFieldValue('medicalHistory', e);
                      form.setFieldValue('medicalFile', null);
                    }}
                  >
                    <Group mt="xs">
                      <Radio value="Y" label="Yes" />
                      <Radio value="N" label="No" />
                    </Group>
                  </Radio.Group>
                </Grid.Col>
                {form.getValues().medicalHistory === 'Y' && (
                  <>
                    <Grid.Col span={8}>
                      <Textarea label="Medical History Details" withAsterisk />
                    </Grid.Col>
                    <Grid.Col span={4}>
                      <FileInput
                        label="Medical Records"
                        leftSection={<IconUpload size={18} />}
                        withAsterisk
                        {...form.getInputProps('medicalFile')}
                      />
                    </Grid.Col>
                  </>
                )}
              </Grid>
            </Stepper.Step>
          </Stepper>
          <Group justify="space-between" mt="xl">
            <Button
              variant="default"
              onClick={prevStep}
              leftSection={<IconArrowLeft size={16} />}
            >
              Back
            </Button>
            {activeStep < stepsCount - 1 ? (
              <Button
                onClick={nextStep}
                leftSection={<IconArrowRight size={16} />}
              >
                Next
              </Button>
            ) : (
              <Button>Save</Button>
            )}
          </Group>
        </form>
      </Paper>
    </>
  );
}

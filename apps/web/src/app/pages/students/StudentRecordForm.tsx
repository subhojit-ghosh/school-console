import { useForm } from '@mantine/form';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Center,
  Checkbox,
  Container,
  Divider,
  FileInput,
  Grid,
  Group,
  NumberInput,
  Paper,
  Radio,
  Select,
  Space,
  Table,
  Text,
  Textarea,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { StudentPersonalType } from './type';
import { DateInput, YearPickerInput } from '@mantine/dates';
import {
  IconCalendar,
  IconCalendarMonth,
  IconChevronLeft,
  IconFile,
  IconPhone,
  IconPin,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import moment from 'moment';
import { randomId } from '@mantine/hooks';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function StudentRecordForm() {
  let navigate = useNavigate();
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

      medicalHistory: 'Y',
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
      head: 'Mother/Second Guardian',
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
      <Paper radius="md" withBorder shadow="md" p="md">
        <Group align="center">
          <Button
            variant="transparent"
            leftSection={<IconChevronLeft />}
            onClick={() => navigate('/students')}
          >
            Back
          </Button>
        </Group>
        <Space />
        <form onSubmit={form.onSubmit((values) => console.log(values))}>
          <Divider
            my="xs"
            variant="dashed"
            labelPosition="center"
            label={
              <Text c="indigo" size="md" fw={600}>
                Student's Information
              </Text>
            }
          />
          <Grid columns={12}>
            <Grid.Col span={4}>
              <TextInput
                label="Reg No."
                key={form.key('regNo')}
                leftSection={
                  <Box miw={30}>
                    <Text size="xs" fw={600} c="dark">
                      &nbsp;JDS/&nbsp;
                    </Text>
                  </Box>
                }
                size="xs"
                styles={{
                  input: {
                    paddingLeft: '35px',
                  },
                }}
                {...form.getInputProps('regNo')}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <DateInput
                label="Admission Date"
                key={form.key('admissionDate')}
                size="xs"
                {...form.getInputProps('admissionDate')}
                rightSection={<IconCalendar />}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <Select
                label="Class"
                key={form.key('classId')}
                size="xs"
                {...form.getInputProps('classId')}
              />
            </Grid.Col>

            <Grid.Col span={4}>
              <FileInput
                label="Student Photo"
                key={form.key('studentPhoto')}
                {...form.getInputProps('studentPhoto')}
                size="xs"
                rightSection={<IconFile />}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <FileInput
                label="Father Photo"
                key={form.key('fatherPhoto')}
                {...form.getInputProps('fatherPhoto')}
                size="xs"
                rightSection={<IconFile />}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <FileInput
                label="Mother Photo"
                key={form.key('motherPhoto')}
                {...form.getInputProps('motherPhoto')}
                size="xs"
                rightSection={<IconFile />}
              />
            </Grid.Col>
          </Grid>
          <Grid columns={12}>
            <Grid.Col span={4}>
              <TextInput
                label="Student Name"
                key={form.key('studentName')}
                size="xs"
                {...form.getInputProps('studentName')}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <DateInput
                label="Date of Birth"
                maxDate={moment(new Date()).add(1, 'month').toDate()}
                size="xs"
                key={form.key('dob')}
                {...form.getInputProps('dob')}
                rightSection={<IconCalendar />}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <Radio.Group
                name="gender"
                label="Gender"
                withAsterisk
                size="xs"
                key={form.key('gender')}
                {...form.getInputProps('gender')}
              >
                <Group mt="xs">
                  <Radio value="M" label="Male" />
                  <Radio value="F" label="Female" />
                  <Radio value="O" label="Other" />
                </Group>
              </Radio.Group>
            </Grid.Col>

            <Grid.Col span={3}>
              <Select
                label="Religion"
                data={[]}
                key={form.key('religion')}
                size="xs"
                {...form.getInputProps('religion')}
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <Select
                label="Nationality"
                data={[]}
                key={form.key('nationality')}
                size="xs"
                {...form.getInputProps('nationality')}
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <Select
                label="Native Language"
                data={[]}
                key={form.key('nativeLanguage')}
                size="xs"
                {...form.getInputProps('nativeLanguage')}
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <Select
                label="Caste"
                data={[]}
                key={form.key('caste')}
                size="xs"
                {...form.getInputProps('caste')}
              />
            </Grid.Col>

            <Grid.Col span={3}>
              <TextInput
                label="Father's Name"
                key={form.key('fatherName')}
                size="xs"
                {...form.getInputProps('fatherName')}
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <NumberInput
                label="Father's No"
                key={form.key('fatherNo')}
                size="xs"
                {...form.getInputProps('fatherNo')}
                hideControls
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <TextInput
                label="Mother's Name"
                key={form.key('motherName')}
                size="xs"
                {...form.getInputProps('motherName')}
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <NumberInput
                label="Mother's No"
                key={form.key('motherNo')}
                size="xs"
                {...form.getInputProps('motherNo')}
                hideControls
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <Textarea
                label="Present Address"
                key={form.key('pAddress')}
                size="xs"
                {...form.getInputProps('pAddress')}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <TextInput
                label="P.O"
                key={form.key('pPo')}
                size="xs"
                {...form.getInputProps('pPo')}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <TextInput
                label="P.S"
                key={form.key('pPs')}
                size="xs"
                {...form.getInputProps('pPs')}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <NumberInput
                label="Pin"
                key={form.key('pPin')}
                size="xs"
                {...form.getInputProps('pPin')}
                hideControls
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <Checkbox
                label="Is Both Address are same?"
                key={form.key('isBothAddressSame')}
                size="xs"
                {...form.getInputProps('isBothAddressSame')}
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <Textarea
                label="Permanent Address"
                key={form.key('prAddress')}
                size="xs"
                {...form.getInputProps('prAddress')}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <TextInput
                label="P.O"
                key={form.key('prPo')}
                size="xs"
                {...form.getInputProps('prPo')}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <TextInput
                label="P.S"
                key={form.key('prPs')}
                size="xs"
                {...form.getInputProps('prPs')}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <NumberInput
                label="Pin"
                key={form.key('prPin')}
                size="xs"
                {...form.getInputProps('prPin')}
                hideControls
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <Text size="sm" fw={800} mb="sm">
                Details of Previous School (IF any)
              </Text>

              <Table striped withTableBorder withColumnBorders>
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Place</Table.Th>
                    <Table.Th>Affiliated Board</Table.Th>
                    <Table.Th>Standard</Table.Th>
                    <Table.Th>Period (YYYY to YYYY)</Table.Th>
                    <Table.Th></Table.Th>
                  </Table.Tr>
                  <>
                    {(form.getValues()?.previousSchoolDetails || []).map(
                      (item, index) => (
                        <Table.Tr>
                          <Table.Td>
                            <TextInput
                              size="xs"
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
                              size="xs"
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
                              size="xs"
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
                              size="xs"
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
                                rightSection={<IconCalendarMonth />}
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
                                rightSection={<IconCalendarMonth />}
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
                  </>
                </Table.Tbody>
              </Table>
              <Group justify="right" mt="sm">
                <Tooltip label="Add New Row">
                  <Button onClick={addRecord} leftSection={<IconPlus />}>
                    Add Row
                  </Button>
                </Tooltip>
              </Group>
            </Grid.Col>
            <Grid.Col span={2}>
              <Radio.Group
                name="medicalHistory"
                label="Medical History"
                withAsterisk
                size="xs"
                key={form.key('medicalHistory')}
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
            {form.getValues().medicalHistory === 'Y' &&
              form.getValues().medicalFile === null && (
                <Grid.Col span={3}>
                  <FileInput
                    label="If yes, Write Details and Attach Medical Records"
                    key={form.key('medicalFile')}
                    {...form.getInputProps('medicalFile')}
                    size="xs"
                    rightSection={<IconFile />}
                  />
                </Grid.Col>
              )}

            <Grid.Col span={4}>
              <FileInput
                label="Vaccination Record (Attach Records along with Birth Certificate)"
                key={form.key('vaccinationRecord')}
                {...form.getInputProps('vaccinationRecord')}
                size="xs"
                rightSection={<IconFile />}
              />
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
                        <Table.Tr>
                          <Table.Td>
                            <TextInput
                              size="xs"
                              key={form.key(`siblingDetails.${index}.name`)}
                              {...form.getInputProps(
                                `siblingDetails.${index}.name`
                              )}
                            />
                          </Table.Td>
                          <Table.Td>
                            <DateInput
                              size="xs"
                              key={form.key(`siblingDetails.${index}.dob`)}
                              {...form.getInputProps(
                                `siblingDetails.${index}.dob`
                              )}
                              rightSection={<IconCalendar />}
                            />
                          </Table.Td>
                          <Table.Td>
                            <Select
                              size="xs"
                              data={[]}
                              key={form.key(`siblingDetails.${index}.classId`)}
                              {...form.getInputProps(
                                `siblingDetails.${index}.classId`
                              )}
                            />
                          </Table.Td>
                          <Table.Td>
                            <TextInput
                              size="xs"
                              key={form.key(
                                `siblingDetails.${index}.presentSchool`
                              )}
                              {...form.getInputProps(
                                `siblingDetails.${index}.presentSchool`
                              )}
                            />
                          </Table.Td>

                          <Table.Td>
                            {(form.getValues().siblingDetails || [])?.length >
                              1 && (
                              <Tooltip label="Delete Row">
                                <ActionIcon
                                  variant="outline"
                                  color="red"
                                  onClick={() =>
                                    form.removeListItem('siblingDetails', index)
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
                  <Button onClick={addSiblingRecord} leftSection={<IconPlus />}>
                    Add Row
                  </Button>
                </Tooltip>
              </Group>
            </Grid.Col>
          </Grid>

          {guardianArr.map((item, index) => (
            <>
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
                    key={form.key(`${guardianArr[index].fields.qualification}`)}
                    size="xs"
                    {...form.getInputProps(
                      `${guardianArr[index].fields.qualification}`
                    )}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <TextInput
                    label="Profession"
                    key={form.key(`${guardianArr[index].fields.profession}`)}
                    size="xs"
                    {...form.getInputProps(
                      `${guardianArr[index].fields.profession}`
                    )}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <NumberInput
                    label="Annual Income"
                    key={form.key(`${guardianArr[index].fields.annualIncome}`)}
                    size="xs"
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
                    size="xs"
                    {...form.getInputProps(
                      `${guardianArr[index].fields.address}`
                    )}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <TextInput
                    label="Town/City"
                    key={form.key(`${guardianArr[index].fields.city}`)}
                    size="xs"
                    {...form.getInputProps(`${guardianArr[index].fields.city}`)}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <TextInput
                    label="Pin"
                    key={form.key(`${guardianArr[index].fields.pin}`)}
                    size="xs"
                    {...form.getInputProps(`${guardianArr[index].fields.pin}`)}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <Select
                    label="State"
                    data={[]}
                    key={form.key(`${guardianArr[index].fields.state}`)}
                    size="xs"
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
                    size="xs"
                    {...form.getInputProps(
                      `${guardianArr[index].fields.country}`
                    )}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <NumberInput
                    label="Mobile"
                    key={form.key(`${guardianArr[index].fields.mobile}`)}
                    size="xs"
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
                    size="xs"
                    {...form.getInputProps(
                      `${guardianArr[index].fields.email}`
                    )}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <FileInput
                    label="Signature"
                    key={form.key(`${guardianArr[index].fields.sign}`)}
                    size="xs"
                    {...form.getInputProps(`${guardianArr[index].fields.sign}`)}
                    rightSection={<IconFile />}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <TextInput
                    label="Place"
                    key={form.key(`${guardianArr[index].fields.place}`)}
                    size="xs"
                    {...form.getInputProps(
                      `${guardianArr[index].fields.place}`
                    )}
                  />
                </Grid.Col>
              </Grid>
            </>
          ))}

          <Space h={40} />

          <Center>
            <Paper py={2} px={6} bg="indigo" mb="sm">
              <Text c="#fff" size="md" fw={700}>
                Declaration
              </Text>
            </Paper>
          </Center>

          <Grid columns={12}>
            <Grid.Col span={12}>
              <Checkbox
                size="xs"
                key={form.key('consent')}
                {...form.getInputProps('consent')}
                label="I/we hereby confirm that all information provided on this form are complete and accurate to the best of my / our knowledge. I/ we understand that the admission is substantially based on the information provided by me / us. I / we also understand that at any stage if the information provided by me / us is found to be incorrect or that some information is suppressed or manipulated, it may result in immediate action to the extend to dismissal of my / our child with no fees being refunded."
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <Button fullWidth disabled={!isFormValid}>
                SUBMIT
              </Button>
            </Grid.Col>
          </Grid>
        </form>
      </Paper>
    </>
  );
}

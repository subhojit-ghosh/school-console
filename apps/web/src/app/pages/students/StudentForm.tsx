import {
  ActionIcon,
  Anchor,
  Box,
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
  Skeleton,
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
import { titleCase } from '@school-console/utils';
import {
  IconArrowBack,
  IconArrowLeft,
  IconArrowRight,
  IconCalendar,
  IconCalendarMonth,
  IconPlus,
  IconTrash,
  IconUpload,
  IconX,
} from '@tabler/icons-react';
import moment from 'moment';
import { Fragment, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  useAddStudentPersonal,
  useDeleteDocumentById,
  useGetStudentById,
  useUpdateStudentDocuments,
  useUpdateStudentGuardianInfo,
} from '../../services/students/apiQuery';
import {
  useGetAcadDropdown,
  useGetClasses,
} from '../../services/utils/apiQuery';
import { StudentPersonalType } from '../../types/student';
import { showSuccessNotification } from '../../utils/notification';

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
      <Button type="submit">Save</Button>
    )}
  </Group>
);

export default function StudentForm({ action }: StudentFormProps) {
  const { id } = useParams();
  const [studentId, setStudentId] = useState<string | null>(id || null);
  const [activeStep, setActiveStep] = useState(0);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [isBothAddressSame, setIsBothAddressSame] = useState<boolean>(false);

  const { data: classLists = [] } = useGetClasses();
  const { data: academicYears = [] } = useGetAcadDropdown();
  const saveStudentPersonal = useAddStudentPersonal();
  const saveStudentGuardian = useUpdateStudentGuardianInfo();
  const saveStudentDocuments = useUpdateStudentDocuments();
  const deleteDocumentById = useDeleteDocumentById();
  const {
    data: studentDetailsById = {},
    isFetched: studentDetailIsFetched,
    refetch: studentDetailRefetch,
  } = useGetStudentById(studentId || '');

  const prevStep = () =>
    setActiveStep((current) => (current > 0 ? current - 1 : current));

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

  const reqFieldError = '* Field is reuqied.';
  const varcharDigitFieldError = '* Field length should be 255 char(s).';
  const tenDigitFieldError = '* Field length should be 10 char(s).';
  const sixDigitFieldError = '* Field length should be 6 char(s).';
  const emailFieldError = '* Field should contain valid email.';
  const emailRegEx = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;

  const studentPersonalForm = useForm<Partial<StudentPersonalType>>({
    mode: 'uncontrolled',
    initialValues: {
      // regNo: '',
      // admissionDate: null,
      // classId: '1',
      // name: 'Aniruddha Roy',
      // dob: new Date('2020-12-06'),
      // gender: 'M',
      // religion: 'Hindu',
      // nationality: 'Indian',
      // nativeLanguage: 'Bengali',
      // caste: 'General',
      // fathersName: 'AAA',
      // fathersPhone: '1232323323',
      // mothersName: 'AAA',
      // mothersPhone: '1232323323',
      // presentAddess: 'Test',
      // presentPo: 'ER',
      // presentPs: 'WEE',
      // presentPin: 123456,
      // isBothAddressSame: true,
      // permanentAddess: 'Test',
      // permanentPo: 'ER',
      // permanentPs: 'WEE',
      // permanentPin: 123456,
      // studentPhoto: null,
      // fatherPhoto: null,
      // motherPhoto: null,
      // medicalHistory: 'N',
      // medicalFile: null,
      // previousSchoolDetails: [
      //   {
      //     key: randomId(),
      //     name: 'A',
      //     place: 'E',
      //     affilatedBoard: 'W',
      //     standard: 'W',
      //     periodStart: new Date('2021-01-01'),
      //     periodEnd: new Date('2021-01-01'),
      //   },
      // ],
      // siblingDetails: [
      //   {
      //     key: randomId(),
      //     name: 'E',
      //     dob: new Date('2024-01-01'),
      //     classId: '2',
      //     presentSchool: 'Test',
      //   },
      // ],
      previousSchoolDetails: [],
      siblingDetails: [],
      // consent: false,
    },
    validate: {
      name: (v) => (!v ? reqFieldError : null),
      classId: (v) => (!v ? reqFieldError : null),
      academicYearId: (v) => (!v ? reqFieldError : null),
      dob: (v) => (!v ? reqFieldError : null),
      gender: (v) => (!v ? reqFieldError : null),
      religion: (v) => (!v ? reqFieldError : null),
      nationality: (v) => (!v ? reqFieldError : null),
      nativeLanguage: (v) => (!v ? reqFieldError : null),
      caste: (v) => (!v ? reqFieldError : null),
      fathersName: (v) => (!v ? reqFieldError : null),
      fathersPhone: (v) =>
        !v
          ? reqFieldError
          : String(v).length !== 10
          ? tenDigitFieldError
          : null,
      mothersName: (v) => (!v ? reqFieldError : null),
      presentAddess: (v) => (!v ? reqFieldError : null),
      presentPo: (v) => (!v ? reqFieldError : null),
      presentPs: (v) => (!v ? reqFieldError : null),
      presentPin: (v) =>
        !v ? reqFieldError : String(v).length !== 6 ? sixDigitFieldError : null,

      permanentAddess: (v) => (!v ? reqFieldError : null),
      permanentPo: (v) => (!v ? reqFieldError : null),
      permanentPs: (v) => (!v ? reqFieldError : null),
      permanentPin: (v) =>
        !v ? reqFieldError : String(v).length !== 6 ? sixDigitFieldError : null,

      previousSchoolDetails: {
        name: (v) => (!v ? reqFieldError : null),
        place: (v) => (!v ? reqFieldError : null),
        affilatedBoard: (v) => (!v ? reqFieldError : null),
        periodStart: (v) => (!v ? reqFieldError : null),
        periodEnd: (v) => (!v ? reqFieldError : null),
      },
      siblingDetails: {
        name: (v) => (!v ? reqFieldError : null),
        dob: (v) => (!v ? reqFieldError : null),
        classId: (v) => (!v ? reqFieldError : null),
        presentSchool: (v) => (!v ? reqFieldError : null),
      },
    },
    onValuesChange: (
      {
        consent,
        isBothAddressSame,
        presentAddess,
        presentPo,
        presentPs,
        presentPin,
      },
      ...rest
    ) => {
      setIsFormValid(consent as boolean);
      setIsBothAddressSame(isBothAddressSame as boolean);
    },
    transformValues: (values) => ({
      ...values,
      dob: moment(values.dob).format('YYYY-MM-DD'),
      classId: Number(values.classId),
      academicYearId: Number(values.academicYearId),
      fathersPhone: String(values.fathersPhone),
      mothersPhone: String(values.mothersPhone),
      presentPin: Number(values.presentPin),
      permanentPin: Number(values.permanentPin),
      previousSchoolDetails: (values.previousSchoolDetails || []).map(
        (rec) => ({
          ...rec,
          periodStart: rec.periodStart
            ? moment(rec.periodStart).format('YYYY-MM-DD')
            : null,
          periodEnd: rec.periodEnd
            ? moment(rec.periodEnd).format('YYYY-MM-DD')
            : null,
        })
      ),
      siblingDetails: (values.siblingDetails || []).map((rec) => ({
        ...rec,
        dob: rec.dob ? moment(rec.dob).format('YYYY-MM-DD') : null,
      })),
    }),
  });
  useEffect(
    () => console.log(`debug-eff-erros`, studentPersonalForm.errors),
    [studentPersonalForm.errors]
  );

  useEffect(() => {
    if (isBothAddressSame) {
      studentPersonalForm.setValues({
        isBothAddressSame: true,
        permanentAddess: studentPersonalForm.getValues().presentAddess,
        permanentPo: studentPersonalForm.getValues().presentPo,
        permanentPs: studentPersonalForm.getValues().presentPs,
        permanentPin: studentPersonalForm.getValues().presentPin,
      });
    }
  }, [isBothAddressSame]);

  const studentGuardianForm = useForm<Partial<StudentPersonalType>>({
    initialValues: {},
    validate: {
      fatherQualification: (v) =>
        v && String(v).length > 255 ? varcharDigitFieldError : null,
      fatherAnnualIncome: (v) =>
        v && String(v).length > 255 ? varcharDigitFieldError : null,
      fatherProfession: (v) =>
        v && String(v).length > 255 ? varcharDigitFieldError : null,
      fatherCity: (v) =>
        v && String(v).length > 10 ? tenDigitFieldError : null,

      motherQualification: (v) =>
        v && String(v).length > 255 ? varcharDigitFieldError : null,
      motherAnnualIncome: (v) =>
        v && String(v).length > 255 ? varcharDigitFieldError : null,
      motherProfession: (v) =>
        v && String(v).length > 255 ? varcharDigitFieldError : null,
      motherCity: (v) =>
        v && String(v).length > 10 ? tenDigitFieldError : null,

      guardianQualification: (v) =>
        v && String(v).length > 255 ? varcharDigitFieldError : null,
      guardianAnnualIncome: (v) =>
        v && String(v).length > 255 ? varcharDigitFieldError : null,
      guardianProfession: (v) =>
        v && String(v).length > 255 ? varcharDigitFieldError : null,
      guardianCity: (v) =>
        v && String(v).length > 10 ? tenDigitFieldError : null,

      fatherPin: (v) =>
        v && String(v).length !== 6 ? sixDigitFieldError : null,
      motherPin: (v) =>
        v && String(v).length !== 6 ? sixDigitFieldError : null,
      guardianPin: (v) =>
        v && String(v).length !== 6 ? sixDigitFieldError : null,

      fatherMobile: (v) =>
        v && String(v).length !== 10 ? tenDigitFieldError : null,
      motherMobile: (v) =>
        v && String(v).length !== 10 ? tenDigitFieldError : null,
      guardianMobile: (v) =>
        v && String(v).length !== 10 ? tenDigitFieldError : null,

      fatherEmail: (v) => (v && !emailRegEx.test(v) ? emailFieldError : null),
      motherEmail: (v) => (v && !emailRegEx.test(v) ? emailFieldError : null),
      guardianEmail: (v) => (v && !emailRegEx.test(v) ? emailFieldError : null),
    },
    onValuesChange: ({ consent }, ...rest) => {
      setIsFormValid(consent as boolean);
    },
    transformValues: (values: Partial<StudentPersonalType>) => ({
      ...values,
      id: Number(values.id),
      fatherPin: values.fatherPin ? String(values.fatherPin) : null,
      fatherMobile: values.fatherMobile ? Number(values.fatherMobile) : null,
      motherPin: values.motherPin ? String(values.motherPin) : null,
      motherMobile: values.motherMobile ? Number(values.motherMobile) : null,
      guardianPin: values.guardianPin ? String(values.guardianPin) : null,
      guardianMobile: values.guardianMobile
        ? Number(values.guardianMobile)
        : null,
    }),
  });

  useEffect(() => {
    if (studentDetailIsFetched) {
      studentGuardianForm.setValues({
        ...studentDetailsById,
      });
      studentPersonalForm.setValues({
        ...studentDetailsById,
        classId: String(studentDetailsById.classId),
        academicYearId: String(studentDetailsById.academicYearId),
        dob: studentDetailsById.dob
          ? new Date(studentDetailsById.dob)
          : undefined,
        isBothAddressSame: !!studentDetailsById.isBothAddressSame,
        isTransportTaken: !!studentDetailsById.isTransportTaken,
        transportKm: studentDetailsById.isTransportTaken
          ? studentDetailsById.transportKm
          : undefined,
        previousSchoolDetails: JSON.parse(
          studentDetailsById.previousSchoolDetails
        ).map((rec: any) => ({
          ...rec,
          periodStart: rec.periodStart ? new Date(rec.periodStart) : undefined,
          periodEnd: rec.periodEnd ? new Date(rec.periodEnd) : undefined,
        })),
        siblingDetails: JSON.parse(studentDetailsById.siblingDetails).map(
          (rec: any) => ({
            ...rec,
            dob: rec.dob ? new Date(rec.dob) : undefined,
            classId: String(rec.classId),
          })
        ),
      });
      studentDocumentForm.setValues({
        medicalHistory: Boolean(studentDetailsById.medicalHistory) ? 'Y' : 'N',
        medicalHistoryDetails: studentDetailsById.medicalHistoryDetails,
        studentPhotoR: studentDetailsById.studentPhoto,
        fatherPhotoR: studentDetailsById.fatherPhoto,
        motherPhotoR: studentDetailsById.motherPhoto,
        studentBirthCertificateR: studentDetailsById.studentBirthCertificate,
        studentVacinationRecordR: studentDetailsById.studentVacinationRecord,
        studentMedicalRecordR: studentDetailsById.studentMedicalRecord,
        fatherSignatureR: studentDetailsById.fatherSignature,
        motherSignatureR: studentDetailsById.motherSignature,
        guardianSignatureR: studentDetailsById.guardianSignature,
      });
    }
  }, [studentDetailsById, studentDetailIsFetched]);

  useEffect(() => {
    if (!studentId) {
      const activeYr = academicYears.filter((item: any) => item.isActive);
      if (activeYr.length > 0)
        studentPersonalForm.setValues({
          academicYearId: String(activeYr[0].id),
        });
    }
  }, [academicYears]);

  const studentDocumentForm = useForm<Partial<StudentPersonalType>>({
    mode: 'controlled',
    initialValues: {
      medicalHistory: 'N',
    },
    validate: {
      medicalHistoryDetails: (v, vs) =>
        vs.medicalHistory === 'Y' && !v ? reqFieldError : null,
      studentMedicalRecord: (v, vs) =>
        vs.medicalHistory === 'Y' && !v && !vs.studentMedicalRecordR
          ? reqFieldError
          : null,
    },
  });

  function onSavePersonalRecords(v: Partial<StudentPersonalType>) {
    saveStudentPersonal.mutate(
      {
        ...v,
        previousSchoolDetails: JSON.stringify(
          v.previousSchoolDetails && v.previousSchoolDetails?.length > 0
            ? v.previousSchoolDetails
            : []
        ),
        siblingDetails: JSON.stringify(
          v.siblingDetails && v.siblingDetails.length > 0
            ? v.siblingDetails
            : []
        ),
        transportKm: v.isTransportTaken ? Number(v.transportKm) : 0,
      },
      {
        onSuccess: (dt) => {
          if (dt[0].insertId) setStudentId(dt[0].insertId);
          showSuccessNotification(
            `Student Personal Record ${
              studentId ? 'Edited' : 'Created'
            } successfully.`
          );
          studentDetailRefetch();
          nextStep();
        },
      }
    );
  }

  function onSaveGuardianRecords(v: Partial<StudentPersonalType>) {
    saveStudentGuardian.mutate(
      {
        ...v,
        id: Number(studentId),
        fatherAnnualIncome: v.fatherAnnualIncome
          ? Number(v.fatherAnnualIncome)
          : null,
        motherAnnualIncome: v.motherAnnualIncome
          ? Number(v.motherAnnualIncome)
          : null,
        guardianAnnualIncome: v.guardianAnnualIncome
          ? Number(v.guardianAnnualIncome)
          : null,
      },
      {
        onSuccess: (dt) => {
          showSuccessNotification(
            'Student Guardian info updated successfully.'
          );
          studentDetailRefetch();
          nextStep();
        },
      }
    );
  }

  function onSaveStudentDocument(v: Partial<StudentPersonalType>) {
    // const medicalHistoryTiny = v.medicalHistory;
    const formData = new FormData();
    for (const key in v) {
      if (v.hasOwnProperty(key) && v[key]) {
        // @ts-ignore
        formData.append(key, v[key]);
      }
    }

    saveStudentDocuments.mutate(
      {
        id: Number(studentId),
        formData: formData,
      },
      {
        onSuccess: (dt) => {
          studentDocumentForm.setValues({
            studentPhoto: null,
            fatherPhoto: null,
            motherPhoto: null,
            studentBirthCertificate: null,
            studentVacinationRecord: null,
            studentMedicalRecord: null,
            fatherSignature: null,
            motherSignature: null,
            guardianSignature: null,
            medicalHistoryDetails: '',
          });
          showSuccessNotification(
            'Student Document info updated successfully.'
          );
          studentDetailRefetch();
        },
      }
    );
  }

  const nextStep = () => {
    // console.log(
    //   'debug-activeStep',
    //   activeStep,
    //   studentPersonalForm.getValues()
    // );
    setActiveStep((current) => (current < stepsCount ? current + 1 : current));
  };

  function deleteDocById(fileName: string, fileKey: string) {
    console.log('debug-delete', fileName, fileKey);
    deleteDocumentById.mutate(
      {
        id: studentId,
        fileName,
        fileKey,
      },
      {
        onSuccess: (dt) => {
          showSuccessNotification('Document deleted.');
          studentDetailRefetch();
        },
      }
    );
  }

  const FileNameAnchor = ({ file, fileKey }: { file: any; fileKey: string }) =>
    file && (
      <Group justify="space-between">
        <Anchor
          href={`${import.meta.env.VITE_API_GATEWAY}${file}`}
          target="_blank"
          underline="hover"
        >
          <Box w={150}>
            <Text size="xs" mt="xs" truncate="end">
              {file}
            </Text>
          </Box>
        </Anchor>

        <ActionIcon
          variant="transparent"
          color="red"
          onClick={() => deleteDocById(file, fileKey)}
        >
          <IconX />
        </ActionIcon>
      </Group>
    );

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
                    {academicYears.length ? (
                      <Select
                        label="Academic Year"
                        placeholder="Select"
                        data={academicYears || []}
                        withAsterisk
                        {...studentPersonalForm.getInputProps('academicYearId')}
                        key={studentPersonalForm.key('academicYearId')}
                        disabled={studentPersonalForm.getValues().isEnrolled}
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
                    <NumberInput
                      label="Father's Ph No."
                      minLength={10}
                      maxLength={10}
                      withAsterisk
                      key={studentPersonalForm.key('fathersPhone')}
                      {...studentPersonalForm.getInputProps('fathersPhone')}
                      leftSection={<Text size="sm">+91</Text>}
                      hideControls={true}
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
                    <NumberInput
                      label="Mother's Ph No."
                      minLength={10}
                      maxLength={10}
                      withAsterisk
                      key={studentPersonalForm.key('mothersPhone')}
                      {...studentPersonalForm.getInputProps('mothersPhone')}
                      leftSection={<Text size="sm">+91</Text>}
                      hideControls={true}
                    />
                  </Grid.Col>
                  <Grid.Col span={3}>
                    <Checkbox
                      mt="23px"
                      defaultChecked
                      label="Is Transport Taken"
                      checked={studentPersonalForm.getValues().isTransportTaken}
                      key={studentPersonalForm.key('isTransportTaken')}
                      {...studentPersonalForm.getInputProps('isTransportTaken')}
                      onChange={(e) => {
                        studentPersonalForm.setValues({
                          isTransportTaken: e.currentTarget.checked,
                          transportKm: undefined,
                        });
                      }}
                    />
                  </Grid.Col>

                  {studentPersonalForm.getValues().isTransportTaken && (
                    <Grid.Col span={3}>
                      <NumberInput
                        label="Distance (Km)"
                        minLength={0}
                        withAsterisk={
                          studentPersonalForm.getValues().isTransportTaken
                        }
                        key={studentPersonalForm.key('transportKm')}
                        {...studentPersonalForm.getInputProps('transportKm')}
                        rightSection={<Text size="sm">Km</Text>}
                        hideControls={true}
                      />
                    </Grid.Col>
                  )}

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
                      minLength={6}
                      maxLength={6}
                    />
                  </Grid.Col>

                  <Grid.Col span={12}>
                    <Checkbox
                      label="Is Both Address are same?"
                      checked={
                        studentPersonalForm.getValues().isBothAddressSame
                      }
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
                      disabled={
                        studentPersonalForm.getValues().isBothAddressSame
                      }
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <TextInput
                      label="P.O"
                      withAsterisk
                      key={studentPersonalForm.key('permanentPo')}
                      {...studentPersonalForm.getInputProps('permanentPo')}
                      disabled={
                        studentPersonalForm.getValues().isBothAddressSame
                      }
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <TextInput
                      label="P.S"
                      withAsterisk
                      key={studentPersonalForm.key('permanentPs')}
                      {...studentPersonalForm.getInputProps('permanentPs')}
                      disabled={
                        studentPersonalForm.getValues().isBothAddressSame
                      }
                    />
                  </Grid.Col>
                  <Grid.Col span={4}>
                    <NumberInput
                      label="Pin"
                      withAsterisk
                      key={studentPersonalForm.key('permanentPin')}
                      {...studentPersonalForm.getInputProps('permanentPin')}
                      disabled={
                        studentPersonalForm.getValues().isBothAddressSame
                      }
                      minLength={6}
                      maxLength={6}
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
            <form
              onSubmit={studentGuardianForm.onSubmit(onSaveGuardianRecords)}
            >
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
                        key={studentGuardianForm.key(
                          `${guardianArr[index].fields.qualification}`
                        )}
                        {...studentGuardianForm.getInputProps(
                          `${guardianArr[index].fields.qualification}`
                        )}
                        maxLength={255}
                      />
                    </Grid.Col>
                    <Grid.Col span={4}>
                      <TextInput
                        label="Profession"
                        key={studentGuardianForm.key(
                          `${guardianArr[index].fields.profession}`
                        )}
                        {...studentGuardianForm.getInputProps(
                          `${guardianArr[index].fields.profession}`
                        )}
                        maxLength={255}
                      />
                    </Grid.Col>
                    <Grid.Col span={4}>
                      <NumberInput
                        label="Annual Income"
                        key={studentGuardianForm.key(
                          `${guardianArr[index].fields.annualIncome}`
                        )}
                        {...studentGuardianForm.getInputProps(
                          `${guardianArr[index].fields.annualIncome}`
                        )}
                        hideControls
                      />
                    </Grid.Col>
                    <Grid.Col span={12}>
                      <Textarea
                        label="Office Address"
                        key={studentGuardianForm.key(
                          `${guardianArr[index].fields.address}`
                        )}
                        {...studentGuardianForm.getInputProps(
                          `${guardianArr[index].fields.address}`
                        )}
                      />
                    </Grid.Col>
                    <Grid.Col span={4}>
                      <TextInput
                        label="Town/City"
                        key={studentGuardianForm.key(
                          `${guardianArr[index].fields.city}`
                        )}
                        {...studentGuardianForm.getInputProps(
                          `${guardianArr[index].fields.city}`
                        )}
                      />
                    </Grid.Col>
                    <Grid.Col span={4}>
                      <NumberInput
                        label="Pin"
                        key={studentGuardianForm.key(
                          `${guardianArr[index].fields.pin}`
                        )}
                        {...studentGuardianForm.getInputProps(
                          `${guardianArr[index].fields.pin}`
                        )}
                        hideControls={true}
                        minLength={6}
                        maxLength={6}
                      />
                    </Grid.Col>
                    <Grid.Col span={4}>
                      <Select
                        label="State"
                        data={['West Bengal']}
                        key={studentGuardianForm.key(
                          `${guardianArr[index].fields.state}`
                        )}
                        {...studentGuardianForm.getInputProps(
                          `${guardianArr[index].fields.state}`
                        )}
                      />
                    </Grid.Col>
                    <Grid.Col span={4}>
                      <Select
                        label="Country"
                        data={['India']}
                        key={studentGuardianForm.key(
                          `${guardianArr[index].fields.country}`
                        )}
                        {...studentGuardianForm.getInputProps(
                          `${guardianArr[index].fields.country}`
                        )}
                      />
                    </Grid.Col>
                    <Grid.Col span={4}>
                      <NumberInput
                        label="Mobile"
                        key={studentGuardianForm.key(
                          `${guardianArr[index].fields.mobile}`
                        )}
                        {...studentGuardianForm.getInputProps(
                          `${guardianArr[index].fields.mobile}`
                        )}
                        hideControls
                      />
                    </Grid.Col>
                    <Grid.Col span={4}>
                      <TextInput
                        label="Email"
                        key={studentGuardianForm.key(
                          `${guardianArr[index].fields.email}`
                        )}
                        {...studentGuardianForm.getInputProps(
                          `${guardianArr[index].fields.email}`
                        )}
                      />
                    </Grid.Col>
                    {/* <Grid.Col span={4}>
                    <FileInput
                      label="Signature"
                      key={form.key(`${guardianArr[index].fields.sign}`)}
                      {...form.getInputProps(
                        `${guardianArr[index].fields.sign}`
                      )}
                      leftSection={<IconUpload size={18} />}
                    />
                  </Grid.Col> */}
                    <Grid.Col span={4}>
                      <TextInput
                        label="Place"
                        key={studentGuardianForm.key(
                          `${guardianArr[index].fields.place}`
                        )}
                        {...studentGuardianForm.getInputProps(
                          `${guardianArr[index].fields.place}`
                        )}
                      />
                    </Grid.Col>
                  </Grid>
                </Fragment>
              ))}

              <StepperNavigation prevStep={prevStep} activeStep={activeStep} />
            </form>
          </Stepper.Step>

          <Stepper.Step label="Photos / Documents">
            <Space h={20} />
            <form
              onSubmit={studentDocumentForm.onSubmit(onSaveStudentDocument)}
            >
              <Grid>
                <Grid.Col span={4}>
                  <FileInput
                    label="Student's Photo"
                    leftSection={<IconUpload size={18} />}
                    {...studentDocumentForm.getInputProps('studentPhoto')}
                  />
                  <FileNameAnchor
                    file={studentDocumentForm.values.studentPhotoR}
                    fileKey="studentPhoto"
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <FileInput
                    label="Father's Photo"
                    leftSection={<IconUpload size={18} />}
                    {...studentDocumentForm.getInputProps('fatherPhoto')}
                  />
                  <FileNameAnchor
                    file={studentDocumentForm.values.fatherPhotoR}
                    fileKey="fatherPhoto"
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <FileInput
                    label="Mother's Photo"
                    leftSection={<IconUpload size={18} />}
                    {...studentDocumentForm.getInputProps('motherPhoto')}
                  />
                  <FileNameAnchor
                    file={studentDocumentForm.values.motherPhotoR}
                    fileKey="motherPhoto"
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <FileInput
                    label="Student's Birth Certificate"
                    leftSection={<IconUpload size={18} />}
                    {...studentDocumentForm.getInputProps(
                      'studentBirthCertificate'
                    )}
                  />
                  <FileNameAnchor
                    file={studentDocumentForm.values.studentBirthCertificateR}
                    fileKey="studentBirthCertificate"
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <FileInput
                    label="Student's Vaccination Record"
                    leftSection={<IconUpload size={18} />}
                    {...studentDocumentForm.getInputProps(
                      'studentVacinationRecord'
                    )}
                  />
                  <FileNameAnchor
                    file={studentDocumentForm.values.studentVacinationRecordR}
                    fileKey="studentVacinationRecord"
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <Radio.Group
                    name="medicalHistory"
                    label="Medical History"
                    withAsterisk
                    {...studentDocumentForm.getInputProps('medicalHistory')}
                    onChange={(e) => {
                      studentDocumentForm.setFieldValue('medicalHistory', e);
                      studentDocumentForm.setFieldValue(
                        'studentMedicalRecord',
                        null
                      );
                    }}
                  >
                    <Group mt="xs">
                      <Radio value="Y" label="Yes" />
                      <Radio value="N" label="No" />
                    </Group>
                  </Radio.Group>
                </Grid.Col>
                {studentDocumentForm.values.medicalHistory === 'Y' && (
                  <>
                    <Grid.Col span={8}>
                      <Textarea
                        label="Medical History Details"
                        withAsterisk
                        {...studentDocumentForm.getInputProps(
                          'medicalHistoryDetails'
                        )}
                      />
                    </Grid.Col>
                    <Grid.Col span={4}>
                      <FileInput
                        label="Medical Records"
                        leftSection={<IconUpload size={18} />}
                        withAsterisk
                        {...studentDocumentForm.getInputProps(
                          'studentMedicalRecord'
                        )}
                      />
                      <FileNameAnchor
                        file={studentDocumentForm.values.studentMedicalRecordR}
                        fileKey="studentMedicalRecord"
                      />
                    </Grid.Col>
                  </>
                )}
                <Grid.Col span={4}>
                  <FileInput
                    label="Father's Signature"
                    leftSection={<IconUpload size={18} />}
                    {...studentDocumentForm.getInputProps('fatherSignature')}
                  />
                  <FileNameAnchor
                    file={studentDocumentForm.values.fatherSignatureR}
                    fileKey="fatherSignature"
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <FileInput
                    label="Mother's Signature"
                    leftSection={<IconUpload size={18} />}
                    {...studentDocumentForm.getInputProps('motherSignature')}
                  />
                  <FileNameAnchor
                    file={studentDocumentForm.values.motherSignatureR}
                    fileKey="motherSignature"
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <FileInput
                    label="Guardian's Signature"
                    leftSection={<IconUpload size={18} />}
                    {...studentDocumentForm.getInputProps('guardainSignature')}
                  />
                  <FileNameAnchor
                    file={studentDocumentForm.values.guardianSignatureR}
                    fileKey="guardainSignature"
                  />
                </Grid.Col>
              </Grid>
              <StepperNavigation prevStep={prevStep} activeStep={activeStep} />
            </form>
          </Stepper.Step>
        </Stepper>
      </Paper>
    </>
  );
}

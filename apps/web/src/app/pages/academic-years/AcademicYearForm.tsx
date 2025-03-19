import { Button, Grid, Group, Modal, TextInput } from '@mantine/core';
import { DateInput, YearPickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { IconCalendar } from '@tabler/icons-react';
import { yupResolver } from 'mantine-form-yup-resolver';
import moment from 'moment';
import { ChangeEvent, useEffect, useState } from 'react';
import * as yup from 'yup';
import endpoints from '../../api/endpoints';
import httpClient from '../../api/http-client';
import { showSuccessNotification } from '../../utils/notification';

export default function AcademicYearForm({
  opened,
  close,
  mode,
  data,
  fetchList,
}: any) {
  const [loading, setLoading] = useState(false);
  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      startYear: null,
      endYear: null,
      name: '',
      startDate: '',
      endDate: '',
      studentIdPrefix: '',
    },
    validate: yupResolver(
      yup.object().shape({
        startYear: yup.string().trim().required('Start Year is required'),
        studentIdPrefix: yup
          .string()
          .trim()
          .required('Student ID Prefix is required'),
      })
    ),
  });

  useEffect(() => {
    if (mode === 'add') {
      form.reset();
      loadNextStudentIdPrefix();
    }

    if (mode === 'edit') {
      form.setValues({
        startYear: new Date(data.startDate) as any,
        endYear: new Date(data.endDate) as any,
        name: data.name,
        startDate: new Date(data.startDate) as any,
        endDate: new Date(data.endDate) as any,
        studentIdPrefix: data.studentIdPrefix,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, mode, opened]);

  useEffect(() => {
    if (form.values.startYear) {
      const startYear = (form.values.startYear as Date).getFullYear();
      form.setValues({
        endYear: new Date(`${startYear + 1}-01-01`) as any,
        name: `${startYear} - ${startYear + 1}`,
        startDate: new Date(`${startYear}-04-01`) as any,
        endDate: new Date(`${startYear + 1}-03-31`) as any,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values.startYear]);

  const loadNextStudentIdPrefix = async () => {
    try {
      const { data } = await httpClient.get(
        endpoints.academicYears.nextStudentIdPrefix()
      );
      form.setFieldValue('studentIdPrefix', data.prefix);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const values = {
      ...form.values,
      startDate: moment(form.values.startDate).format('YYYY-MM-DD'),
      endDate: moment(form.values.endDate).format('YYYY-MM-DD'),
    };

    try {
      if (mode === 'add') {
        await httpClient.post(endpoints.academicYears.create(), values);
        showSuccessNotification('Academic Year added successfully');
      }

      if (mode === 'edit') {
        await httpClient.put(endpoints.academicYears.update(data.id), values);
        showSuccessNotification('Academic Year updated successfully');
      }

      fetchList();
      form.reset();
      close();
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <Modal
      centered
      opened={opened}
      onClose={close}
      title={mode === 'add' ? 'Add Academic Year' : 'Edit Academic Year'}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Grid>
          <Grid.Col span={6}>
            <YearPickerInput
              label="Start Year"
              leftSection={<IconCalendar size={18} />}
              withAsterisk
              {...form.getInputProps('startYear')}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <YearPickerInput
              label="End Year"
              leftSection={<IconCalendar size={18} />}
              {...form.getInputProps('endYear')}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <DateInput
              label="Start Date"
              {...form.getInputProps('startDate')}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <DateInput label="End Date" {...form.getInputProps('endDate')} />
          </Grid.Col>
          <Grid.Col span={12}>
            <TextInput
              label="Student ID Prefix"
              {...form.getInputProps('studentIdPrefix')}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const upperCasedValue = e.target.value.toUpperCase();
                form.setFieldValue('studentIdPrefix', upperCasedValue);
              }}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Group justify="space-between">
              <Button variant="subtle" onClick={() => close()}>
                Cancel
              </Button>
              <Button loading={loading} type="submit">
                Save
              </Button>
            </Group>
          </Grid.Col>
        </Grid>
      </form>
    </Modal>
  );
}

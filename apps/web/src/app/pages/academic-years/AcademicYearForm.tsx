import { Button, Grid, Group, Modal, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
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
      name: '',
      startDate: '',
      endDate: '',
    },
    validate: yupResolver(
      yup.object().shape({
        name: yup.string().trim().required('Name is required'),
        startDate: yup.date().required('Start Date is required'),
        endDate: yup.date().required('End Date is required'),
      })
    ),
  });

  useEffect(() => {
    if (mode === 'add') {
      form.reset();
    }

    if (mode === 'edit') {
      form.setValues({
        name: data.name,
        startDate: new Date(data.startDate) as any,
        endDate: new Date(data.endDate) as any,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, mode]);

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
          <Grid.Col span={12}>
            <TextInput
              label="Name"
              withAsterisk
              {...form.getInputProps('name')}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const upperCasedValue = e.target.value.toUpperCase();
                form.setFieldValue('name', upperCasedValue);
              }}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <DateInput
              label="Start Date"
              withAsterisk
              size="xs"
              {...form.getInputProps('startDate')}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <DateInput
              label="End Date"
              withAsterisk
              size="xs"
              {...form.getInputProps('endDate')}
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

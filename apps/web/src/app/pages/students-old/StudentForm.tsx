import { Button, Grid, Group, Modal, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { yupResolver } from 'mantine-form-yup-resolver';
import { ChangeEvent, useEffect, useState } from 'react';
import * as yup from 'yup';
import endpoints from '../../api/endpoints';
import httpClient from '../../api/http-client';
import { showSuccessNotification } from '../../utils/notification';

export default function StudentForm({
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
      id: '',
      name: '',
      fatherName: '',
    },
    validate: yupResolver(
      yup.object().shape({
        id: yup.string().trim().required('ID is required'),
        name: yup.string().trim().required('Name is required'),
        fatherName: yup.string().trim().required("Father's Name is required"),
      })
    ),
  });

  useEffect(() => {
    if (mode === 'add') {
      form.reset();
    }

    if (mode === 'edit') {
      form.setValues({
        id: data?.id || '',
        name: data?.name || '',
        fatherName: data?.fatherName || '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, mode]);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      if (mode === 'add') {
        await httpClient.post(endpoints.students.create(), form.values);
        showSuccessNotification('Student added successfully');
      }

      if (mode === 'edit') {
        await httpClient.put(endpoints.students.update(data.id), form.values);
        showSuccessNotification('Student updated successfully');
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
      title={mode === 'add' ? 'Add Student' : 'Edit Student'}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Grid>
          <Grid.Col span={12}>
            <TextInput
              label="ID"
              withAsterisk
              {...form.getInputProps('id')}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const upperCasedValue = e.target.value.toUpperCase();
                form.setFieldValue('id', upperCasedValue);
              }}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <TextInput
              label="Name"
              withAsterisk
              {...form.getInputProps('name')}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <TextInput
              label="Father's Name"
              withAsterisk
              {...form.getInputProps('fatherName')}
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

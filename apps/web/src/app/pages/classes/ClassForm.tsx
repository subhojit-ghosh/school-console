import {
  Button,
  Grid,
  Group,
  Modal,
  MultiSelect,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { yupResolver } from 'mantine-form-yup-resolver';
import { ChangeEvent, useEffect, useState } from 'react';
import * as yup from 'yup';
import endpoints from '../../api/endpoints';
import httpClient from '../../api/http-client';
import { sections } from '../../data/sections';
import { showSuccessNotification } from '../../utils/notification';

export default function ClassForm({
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
      sections: [],
    },
    validate: yupResolver(
      yup.object().shape({
        name: yup.string().trim().required('Name is required'),
        sections: yup.array().min(1, 'At least one section is required'),
      })
    ),
  });

  useEffect(() => {
    if (mode === 'add') {
      form.reset();
    }

    if (mode === 'edit') {
      form.setValues({
        name: data?.name || '',
        sections: data?.sections || [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, mode]);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      if (mode === 'add') {
        await httpClient.post(endpoints.classes.create(), form.values);
        showSuccessNotification('Class added successfully');
      }

      if (mode === 'edit') {
        await httpClient.put(endpoints.classes.update(data.id), form.values);
        showSuccessNotification('Class updated successfully');
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
      title={mode === 'add' ? 'Add Class' : 'Edit Class'}
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
            <MultiSelect
              label="Sections"
              data={sections}
              withAsterisk
              {...form.getInputProps('sections')}
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

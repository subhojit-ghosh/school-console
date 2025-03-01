import {
  Button,
  Grid,
  Group,
  Modal,
  PasswordInput,
  Select,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { yupResolver } from 'mantine-form-yup-resolver';
import { useEffect, useState } from 'react';
import * as yup from 'yup';
import endpoints from '../../api/endpoints';
import httpClient from '../../api/http-client';
import { roles } from '../../data/roles';
import { showSuccessNotification } from '../../utils/notification';

export default function UserForm({
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
      username: '',
      password: '',
      role: '',
    },
    validate: yupResolver(
      yup.object().shape({
        name: yup.string().trim().required('Name is required'),
        username: yup.string().trim().required('Username is required'),
        password: yup
          .string()
          .trim()
          .when([], {
            is: () => mode === 'add',
            then: (schema) => schema.required('Password is required'),
            otherwise: (schema) => schema.notRequired(),
          }),
        role: yup.string().trim().required('Role is required'),
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
        username: data?.username || '',
        role: data?.role || '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, mode]);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      if (mode === 'add') {
        await httpClient.post(endpoints.users.create(), form.values);
        showSuccessNotification('User added successfully');
      }

      if (mode === 'edit') {
        await httpClient.put(endpoints.users.update(data.id), form.values);
        showSuccessNotification('User updated successfully');
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
      title={mode === 'add' ? 'Add User' : 'Edit User'}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Grid>
          <Grid.Col span={12}>
            <TextInput
              label="Name"
              withAsterisk
              {...form.getInputProps('name')}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <TextInput
              label="Username"
              withAsterisk
              {...form.getInputProps('username')}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <PasswordInput
              label="Password"
              withAsterisk={mode === 'add'}
              placeholder={
                mode === 'edit' ? 'Leave empty to keep current password' : ''
              }
              autoComplete="new-password"
              {...form.getInputProps('password')}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Select
              label="Role"
              withAsterisk
              data={roles}
              {...form.getInputProps('role')}
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

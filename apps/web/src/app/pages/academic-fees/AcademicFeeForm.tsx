import {
  Button,
  Grid,
  Group,
  Modal,
  NumberInput,
  Select,
  TextInput,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { yupResolver } from 'mantine-form-yup-resolver';
import moment from 'moment';
import { useEffect, useState } from 'react';
import * as yup from 'yup';
import endpoints from '../../api/endpoints';
import httpClient from '../../api/http-client';
import { FeeCategories } from '../../data/fee-categories';
import { showSuccessNotification } from '../../utils/notification';

export default function AcademicFeeForm({
  opened,
  close,
  mode,
  data,
  fetchList,
  academicYears,
  classes,
}: any) {
  const [loading, setLoading] = useState(false);
  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      category: '',
      academicYearId: '',
      classId: '',
      name: '',
      amount: '',
      dueDate: '',
    },
    validate: yupResolver(
      yup.object().shape({
        category: yup.string().trim().required('Category is required'),
        academicYearId: yup
          .string()
          .trim()
          .required('Academic Year is required'),
        classId: yup.string().trim().required('Class is required'),
        name: yup.string().trim().required('Name is required'),
        amount: yup
          .number()
          .typeError('Amount must be a number')
          .required('Amount is required'),
        dueDate: yup.string(),
      })
    ),
  });

  useEffect(() => {
    if (mode === 'add') {
      form.reset();
    }

    if (mode === 'edit') {
      form.setValues({
        name: data.name || '',
        academicYearId: String(data.academicYearId) || '',
        classId: data.classId ? String(data.classId) : '',
        amount: data.amount || '',
        dueDate: data.dueDate ? (new Date(data.dueDate) as any) : '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, mode]);

  const handleSubmit = async () => {
    setLoading(true);

    const values = {
      ...form.values,
      academicYearId: Number(form.values.academicYearId),
      classId: form.values.classId ? Number(form.values.classId) : null,
      dueDate: form.values.dueDate
        ? moment(form.values.dueDate).format('YYYY-MM-DD')
        : null,
    };

    try {
      if (mode === 'add') {
        await httpClient.post(endpoints.academicFees.create(), values);
        showSuccessNotification('Academic Fee added successfully');
      }

      if (mode === 'edit') {
        await httpClient.put(endpoints.academicFees.update(data.id), values);
        showSuccessNotification('Academic Fee updated successfully');
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
      title={mode === 'add' ? 'Add Academic Fee' : 'Edit Academic Fee'}
    >
      <form
        onSubmit={form.onSubmit(handleSubmit, () => {
          console.log(form.errors);
        })}
      >
        <Grid>
          <Grid.Col span={12}>
            <Select
              label="Academic Year"
              placeholder="Select"
              data={academicYears.map((item: any) => ({
                label: item.name,
                value: String(item.id),
              }))}
              withAsterisk
              {...form.getInputProps('academicYearId')}
            />
          </Grid.Col>
          <Grid.Col span={12}>
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
          <Grid.Col span={12}>
            <Select
              label="Category"
              placeholder="Select"
              data={FeeCategories}
              withAsterisk
              {...form.getInputProps('category')}
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
            <NumberInput
              label="Amount"
              withAsterisk
              allowDecimal={false}
              prefix="₹"
              {...form.getInputProps('amount')}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <DateInput label="Due Date" {...form.getInputProps('dueDate')} />
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

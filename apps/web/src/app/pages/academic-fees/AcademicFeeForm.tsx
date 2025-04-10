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
import { showSuccessNotification } from '../../utils/notification';
import { academicFeeNames } from '../../data/academic-fee-names';

export default function AcademicFeeForm({
  opened,
  close,
  mode,
  data,
  fetchList,
  academicYears,
  classes,
  filters,
}: any) {
  const [loading, setLoading] = useState(false);
  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      academicYearId: '',
      classId: '',
      name: '',
      amount: '',
      dueDate: '',
      cname: '',
    },
    validate: yupResolver(
      yup.object().shape({
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
        cname: yup.string().when('name', {
          is: (val: string) => val === 'Other',
          then: (s) => s.required('Please specity the Other Name.'),
          otherwise: (s) => s,
        }),
      })
    ),
  });

  useEffect(() => {
    populatePreselectedValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  useEffect(() => {
    if (mode === 'add') {
      form.reset();
    }

    if (mode === 'edit') {
      let isMatched = false;
      academicFeeNames.every((rec) => {
        if (rec.value === data.name) {
          isMatched = true;
          return false;
        }
        return true;
      });
      form.setValues({
        name: data.name ? (isMatched ? data.name : 'Other') : '',
        academicYearId: String(data.academicYearId) || '',
        classId: data.classId ? String(data.classId) : '',
        amount: data.amount || '',
        dueDate: data.dueDate ? (new Date(data.dueDate) as any) : '',
        cname: data.name,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, mode]);

  const populatePreselectedValues = () => {
    form.setFieldValue('academicYearId', filters.academicYearId || '');
    form.setFieldValue('classId', filters.classId || '');
  };

  const handleSubmit = async () => {
    setLoading(true);

    const values = {
      ...form.values,
      academicYearId: Number(form.values.academicYearId),
      classId: form.values.classId ? Number(form.values.classId) : null,
      dueDate: form.values.dueDate
        ? moment(form.values.dueDate).format('YYYY-MM-DD')
        : null,
      name: form.values.name === 'Other' ? form.values.cname : form.values.name,
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
      populatePreselectedValues();
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
          <Grid.Col span={6}>
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
          <Grid.Col span={6}>
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
              label="Fee Name"
              placeholder="Select"
              data={academicFeeNames}
              searchable
              withAsterisk
              {...form.getInputProps('name')}
              onChange={(e) => {
                form.setValues({
                  name: e || '',
                  cname: '',
                });
              }}
            />
          </Grid.Col>
          {form.values.name === 'Other' && (
            <Grid.Col span={12}>
              <TextInput
                label="Other Name"
                withAsterisk
                {...form.getInputProps('cname')}
              />
            </Grid.Col>
          )}

          <Grid.Col span={6}>
            <NumberInput
              label="Amount"
              withAsterisk
              allowDecimal={false}
              prefix="₹"
              thousandSeparator=","
              {...form.getInputProps('amount')}
            />
          </Grid.Col>
          <Grid.Col span={6}>
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

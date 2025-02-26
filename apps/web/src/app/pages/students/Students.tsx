import {
  ActionIcon,
  Box,
  Button,
  Group,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';
import { IconEdit, IconPlus, IconSearch, IconX } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';

function StudentsPage() {
  return (
    <>
      <Group justify="space-between">
        <Title size="md" mt="md" mb="lg">
          Students
        </Title>
        <Button
          variant="filled"
          size="xs"
          radius="sm"
          color="orange"
          leftSection={<IconPlus size={14} />}
        >
          Add
        </Button>
      </Group>

      <DataTable
        withTableBorder
        withColumnBorders
        borderRadius="sm"
        striped
        highlightOnHover
        totalRecords={100}
        recordsPerPage={10}
        page={1}
        onPageChange={(p) => console.log(p)}
        records={[
          {
            reg_no: 1001,
            reg_year: '2024',
            name: 'John Doe',
            father_name: 'John Doe Sr.',
          },
          {
            reg_no: 1002,
            reg_year: '2024',
            name: 'Jane Doe',
            father_name: 'John Doe Sr.',
          },
          {
            reg_no: 1003,
            reg_year: '2024',
            name: 'John Smith',
            father_name: 'John Smith Sr.',
          },
          {
            reg_no: 1004,
            reg_year: '2024',
            name: 'Jane Smith',
            father_name: 'John Smith Sr.',
          },
        ]}
        columns={[
          {
            accessor: 'reg_no',
            title: 'Reg No.',
            sortable: true,
            filter: (
              <TextInput
                label="Reg No."
                leftSection={<IconSearch size={16} />}
                rightSection={
                  <ActionIcon size="sm" variant="transparent" c="dimmed">
                    <IconX size={14} />
                  </ActionIcon>
                }
              />
            ),
          },
          {
            accessor: 'reg_year',
            title: 'Reg Year',
            sortable: true,
            filter: (
              <TextInput
                label="Reg Year"
                leftSection={<IconSearch size={16} />}
                rightSection={
                  <ActionIcon size="sm" variant="transparent" c="dimmed">
                    <IconX size={14} />
                  </ActionIcon>
                }
              />
            ),
          },
          {
            accessor: 'name',
            title: 'Name',
            filter: (
              <TextInput
                label="Name"
                leftSection={<IconSearch size={16} />}
                rightSection={
                  <ActionIcon size="sm" variant="transparent" c="dimmed">
                    <IconX size={14} />
                  </ActionIcon>
                }
              />
            ),
          },
          {
            accessor: 'father_name',
            title: "Father's Name",
            filter: (
              <TextInput
                label="Father's Name"
                leftSection={<IconSearch size={16} />}
                rightSection={
                  <ActionIcon size="sm" variant="transparent" c="dimmed">
                    <IconX size={14} />
                  </ActionIcon>
                }
              />
            ),
          },
          {
            accessor: 'actions',
            title: <Box mr={6}>Actions</Box>,
            textAlign: 'right',
            render: (company) => (
              <Group gap={4} justify="right" wrap="nowrap">
                <Tooltip label="Edit" withArrow>
                  <ActionIcon size="sm" variant="subtle" color="orange">
                    <IconEdit size={16} />
                  </ActionIcon>
                </Tooltip>
                {/* <Tooltip label="Delete" withArrow>
                  <ActionIcon size="sm" variant="subtle" color="red">
                    <IconTrash size={16} />
                  </ActionIcon>
                </Tooltip> */}
              </Group>
            ),
          },
        ]}
      />
    </>
  );
}

export default StudentsPage;

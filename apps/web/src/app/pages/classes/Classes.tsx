import {
  ActionIcon,
  Box,
  Button,
  Card,
  Group,
  SimpleGrid,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';

function ClassesPage() {
  const records = [
    {
      name: 'Toddler',
    },
    {
      name: 'Nursery',
    },
    {
      name: 'LKG',
    },
    {
      name: 'UKG',
    },
    {
      name: '1st Standard',
    },
    {
      name: '2nd Standard',
    },
    {
      name: '3rd Standard',
    },
    {
      name: '4th Standard',
    },
    {
      name: '5th Standard',
    },
    {
      name: '6th Standard',
    },
    {
      name: '7th Standard',
    },
    {
      name: '8th Standard',
    },
    {
      name: '9th Standard',
    },
    {
      name: '10th Standard',
    },
    {
      name: '11th Standard',
    },
    {
      name: '12th Standard',
    },
  ];

  return (
    <>
      <Group justify="space-between">
        <Title size="md" mt="md" mb="lg">
          Classes
        </Title>
        <Button
          variant="filled"
          size="xs"
          radius="sm"
          leftSection={<IconPlus size={14} />}
        >
          Add
        </Button>
      </Group>
      <SimpleGrid cols={4} spacing="lg">
        {records.map((record) => (
          <Card key={record.name} shadow="xs" padding="md">
            <Text ta="center">{record.name}</Text>
            <Group mt="lg" justify="center">
              <Tooltip label="Edit" position="top">
                <ActionIcon color="blue" variant="light" size="sm">
                  <IconEdit size={14} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Card>
        ))}
      </SimpleGrid>
    </>
  );
}

export default ClassesPage;

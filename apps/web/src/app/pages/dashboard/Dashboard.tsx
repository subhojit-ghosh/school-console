import { Group, Paper, SimpleGrid, Text, Title } from '@mantine/core';

const data = [
  { title: 'Students', value: '20' },
  { title: 'Classes', value: '12' },
  { title: 'Payments', value: '100' },
];

function DashboardPage() {
  const stats = data.map((stat) => {
    return (
      <Paper withBorder p="md" radius="md" key={stat.title}>
        <Group justify="apart">
          <div>
            <Text c="dimmed" tt="uppercase" fw={700} fz="xs">
              {stat.title}
            </Text>
            <Text fw={700} fz="xl">
              {stat.value}
            </Text>
          </div>
        </Group>
      </Paper>
    );
  });

  return (
    <>
      <Group justify="space-between">
        <Title size="md" mt="md" mb="lg">
          Dashboard
        </Title>
      </Group>
      <div>
        <SimpleGrid cols={{ base: 1, sm: 3 }}>{stats}</SimpleGrid>
      </div>
    </>
  );
}

export default DashboardPage;

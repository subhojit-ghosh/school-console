import {
  Group,
  Paper,
  SimpleGrid,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';

const data = [
  { title: 'Students', value: '20' },
  { title: 'Classes', value: '12' },
  { title: 'Payments', value: '100' },
];

function DashboardPage() {
  const theme = useMantineTheme();

  const stats = data.map((stat) => {
    return (
      <Paper withBorder p="md" radius="sm" key={stat.title}>
        <Group justify="apart">
          <div>
            <Text tt="uppercase" fw={700} fz="sm" c={theme.colors.indigo[9]}>
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
      <Group justify="space-between" align="center" mb="md">
        <Title size="lg">Dashboard</Title>
      </Group>
      <div>
        <SimpleGrid cols={{ base: 1, sm: 3 }}>{stats}</SimpleGrid>
      </div>
    </>
  );
}

export default DashboardPage;

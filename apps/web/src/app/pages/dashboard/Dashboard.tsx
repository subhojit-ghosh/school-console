import {
  Group,
  Paper,
  SimpleGrid,
  Skeleton,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import endpoints from '../../api/endpoints';
import httpClient from '../../api/http-client';

const statsList = [
  { title: 'Enrolled Students', key: 'enrolledStudents' },
  { title: 'New Registrations', key: 'newRegistrations' },
];

function DashboardPage() {
  const theme = useMantineTheme();
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState<any>({
    enrolledStudents: 0,
    newRegistrations: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const response = await httpClient.get(endpoints.dashboard.stats());
      setStatsData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const stats = statsList.map((stat) => {
    return (
      <Paper withBorder p="md" key={stat.title}>
        <Group justify="apart">
          <div>
            <Text tt="uppercase" fw={700} fz="sm" c={theme.colors.indigo[9]}>
              {stat.title}
            </Text>
            <Text fw={700} fz="xl">
              {loading ? <Skeleton height={20} mt={10} /> : statsData[stat.key]}
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

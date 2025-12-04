import {
  ActionIcon,
  Group,
  Paper,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { IconUserPlus, IconUsers } from '@tabler/icons-react';
import { ElementType, useEffect, useState } from 'react';
import endpoints from '../../api/endpoints';
import httpClient from '../../api/http-client';

const statsList = [
  { title: 'Enrolled Students', key: 'enrolledStudents', icon: IconUsers },
  { title: 'New Registrations', key: 'newRegistrations', icon: IconUserPlus },
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

  const stats = statsList.map((stat) => (
    <StatCard
      key={stat.title}
      title={stat.title}
      value={statsData[stat.key]}
      loading={loading}
      icon={stat.icon}
    />
  ));

  return (
    <>
      <Group justify="space-between" align="center" mb="md">
        <Title size="lg">Dashboard</Title>
      </Group>
      <div>
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {stats}
        </SimpleGrid>
      </div>
    </>
  );
}

type StatCardProps = {
  title: string;
  value: number;
  loading: boolean;
  icon: ElementType;
};

function StatCard({ title, value, loading, icon: Icon }: StatCardProps) {
  const theme = useMantineTheme();
  return (
    <Paper
      withBorder
      p="lg"
      bg="var(--mantine-color-white)"
      style={{ borderColor: 'var(--mantine-color-gray-2)' }}
    >
      <Group justify="space-between" align="flex-start">
        <Stack gap={6}>
          <Text tt="uppercase" fw={600} fz="xs" c="dimmed">
            {title}
          </Text>
          {loading ? (
            <Skeleton height={28} width="60%" />
          ) : (
            <Text fw={700} fz={32} lh={1}>
              {value}
            </Text>
          )}
        </Stack>
        <ActionIcon
          variant="light"
          color="indigo"
          size={40}
          aria-label={title}
        >
          <Icon size={22} color={theme.colors.indigo[6]} />
        </ActionIcon>
      </Group>
    </Paper>
  );
}

export default DashboardPage;

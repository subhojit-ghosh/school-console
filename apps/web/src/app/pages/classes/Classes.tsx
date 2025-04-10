import {
  ActionIcon,
  Button,
  Card,
  Grid,
  Group,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import { IconEdit, IconPlus } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import endpoints from '../../api/endpoints';
import httpClient from '../../api/http-client';
import ClassForm from './ClassForm';
import IsAccessiable from '../../components/IsAccessiable';

export default function ClassesPage() {
  const [isListLoading, setIsListLoading] = useState(true);
  const [listData, setListData] = useState({
    data: [],
    totalRecords: 0,
    totalPages: 0,
    size: 100,
    page: 1,
  });
  const [filters, setFilters] = useDebouncedState(
    {
      name: '',
    },
    200
  );
  const [formOpened, setFormOpened] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchList = async (page: number | null = null) => {
    setIsListLoading(true);

    try {
      const { data } = await httpClient.get(endpoints.classes.list(), {
        params: {
          ...filters,
          size: listData.size,
          page: page || listData.page,
        },
      });

      setListData({
        ...listData,
        ...data,
      });
    } catch (error) {
      console.error(error);
    }

    setIsListLoading(false);
  };

  return (
    <>
      <Group justify="space-between" align="center" mb="md">
        <Title size="lg">Classes</Title>
        <IsAccessiable>
          <Button
            variant="filled"
            leftSection={<IconPlus size={14} />}
            onClick={() => {
              setFormMode('add');
              setFormData(null);
              setFormOpened(true);
            }}
          >
            Add
          </Button>
        </IsAccessiable>
      </Group>

      <Grid>
        {listData.data.map((cls: any) => (
          <Grid.Col key={cls.id} span={4}>
            <Card withBorder>
              <Group justify="space-between" align="center">
                <Text fw="bold" c="indigo">
                  {cls.name}
                </Text>
                <IsAccessiable>
                  <Tooltip label="Edit" withArrow>
                    <ActionIcon
                      variant="subtle"
                      onClick={() => {
                        setFormMode('edit');
                        setFormData(cls);
                        setFormOpened(true);
                      }}
                    >
                      <IconEdit size={18} />
                    </ActionIcon>
                  </Tooltip>
                </IsAccessiable>
              </Group>
              <Text size="sm" c="dimmed" mt="xs">
                Sections: {cls.sections.join(', ')}
              </Text>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      <ClassForm
        opened={formOpened}
        close={() => setFormOpened(false)}
        mode={formMode}
        data={formData}
        fetchList={fetchList}
      />
    </>
  );
}

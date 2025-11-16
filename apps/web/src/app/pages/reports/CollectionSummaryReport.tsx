import {
  Button,
  Grid,
  Group,
  Select,
} from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import { IconDownload } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import endpoints from '../../api/endpoints';
import httpClient from '../../api/http-client';
import Currency from '../../components/Currency';
import moment from 'moment';

export default function CollectionSummaryReport() {
  const [isCollectionLoading, setIsCollectionLoading] = useState(false);
  const [collectionData, setCollectionData] = useState<any[]>([]);
  const [academicYears, setAcademicYears] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [collectionFilters, setCollectionFilters] = useDebouncedState(
    {
      academicYearId: '',
      classId: '',
      groupBy: 'day',
      dateFrom: null as Date | null,
      dateTo: null as Date | null,
    },
    200
  );

  useEffect(() => {
    fetchDropdowns();
  }, []);

  const fetchDropdowns = async () => {
    try {
      const [{ data: academicYearsDropdown }, { data: classesDropdown }] =
        await Promise.all([
          httpClient.get(endpoints.academicYears.dropdown()),
          httpClient.get(endpoints.classes.dropdown()),
        ]);

      setAcademicYears(academicYearsDropdown.data);
      setClasses(classesDropdown.data);

      const newFilters: any = {};

      if (academicYearsDropdown.data.length) {
        const currentAcademicYear = academicYearsDropdown.data.find(
          (item: any) => item.isActive
        );
        Object.assign(newFilters, {
          academicYearId: String(
            currentAcademicYear
              ? currentAcademicYear.id
              : academicYearsDropdown.data[0].id
          ),
        });
      }

      if (classesDropdown.data.length) {
        Object.assign(newFilters, {
          classId: String(classesDropdown.data[0].id),
        });
      }

      setCollectionFilters((prev) => ({
        ...prev,
        ...newFilters,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCollectionSummary = async () => {
    if (!collectionFilters.academicYearId || !collectionFilters.classId) {
      return;
    }

    setIsCollectionLoading(true);

    try {
      const { data } = await httpClient.get(
        endpoints.reports.collectionSummary(),
        {
          params: {
            academicYearId: collectionFilters.academicYearId,
            classId: collectionFilters.classId,
            groupBy: collectionFilters.groupBy,
            dateFrom: collectionFilters.dateFrom
              ? moment(collectionFilters.dateFrom).format('YYYY-MM-DD')
              : undefined,
            dateTo: collectionFilters.dateTo
              ? moment(collectionFilters.dateTo).format('YYYY-MM-DD')
              : undefined,
          },
        }
      );

      setCollectionData(data);
    } catch (error) {
      console.error(error);
    }

    setIsCollectionLoading(false);
  };

  useEffect(() => {
    fetchCollectionSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionFilters]);

  const downloadCollectionSummaryExcel = async () => {
    try {
      const { data } = await httpClient.get(
        endpoints.reports.collectionSummaryExport(),
        {
          params: {
            academicYearId: collectionFilters.academicYearId,
            classId: collectionFilters.classId,
            groupBy: collectionFilters.groupBy,
            dateFrom: collectionFilters.dateFrom
              ? moment(collectionFilters.dateFrom).format('YYYY-MM-DD')
              : undefined,
            dateTo: collectionFilters.dateTo
              ? moment(collectionFilters.dateTo).format('YYYY-MM-DD')
              : undefined,
          },
          responseType: 'blob',
        }
      );

      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      const parts: string[] = [];
      if (collectionFilters.academicYearId) {
        const year = academicYears.find(
          (a: any) => a.id === Number(collectionFilters.academicYearId)
        );
        if (year) parts.push(year.name);
      }
      if (collectionFilters.classId) {
        const klass = classes.find(
          (c: any) => c.id === Number(collectionFilters.classId)
        );
        if (klass) parts.push(klass.name);
      }

      link.download = `Collection Summary - ${
        parts.join(' - ') || 'All'
      }.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Grid my={10}>
        <Grid.Col span={2}>
          <Select
            label="Academic Year"
            data={academicYears.map((item: any) => ({
              label: item.name,
              value: String(item.id),
            }))}
            value={collectionFilters.academicYearId}
            onChange={(value) =>
              setCollectionFilters({
                ...collectionFilters,
                academicYearId: value || '',
              })
            }
          />
        </Grid.Col>
        <Grid.Col span={2}>
          <Select
            label="Class"
            data={classes.map((item: any) => ({
              label: item.name,
              value: String(item.id),
            }))}
            value={collectionFilters.classId}
            onChange={(value) =>
              setCollectionFilters({
                ...collectionFilters,
                classId: value || '',
              })
            }
          />
        </Grid.Col>
        <Grid.Col span={2}>
          <Select
            label="Group By"
            data={[
              { label: 'Day', value: 'day' },
              { label: 'Month', value: 'month' },
              { label: 'Year', value: 'year' },
            ]}
            value={collectionFilters.groupBy}
            onChange={(value) =>
              setCollectionFilters({
                ...collectionFilters,
                groupBy: (value as 'day' | 'month' | 'year') || 'day',
              })
            }
          />
        </Grid.Col>
        <Grid.Col span={2} style={{ display: 'flex', alignItems: 'end' }}>
          <Button
            rightSection={<IconDownload size={14} />}
            disabled={isCollectionLoading}
            onClick={downloadCollectionSummaryExcel}
          >
            Download
          </Button>
        </Grid.Col>
      </Grid>

      <DataTable
        withTableBorder
        withColumnBorders
        borderRadius="sm"
        striped
        highlightOnHover
        minHeight={200}
        fetching={isCollectionLoading}
        records={collectionData}
        columns={[
          {
            accessor: 'period',
            title: 'Period',
          },
          {
            accessor: 'academicYearId',
            title: 'Academic Year',
          },
          {
            accessor: 'classId',
            title: 'Class',
          },
          {
            accessor: 'totalAmount',
            title: 'Total Amount',
            render: (row: any) => <Currency value={row.totalAmount} />,
          },
          {
            accessor: 'totalPaid',
            title: 'Total Paid',
            render: (row: any) => <Currency value={row.totalPaid} />,
          },
          {
            accessor: 'totalDue',
            title: 'Total Due',
            render: (row: any) => <Currency value={row.totalDue} />,
          },
          {
            accessor: 'totalLateFine',
            title: 'Total Late Fine',
            render: (row: any) => <Currency value={row.totalLateFine} />,
          },
          {
            accessor: 'totalConcession',
            title: 'Total Concession',
            render: (row: any) => <Currency value={row.totalConcession} />,
          },
        ]}
      />
    </>
  );
}



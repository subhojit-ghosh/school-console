import { Group, Tabs, Title } from '@mantine/core';
import DuesReport from './DuesReport';
import CollectionSummaryReport from './CollectionSummaryReport';
import TransactionHistoryReport from './TransactionHistoryReport';
import ConcessionReport from './ConcessionReport';

export default function ReportsPage() {

  const downloadAsExcel = async () => {
    const data = [];

    for (const student of listData) {
      for (const item of student.dues) {
        data.push({
          student: `${student.name} (${
            student.isEnrolled ? student.enrolledNo : student.regId
          })`,
          feeName: item.name,
          dueDate: item.dueDate
            ? moment(item.dueDate).format('YYYY-MM-DD')
            : '',
          amount: item.amount,
          lateFine: item.lateFine,
          lateDays: item.lateDays,
          totalConcession: item.totalConcession,
          totalPayable: item.totalPayable,
          totalPaid: item.totalPaid,
          totalDue: item.totalDue,
          overdue: item.isOverdue ? 'Yes' : 'No',
        });
      }
    }

    console.log('Data to be exported:', data);

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet);

    const filterParts = [
      filters.academicYearId
        ? academicYears.find(
            (item) => item.id === Number(filters.academicYearId)
          )?.name
        : null,
      filters.classId
        ? classes.find((item) => item.id === Number(filters.classId))?.name
        : null,
      filters.studentId
        ? students.find((item) => item.value === filters.studentId)?.label
        : null,
    ]
      .filter((value) => value)
      .join(' - ');

    const filename = `Dues Report - ${filterParts}.xlsx`;

    console.log('Downloading file:', filename);

    XLSX.writeFile(workbook, filename);
  };

  return (
    <>
      <Group justify="space-between" align="center" mb="md">
        <Title size="lg">Reports</Title>
      </Group>
      <Tabs defaultValue="dues" keepMounted={false}>
        <Tabs.List>
          <Tabs.Tab value="dues">Outstanding Dues</Tabs.Tab>
          <Tabs.Tab value="collection">Collection Summary</Tabs.Tab>
          <Tabs.Tab value="transactions">Transaction History</Tabs.Tab>
          <Tabs.Tab value="concessions">Concession Report</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="dues" pt="md">
          <DuesReport />
        </Tabs.Panel>

        <Tabs.Panel value="collection" pt="md">
          <CollectionSummaryReport />
        </Tabs.Panel>

        <Tabs.Panel value="transactions" pt="md">
          <TransactionHistoryReport />
        </Tabs.Panel>

        <Tabs.Panel value="concessions" pt="md">
          <ConcessionReport />
        </Tabs.Panel>
      </Tabs>
    </>
  );
}

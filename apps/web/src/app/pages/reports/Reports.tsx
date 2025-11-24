import { Group, Tabs, Title } from '@mantine/core';
import DuesReport from './DuesReport';
import CollectionSummaryReport from './CollectionSummaryReport';
import TransactionHistoryReport from './TransactionHistoryReport';
import ConcessionReport from './ConcessionReport';

export default function ReportsPage() {
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

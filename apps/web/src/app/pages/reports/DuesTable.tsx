import { DataTable } from 'mantine-datatable';
import Currency from '../../components/Currency';

export default function DuesTable({ items }: any) {
  return (
    <DataTable
      withTableBorder
      withColumnBorders
      striped
      records={items}
      rowColor={({ isOverdue, totalDue }) => {
        if (isOverdue) return 'red';
        if (!totalDue) return 'green';
      }}
      columns={[
        {
          accessor: 'name',
          title: 'Name',
        },
        {
          accessor: 'totalAmount',
          title: 'Amount',
          render: (row: any) => <Currency value={row.amount} />,
        },
        {
          accessor: 'lateFine',
          title: 'Late Fine',
          render: (row: any) => <Currency value={row.lateFine} />,
        },
        {
          accessor: 'lateDays',
          title: 'Late Days',
        },
        {
          accessor: 'totalConcession',
          title: 'Concession',
          render: (row: any) => <Currency value={row.totalConcession} />,
        },
        {
          accessor: 'totalPayable',
          title: 'Payable',
          render: (row: any) => <Currency value={row.totalPayable} />,
        },
        {
          accessor: 'totalPaid',
          title: 'Paid',
          render: (row: any) => <Currency value={row.totalPaid} />,
        },
        {
          accessor: 'totalDue',
          title: 'Due',
          render: (row: any) => <Currency value={row.totalDue} />,
        },
      ]}
    />
  );
}

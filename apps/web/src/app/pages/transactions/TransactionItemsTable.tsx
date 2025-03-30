import { DataTable } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import endpoints from '../../api/endpoints';
import httpClient from '../../api/http-client';
import Currency from '../../components/Currency';

export default function TransactionItemsTable({ id }: { id: number }) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);

  const fetchItems = async () => {
    try {
      const { data } = await httpClient.get(endpoints.transactions.items(id));
      setItems(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DataTable
      withTableBorder
      withColumnBorders
      striped
      fetching={loading}
      records={items}
      columns={[
        {
          accessor: 'academicFeeName',
          title: 'Name',
        },
        {
          accessor: 'amount',
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
          accessor: 'concession',
          title: 'Concession',
          render: (row: any) => <Currency value={row.concession} />,
        },
        {
          accessor: 'payable',
          title: 'Payable',
          render: (row: any) => <Currency value={row.payable} />,
        },
        {
          accessor: 'paid',
          title: 'Paid',
          render: (row: any) => <Currency value={row.paid} />,
        },
        {
          accessor: 'due',
          title: 'Due',
          render: (row: any) => <Currency value={row.due} />,
        },
      ]}
    />
  );
}

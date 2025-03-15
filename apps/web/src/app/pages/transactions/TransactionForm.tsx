import {
  Badge,
  Button,
  Checkbox,
  Grid,
  Group,
  NumberInput,
  Paper,
  Select,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { IconArrowBack } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

export default function TransactionForm() {
  return (
    <>
      <Group justify="space-between" align="center" mb="md">
        <Title size="lg">New Transaction</Title>
        <Button
          variant="light"
          leftSection={<IconArrowBack size={14} />}
          component={Link}
          to="/transactions"
        >
          Back
        </Button>
      </Group>
      <Paper withBorder shadow="md" p="md">
        <Grid>
          <Grid.Col span={6}>
            <Grid>
              <Grid.Col span={4}>
                <Select label="Class" data={['I', 'II', 'III']} />
              </Grid.Col>
              <Grid.Col span={8}>
                <Select
                  label="Student"
                  data={['John Doe (J-001)', 'John Doe Jr. (J-002)']}
                  searchable
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <Text>Total Paid</Text>
                <Badge leftSection="₹" color="green">
                  100
                </Badge>
              </Grid.Col>
              <Grid.Col span={4}>
                <Text>Current Due</Text>
                <Badge leftSection="₹" color="red">
                  1000
                </Badge>
              </Grid.Col>
              <Grid.Col span={4}>
                <Text>Total Due</Text>
                <Badge leftSection="₹" color="orange">
                  5000
                </Badge>
              </Grid.Col>
              <Grid.Col span={12}>
                <Table withTableBorder withColumnBorders>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Type</Table.Th>
                      <Table.Th>Name</Table.Th>
                      <Table.Th>Amount</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    <Table.Tr>
                      <Table.Td rowSpan={3}>Enrollment</Table.Td>
                      <Table.Td>
                        <Checkbox label="Registration" />
                      </Table.Td>
                      <Table.Td>₹1000</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>
                        <Checkbox label="Admission" />
                      </Table.Td>
                      <Table.Td>₹1000</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>
                        <Checkbox label="Development" />
                      </Table.Td>
                      <Table.Td>₹1000</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td rowSpan={4}>Tution</Table.Td>
                      <Table.Td>
                        <Checkbox label="Quarter 1 (April - June)" />
                      </Table.Td>
                      <Table.Td>₹1000</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>
                        <Checkbox label="Quarter 2 (July - September)" />
                      </Table.Td>
                      <Table.Td>₹1000</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>
                        <Checkbox label="Quarter 3 (October - December)" />
                      </Table.Td>
                      <Table.Td>₹1000</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>
                        <Checkbox label="Quarter 4 (January - March)" />
                      </Table.Td>
                      <Table.Td>₹1000</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td rowSpan={3}>Material</Table.Td>
                      <Table.Td>
                        <Checkbox label="Books" />
                      </Table.Td>
                      <Table.Td>₹100</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>
                        <Checkbox label="Shoes" />
                      </Table.Td>
                      <Table.Td>₹50</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>
                        <Checkbox label="ID Card" />
                      </Table.Td>
                      <Table.Td>₹10</Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                </Table>
              </Grid.Col>
            </Grid>
          </Grid.Col>
          <Grid.Col span={6}>
            <Grid>
              <Grid.Col span={12} mt="143">
                <Table withTableBorder withColumnBorders>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Type</Table.Th>
                      <Table.Th>Name</Table.Th>
                      <Table.Th>Amount</Table.Th>
                      <Table.Th>Concession</Table.Th>
                      <Table.Th>Paid</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    <Table.Tr>
                      <Table.Td rowSpan={2}>Enrollment</Table.Td>
                      <Table.Td>Admission</Table.Td>
                      <Table.Td>₹1000</Table.Td>
                      <Table.Td>
                        <NumberInput
                          hideControls
                          leftSection={<Text size="sm">₹</Text>}
                        />
                      </Table.Td>
                      <Table.Td>
                        <NumberInput
                          hideControls
                          leftSection={<Text size="sm">₹</Text>}
                        />
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>Development</Table.Td>
                      <Table.Td>₹1000</Table.Td>
                      <Table.Td>
                        <NumberInput
                          hideControls
                          leftSection={<Text size="sm">₹</Text>}
                        />
                      </Table.Td>
                      <Table.Td>
                        <NumberInput
                          hideControls
                          leftSection={<Text size="sm">₹</Text>}
                        />
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td rowSpan={1}>Tution</Table.Td>
                      <Table.Td>Quarter 1 (April - June)</Table.Td>
                      <Table.Td>₹1000</Table.Td>
                      <Table.Td>
                        <NumberInput
                          hideControls
                          leftSection={<Text size="sm">₹</Text>}
                        />
                      </Table.Td>
                      <Table.Td>
                        <NumberInput
                          hideControls
                          leftSection={<Text size="sm">₹</Text>}
                        />
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td rowSpan={3}>Material</Table.Td>
                      <Table.Td>Books</Table.Td>
                      <Table.Td>₹100</Table.Td>
                      <Table.Td>
                        <NumberInput
                          hideControls
                          leftSection={<Text size="sm">₹</Text>}
                        />
                      </Table.Td>
                      <Table.Td>
                        <NumberInput
                          hideControls
                          leftSection={<Text size="sm">₹</Text>}
                        />
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>Shoes</Table.Td>
                      <Table.Td>₹50</Table.Td>
                      <Table.Td>
                        <NumberInput
                          hideControls
                          leftSection={<Text size="sm">₹</Text>}
                        />
                      </Table.Td>
                      <Table.Td>
                        <NumberInput
                          hideControls
                          leftSection={<Text size="sm">₹</Text>}
                        />
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td>ID Card</Table.Td>
                      <Table.Td>₹10</Table.Td>
                      <Table.Td>
                        <NumberInput
                          hideControls
                          leftSection={<Text size="sm">₹</Text>}
                        />
                      </Table.Td>
                      <Table.Td>
                        <NumberInput
                          hideControls
                          leftSection={<Text size="sm">₹</Text>}
                        />
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr fw="bold">
                      <Table.Td colSpan={2}>Total</Table.Td>
                      <Table.Td>₹3160</Table.Td>
                      <Table.Td>₹160</Table.Td>
                      <Table.Td>3000</Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                </Table>
              </Grid.Col>
              <Grid.Col span={6}>
                <Select
                  label="Mode"
                  data={['Cash', 'Cheque', 'UPI']}
                  withAsterisk
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput label="Note" />
              </Grid.Col>
              <Grid.Col
                span={12}
                style={{ display: 'flex', justifyContent: 'flex-end' }}
              >
                <Button>Save</Button>
              </Grid.Col>
            </Grid>
          </Grid.Col>
        </Grid>
      </Paper>
    </>
  );
}

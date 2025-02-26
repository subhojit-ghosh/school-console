import {
  Button,
  Container,
  Paper,
  PasswordInput,
  TextInput,
  Title,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();
  return (
    <Container size={420} my={40}>
      <Title ta="center">JDS Public School</Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <TextInput label="Username" required />
        <PasswordInput label="Password" required mt="md" />
        {/* <Group justify="space-between" mt="lg">
          <Checkbox label="Remember me" />
          <Anchor component="button" size="sm">
            Forgot password?
          </Anchor>
        </Group> */}
        <Button fullWidth mt="xl" onClick={() => navigate('/dashboard')}>
          Sign in
        </Button>
      </Paper>
    </Container>
  );
}

export default LoginPage;

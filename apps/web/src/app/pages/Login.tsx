import {
  Button,
  Container,
  Image,
  Paper,
  PasswordInput,
  TextInput,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

function LoginPage() {
  const navigate = useNavigate();
  return (
    <Container size={420} my={40}>
      {/* <Title ta="center" size="lg">
        Fees Collection
      </Title> */}
      {/* <Text c="dimmed" size="sm" ta="center" mt={5}>
        JDS Public School
      </Text> */}
      <Image src={logo} alt="JDS Public School" mt={20} fit="contain" />

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <TextInput label="Username" required />
        <PasswordInput label="Password" required mt="md" />
        {/* <Group justify="space-between" mt="lg">
          <Checkbox label="Remember me" />
          <Anchor component="button" size="sm">
            Forgot password?
          </Anchor>
        </Group> */}
        <Button
          fullWidth
          mt="xl"
          onClick={() => navigate('/dashboard')}
        >
          Sign in
        </Button>
      </Paper>
    </Container>
  );
}

export default LoginPage;

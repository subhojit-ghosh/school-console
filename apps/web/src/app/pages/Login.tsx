import {
  Anchor,
  Box,
  Button,
  Divider,
  Flex,
  Group,
  Image,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import logo from '../../assets/logo.png';
import endpoints from '../api/endpoints';
import httpClient from '../api/http-client';
import { useAuthStore } from '../stores/authStore';
import { showSuccessNotification } from '../utils/notification';

function LoginPage() {
  const navigate = useNavigate();
  const authStore = useAuthStore();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      username: '',
      password: '',
    },
    validate: yupResolver(
      yup.object().shape({
        username: yup.string().trim().required('Username is required'),
        password: yup.string().trim().required('Password is required'),
      })
    ),
  });

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const loginResponse = await httpClient.post(
        endpoints.auth.login(),
        form.values
      );

      const profileResponse = await httpClient.get(endpoints.auth.profile());
      authStore.setUser(profileResponse.data);

      showSuccessNotification(loginResponse.data.message);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <Box className="login-shell">
      <Paper
        withBorder
        shadow="xl"
        p={{ base: 'lg', md: 40 }}
        className="login-panel"
      >
        <Flex
          gap={{ base: 'lg', md: 40 }}
          align="stretch"
          direction={{ base: 'column', md: 'row' }}
        >
          <Stack
            gap="sm"
            justify="center"
            flex={1}
            p={{ base: 0, md: 'sm' }}
            style={{ minWidth: 0 }}
          >
            <Image src={logo} alt="JDS Public School" maw={180} />
            <Title order={2}>Welcome back</Title>
            <Text c="dimmed">
              Sign in to manage students, fees, transport, and reports from a
              single, secure console.
            </Text>
          </Stack>
          <Divider visibleFrom="md" orientation="vertical" />
          <Box flex={1}>
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Stack gap="md">
                <TextInput
                  label="Username"
                  placeholder="Enter your username"
                  withAsterisk
                  autoComplete="username"
                  {...form.getInputProps('username')}
                />
                <PasswordInput
                  label="Password"
                  placeholder="Enter your password"
                  withAsterisk
                  autoComplete="current-password"
                  {...form.getInputProps('password')}
                />
                <Group justify="space-between" gap="xs">
                  <Text size="sm" c="dimmed">
                    Need help?
                  </Text>
                  <Anchor size="sm" href="mailto:support@jdschool.com">
                    Contact support
                  </Anchor>
                </Group>
                <Button fullWidth mt="sm" type="submit" loading={loading}>
                  Login
                </Button>
              </Stack>
            </form>
          </Box>
        </Flex>
      </Paper>
    </Box>
  );
}

export default LoginPage;

import {
  Button,
  Container,
  Divider,
  Grid,
  Image,
  Paper,
  PasswordInput,
  TextInput,
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
    <Container
      fluid
      style={{
        background: 'linear-gradient(135deg, #1E3C72, #2A5298)',
        height: '100vh',
        width: '100vw',
      }}
    >
      <Container size={420} py={40}>
        {/* <Title ta="center" c="white">Fees Collection</Title> */}
        <Paper withBorder shadow="md" p={30} mt={30}>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Grid>
              <Grid.Col span={12}>
                <Image src={logo} alt="JDS Public School" />
              </Grid.Col>
              <Grid.Col span={12}>
                <Divider />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  label="Username"
                  withAsterisk
                  {...form.getInputProps('username')}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <PasswordInput
                  label="Password"
                  withAsterisk
                  {...form.getInputProps('password')}
                />
              </Grid.Col>
            </Grid>
            <Button fullWidth mt="xl" type="submit" loading={loading}>
              Login
            </Button>
          </form>
        </Paper>
      </Container>
    </Container>
  );
}

export default LoginPage;

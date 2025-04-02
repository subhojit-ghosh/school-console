import { AppShell, Container } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

function Layout() {
  return (
    <AppShell
      navbar={{
        width: 220,
        breakpoint: 'sm',
      }}
      padding="md"
    >
      <AppShell.Navbar
        style={{ background: 'linear-gradient(135deg, #1E3C72, #2A5298)' }}
      >
        <Navbar />
      </AppShell.Navbar>

      <AppShell.Main style={{ background: '#F4F6F8' }}>
        <Container size="xl" p={0}>
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}

export default Layout;

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
      <AppShell.Navbar className="app-navbar">
        <Navbar />
      </AppShell.Navbar>

      <AppShell.Main
        style={{
          background: 'linear-gradient(180deg, #f7f9fc 0%, #eef2f7 100%)',
          minHeight: '100vh',
        }}
      >
        <Container size="xl" p={0}>
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}

export default Layout;

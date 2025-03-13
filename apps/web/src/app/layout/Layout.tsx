import { AppShell, useMantineTheme } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

const gradients = {
  // 1: 'linear-gradient(135deg, #3F51B5, #2196F3)',
  // 2: 'linear-gradient(135deg, #00BCD4, #3F51B5)',
  3: 'linear-gradient(135deg, #1E3C72, #2A5298)',
  // 4: 'linear-gradient(135deg, #283E51, #4B79A1)',
  // 5: 'linear-gradient(135deg, #3F51B5, #2196F3);',
};

function Layout() {
  const theme = useMantineTheme();

  return (
    <AppShell
      // header={{ height: 60 }}
      navbar={{
        width: 220,
        breakpoint: 'sm',
      }}
      padding="md"
    >
      {/* <AppShell.Header bg="blue">
        <Header />
      </AppShell.Header> */}

      <AppShell.Navbar
        style={{ background: 'linear-gradient(135deg, #1E3C72, #2A5298)' }}
      >
        <Navbar />
      </AppShell.Navbar>

      <AppShell.Main style={{ background: '#F4F6F8' }}>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}

export default Layout;

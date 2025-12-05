import '@mantine/core/styles.css';
import '@mantine/core/styles.layer.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import 'mantine-datatable/styles.layer.css';

import { createTheme, LoadingOverlay, MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { DataTable } from 'mantine-datatable';
import endpoints from './api/endpoints';
import httpClient from './api/http-client';
import Layout from './layout/Layout';
import AcademicYearsPage from './pages/academic-years/AcademicYears';
import ClassesPage from './pages/classes/Classes';
import DashboardPage from './pages/dashboard/Dashboard';
import LoginPage from './pages/Login';
import { PageNotFound } from './pages/page-not-found/PageNotFound';
import ReportsPage from './pages/reports/Reports';
import StudentForm from './pages/students/StudentForm';
import StudentsPage from './pages/students/Students';
import TransactionForm from './pages/transactions/TransactionForm';
import TransactionsPage from './pages/transactions/Transactions';
import TransportPage from './pages/transports/Transport';
import UsersPage from './pages/users/Users';
import AuthenticatedRoutes from './route-guards/authenticated';
import RedirectIfAuthenticatedRoutes from './route-guards/redirect-if-authenticated';
import { useAuthStore } from './stores/authStore';
import AcademicFees from './pages/academic-fees/AcademicFees';

const dataTableComponent =
  (DataTable as any).extend?.({
    styles: (theme: any) => ({
      root: {
        borderRadius: theme.radius.md,
        overflow: 'hidden',
        border: `1px solid ${theme.colors.gray[3]}`,
      },
      scrollArea: {
        borderRadius: theme.radius.md,
      },
    }),
  }) ?? {
    styles: (theme: any) => ({
      root: {
        borderRadius: theme.radius.md,
        overflow: 'hidden',
        border: `1px solid ${theme.colors.gray[3]}`,
      },
      scrollArea: {
        borderRadius: theme.radius.md,
      },
    }),
  };

const theme = createTheme({
  primaryColor: 'teal',
  primaryShade: 6,
  fontFamily:
    'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
  headings: {
    fontWeight: '600',
    fontFamily:
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
  },
  defaultRadius: 'md',
  colors: {
    brandGray: [
      '#f8f9fb',
      '#f1f3f7',
      '#e2e8f0',
      '#cbd5e1',
      '#94a3b8',
      '#64748b',
      '#475569',
      '#334155',
      '#1e293b',
      '#0f172a',
    ],
  },
  components: {
    Button: {
      defaultProps: {
        fw: 600,
        radius: 'md',
      },
    },
    ActionIcon: {
      defaultProps: {
        radius: 'md',
      },
    },
    Paper: {
      defaultProps: {
        shadow: 'sm',
        radius: 'md',
      },
    },
    Tabs: {
      defaultProps: {
        radius: 'md',
      },
    },
    Container: {
      defaultProps: {
        size: 'lg',
      },
    },
    DataTable: dataTableComponent,
  },
});

export function App() {
  const authStore = useAuthStore();
  const [loading, setLoading] = useState(true);

  const initApp = async () => {
    try {
      const response = await httpClient.get(endpoints.auth.profile());
      authStore.setUser(response.data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    initApp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <MantineProvider theme={theme} defaultColorScheme="light">
        <LoadingOverlay visible />
      </MantineProvider>
    );
  }

  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <Notifications position="top-center" />
      <ModalsProvider>
        {loading ? (
          <LoadingOverlay visible />
        ) : (
          <Routes>
            <Route element={<RedirectIfAuthenticatedRoutes />}>
              <Route path="/login" element={<LoginPage />} />
            </Route>
            <Route element={<AuthenticatedRoutes />}>
              <Route path="/" element={<Layout />}>
                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />}
                />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/academic-years" element={<AcademicYearsPage />} />
                <Route path="/students">
                  <Route index element={<StudentsPage />} />
                  <Route path="add" element={<StudentForm action="add" />} />
                  <Route
                    path=":id/edit"
                    element={<StudentForm action="edit" />}
                  />
                </Route>
                <Route path="/classes" element={<ClassesPage />} />
                <Route path="/academic-fees" element={<AcademicFees />} />
                <Route path="/transactions">
                  <Route index element={<TransactionsPage />} />
                  <Route path="add/:type" element={<TransactionForm />} />
                </Route>
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/transport" element={<TransportPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="*" element={<PageNotFound />} />
              </Route>
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        )}
      </ModalsProvider>
    </MantineProvider>
  );
}
export default App;

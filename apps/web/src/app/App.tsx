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
import endpoints from './api/endpoints';
import httpClient from './api/http-client';
import Layout from './layout/Layout';
import AcademicFeesPage from './pages/academic-fees/AcademicFees';
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
import UsersPage from './pages/users/Users';
import AuthenticatedRoutes from './route-guards/authenticated';
import RedirectIfAuthenticatedRoutes from './route-guards/redirect-if-authenticated';
import { useAuthStore } from './stores/authStore';

const theme = createTheme({
  primaryColor: 'indigo',
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
                <Route path="/academic-fees" element={<AcademicFeesPage />} />
                <Route path="/transactions">
                  <Route index element={<TransactionsPage />} />
                  <Route path="add/:type" element={<TransactionForm />} />
                </Route>
                <Route path="/reports" element={<ReportsPage />} />
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

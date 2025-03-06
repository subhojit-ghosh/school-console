import { createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/core/styles.layer.css';
import '@mantine/dates/styles.css';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import 'mantine-datatable/styles.layer.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './layout/Layout';
import AcademicYearsPage from './pages/academic-years/AcademicYears';
import ClassesPage from './pages/classes/Classes';
import DashboardPage from './pages/dashboard/Dashboard';
import FeesPage from './pages/fees/Fees';
import LoginPage from './pages/Login';
import PaymentsPage from './pages/payments/Payments';
import StudentsPage from './pages/students/Students';
import UsersPage from './pages/users/Users';

const theme = createTheme({
  primaryColor: 'orange',
});

export function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <Notifications position="top-center" />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/academic-years" element={<AcademicYearsPage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/classes" element={<ClassesPage />} />
          <Route path="/fees" element={<FeesPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/users" element={<UsersPage />} />
        </Route>
      </Routes>
    </MantineProvider>
  );
}
export default App;

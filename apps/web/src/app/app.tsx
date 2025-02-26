import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/core/styles.layer.css';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import 'mantine-datatable/styles.layer.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './layout/Layout';
import ClassesPage from './pages/classes/Classes';
import DashboardPage from './pages/dashboard/Dashboard';
import LoginPage from './pages/Login';
import PaymentsPage from './pages/payments/Payments';
import StudentsPage from './pages/students/Students';
import UsersPage from './pages/users/Users';

export function App() {
  return (
    <MantineProvider>
      <Notifications />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/classes" element={<ClassesPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/users" element={<UsersPage />} />
        </Route>
      </Routes>
    </MantineProvider>
  );
}
export default App;

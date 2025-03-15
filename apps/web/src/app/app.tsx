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
import { PageNotFound } from './pages/page-not-found/PageNotFound';
import StudentForm from './pages/students/StudentForm';
import StudentsPage from './pages/students/Students';
import TransactionsPage from './pages/transactions/Transactions';
import UsersPage from './pages/users/Users';

const theme = createTheme({
  primaryColor: 'indigo',
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
          <Route path="/students">
            <Route index element={<StudentsPage />} />
            <Route path="add" element={<StudentForm action="add" />} />
            <Route path=":id/edit" element={<StudentForm action="edit" />} />
          </Route>
          <Route path="/classes" element={<ClassesPage />} />
          <Route path="/fees" element={<FeesPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </MantineProvider>
  );
}
export default App;

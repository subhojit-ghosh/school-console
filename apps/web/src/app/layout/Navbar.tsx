import {
  IconCalendar,
  IconCash,
  IconChalkboard,
  IconCoins,
  IconDashboard,
  IconPasswordUser,
  IconSchool,
  IconUsers,
} from '@tabler/icons-react';
import { Link, useLocation } from 'react-router-dom';
import classes from './Navbar.module.scss';

const data = [
  { link: '/dashboard', label: 'Dashboard', icon: IconDashboard },
  { link: '/academic-years', label: 'Academic Years', icon: IconCalendar },
  { link: '/students', label: 'Students', icon: IconUsers },
  { link: '/classes', label: 'Classes', icon: IconChalkboard },
  { link: '/fees-structure', label: 'Fees Structure', icon: IconCoins },
  { link: '/enrollments', label: 'Enrollments', icon: IconSchool },
  { link: '/payments', label: 'Payments', icon: IconCash },
  { link: '/users', label: 'Users', icon: IconPasswordUser },
];

export function Navbar() {
  const location = useLocation();

  const links = data.map((item) => (
    <Link
      className={classes.link}
      data-active={
        decodeURIComponent(location.pathname)
          .split('/')
          .filter(Boolean)
          .join('/') ===
          item.link.split('?')[0].split('/').filter(Boolean).join('/') ||
        undefined
      }
      to={item.link}
      key={item.label}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </Link>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>{links}</div>
    </nav>
  );
}

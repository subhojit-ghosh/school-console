import { Group, Image } from '@mantine/core';
import {
  IconCalendar,
  IconCash,
  IconChalkboard,
  IconDashboard,
  IconPasswordUser,
  IconSchool,
  IconTag,
  IconUsers,
} from '@tabler/icons-react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';
import classes from './Navbar.module.scss';

const data = [
  { link: '/dashboard', label: 'Dashboard', icon: IconDashboard },
  { link: '/academic-years', label: 'Academic Years', icon: IconCalendar },
  { link: '/students', label: 'Students', icon: IconUsers },
  { link: '/classes', label: 'Classes', icon: IconChalkboard },
  { link: '/fees', label: 'Fees', icon: IconTag },
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
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="center" align="center">
          <Image src={logo} height={35} />
        </Group>
        {links}
      </div>
    </nav>
  );
}

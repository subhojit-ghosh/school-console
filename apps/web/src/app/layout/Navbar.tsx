import {
  Avatar,
  Group,
  Image,
  Menu,
  Text,
  UnstyledButton,
} from '@mantine/core';
import {
  IconCalendar,
  IconCash,
  IconChalkboard,
  IconChevronRight,
  IconDashboard,
  IconLogout,
  IconPasswordUser,
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
  { link: '/fees', label: 'Fee Structure', icon: IconTag },
  // { link: '/enrollments', label: 'Enrollments', icon: IconSchool },
  { link: '/transactions', label: 'Transactions', icon: IconCash },
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
      <div className={classes.footer}>
        <Menu width={200} withArrow position="top-end">
          <Menu.Target>
            <UnstyledButton>
              <Group>
                <Avatar
                  name="Subhojit Ghosh"
                  color="indigo"
                  size="md"
                  bg="white"
                />

                <div style={{ flex: 1 }}>
                  <Text fw={500} c="white">
                    Subhojit Ghosh
                  </Text>

                  <Text c="white" size="sm">
                    Admin
                  </Text>
                </div>

                <IconChevronRight size={14} stroke={1.5} color="white" />
              </Group>
            </UnstyledButton>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item color="red" leftSection={<IconLogout size={14} />}>
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
    </nav>
  );
}

import {
  Avatar,
  Group,
  Image,
  Menu,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { titleCase } from '@school-console/utils';
import {
  IconBus,
  IconCalendar,
  IconCash,
  IconChalkboard,
  IconChevronRight,
  IconDashboard,
  IconLogout,
  IconPasswordUser,
  IconReceipt,
  IconReport,
  IconUsers,
} from '@tabler/icons-react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';
import endpoints from '../api/endpoints';
import httpClient from '../api/http-client';
import { useAuthStore } from '../stores/authStore';
import classes from './Navbar.module.scss';

const data = [
  { link: '/dashboard', label: 'Dashboard', icon: IconDashboard },
  { link: '/academic-years', label: 'Academic Years', icon: IconCalendar },
  { link: '/students', label: 'Students', icon: IconUsers },
  { link: '/classes', label: 'Classes', icon: IconChalkboard },
  { link: '/academic-fees', label: 'Academic Fees', icon: IconReceipt },
  { link: '/transactions', label: 'Transactions', icon: IconCash },
  { link: '/reports', label: 'Reports', icon: IconReport },
  { link: '/transport', label: 'Transport', icon: IconBus },
  { link: '/users', label: 'Users', icon: IconPasswordUser },
];

export function Navbar() {
  const location = useLocation();
  const authStore = useAuthStore();

  const logout = async () => {
    try {
      await httpClient.get(endpoints.auth.logout());
      authStore.setUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  const links = (
    authStore.user?.role != 'staff'
      ? data
      : data.filter((rec) => rec.label !== 'Users')
  ).map((item) => (
    <Link
      className={classes.link}
      data-active={
        decodeURIComponent(location.pathname)
          .split('/')
          .filter(Boolean)
          .includes(item.link.split('?')[0].split('/').filter(Boolean)[0]) ||
        undefined
      }
      // data-active={
      //   decodeURIComponent(location.pathname)
      //     .split('/')
      //     .filter(Boolean)
      //     .join('/') ===
      //     item.link.split('?')[0].split('/').filter(Boolean).join('/') ||
      //   undefined
      // }
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
        {authStore.user && (
          <Menu width={200} withArrow position="top-end">
            <Menu.Target>
              <UnstyledButton w="100%" className={classes.profileCard}>
                <Group>
                  <Avatar
                    name={authStore.user.name}
                    color="indigo"
                    size="md"
                    radius="xl"
                  />

                  <div style={{ flex: 1 }}>
                    <Text fw={600} c="white" className={classes.profileName}>
                      {authStore.user.name}
                    </Text>

                    <Text c="white" className={classes.profileRole}>
                      {titleCase(authStore.user.role)}
                    </Text>
                  </div>

                  <IconChevronRight size={14} stroke={1.5} color="white" />
                </Group>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                color="red"
                leftSection={<IconLogout size={14} />}
                onClick={logout}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      </div>
    </nav>
  );
}

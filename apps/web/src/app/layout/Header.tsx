import {
  Avatar,
  Group,
  Image,
  Menu,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { IconChevronDown, IconLogout } from '@tabler/icons-react';
import logo from '../../assets/logo.png';

function Header() {
  return (
    <Group h="100%" px="sm" justify="space-between">
      <Image src={logo} height={35} />
      <Menu width={200} withArrow position="bottom-end">
        <Menu.Target>
          <UnstyledButton>
            <Group>
              <Avatar name="Subhojit Ghosh" color="orange" size="md" />

              <div style={{ flex: 1 }}>
                <Text size="sm" fw={500}>
                  Subhojit Ghosh
                </Text>

                <Text c="dimmed" size="xs">
                  Admin
                </Text>
              </div>

              <IconChevronDown size={14} stroke={1.5} />
            </Group>
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item color="red" leftSection={<IconLogout size={14} />}>
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}

export default Header;

import { showNotification } from '@mantine/notifications';
import { IconCheck, IconExclamationMark, IconX } from '@tabler/icons-react';

export const showSuccessNotification = (title = '', message = '') =>
  showNotification({
    title,
    message,
    color: 'green',
    icon: <IconCheck />,
    autoClose: 3000,
  });

export const showInfoNotification = (title = '', message = '') =>
  showNotification({
    title,
    message,
    color: 'teal',
    icon: <IconExclamationMark />,
    autoClose: 3000,
  });

export const showWarningNotification = (title = '', message = '') =>
  showNotification({
    title,
    message,
    color: 'yellow',
    icon: <IconExclamationMark />,
    autoClose: 3000,
  });

export const showErrorNotification = (
  title = 'Something went wrong! Please Try again.',
  message = ''
) =>
  showNotification({
    title,
    message,
    color: 'red',
    icon: <IconX />,
    autoClose: 3000,
  });

export const showFormValidationError = () =>
  showErrorNotification('Please fill all required fields');

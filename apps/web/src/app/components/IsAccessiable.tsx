import { cloneElement, ReactElement } from 'react';
import { DeniedUserRoles } from '../data/roles';
import { useAuthStore } from '../stores/authStore';

export default function IsAccessiable({
  children,
  addonProps = {},
  ...rest
}: {
  children: ReactElement;
  addonProps?: any;
}) {
  const authStore = useAuthStore();

  let RenderComponent = children;
  if (addonProps && Object.keys(addonProps).length > 0)
    RenderComponent = cloneElement(children, addonProps);

  return (
    <>
      {!DeniedUserRoles.includes(authStore.user?.role || '') && (
        <>{RenderComponent}</>
      )}
    </>
  );
}

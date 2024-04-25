import React, { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// login option 3 routing
const AuthLogin = Loadable(lazy(() => import('views/pages/authentication/authentication/Login')));
const AuthRegister = Loadable(lazy(() => import('views/pages/authentication/authentication/Register')));
const RedirectToApi = Loadable(lazy(() => import('ui-component/RedirectToApi')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: '/',
      element: <AuthLogin />
    },
    {
      path: '/register',
      element: <AuthRegister />
    },
    {
      path: '/*',
      element: <RedirectToApi />
    },
  ]
};

export default AuthenticationRoutes;

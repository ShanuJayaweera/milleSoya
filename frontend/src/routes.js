import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from 'src/layouts/DashboardLayout';
import MainLayout from 'src/layouts/MainLayout';
import DashboardView from 'src/views/reports/DashboardView';
import LoginView from 'src/views/auth/LoginView';
import NotFoundView from 'src/views/errors/NotFoundView';
import RegisterView from 'src/views/auth/RegisterView';

import ApplicationView from 'src/views/application';
import LicenseTypeView from 'src/views/license-type';
import ProviderLicenseView from 'src/views/provider-license';
import ProviderView from 'src/views/provider';

const routes = (isAuthenticated) => [
  {
    path: 'app',
    element: isAuthenticated ? (
      <DashboardLayout />
    ) : (
      <Navigate to="/login" />
    ),
    children: [
      { path: 'application', element: <ApplicationView /> },
      { path: 'license-type', element: <LicenseTypeView /> },
      { path: 'dashboard', element: <DashboardView /> },
      { path: 'provider-license', element: <ProviderLicenseView /> },
      { path: 'provider', element: <ProviderView /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: '/',
    element: !isAuthenticated ? (
      <MainLayout />
    ) : (
      <Navigate to="/app/dashboard" />
    ),
    children: [
      { path: 'login', element: <LoginView /> },
      { path: 'register', element: <RegisterView /> },
      { path: '404', element: <NotFoundView /> },
      { path: '/', element: <Navigate to="/login" /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];

export default routes;

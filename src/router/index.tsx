import { Navigate, createBrowserRouter } from 'react-router-dom';

import App from '../app/App';
import { ROUTES } from './paths';

import DashboardPage from '../pages/dashboard/list';
import UserEditPage from '../pages/dashboard/edit';
import UserViewPage from '../pages/dashboard/view';
import NotFoundPage from '../pages/404';

export const router = createBrowserRouter([
  {
    path: ROUTES.root,
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to={ROUTES.users} replace />,
      },
      {
        path: ROUTES.users,
        children: [
          {
            index: true,
            element: <DashboardPage />,
          },
          {
            path: ':id',
            children: [
              {
                path: 'edit',
                element: <UserEditPage />,
              },
              {
                path: 'view',
                element: <UserViewPage />,
              },
            ],
          },
        ],
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

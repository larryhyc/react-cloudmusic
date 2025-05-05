import { createBrowserRouter } from 'react-router-dom';
import Layout from '../Layout/Layout';
import Featured from '../components/Featured';
import FeaturedListDetail from '../components/FeaturedListDetail';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        index: true, // 使用index而不是path: '/'
        element: <Featured />,
      },
      {
        path: '/featured',
        element: <Featured />,
      },
      {
        path: '/playlist/:id',
        element: <FeaturedListDetail />,
      },
    ],
  },
]);

export default router;

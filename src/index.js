import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import './index.scss';
import {
  AdminLayout,
  Home,
  MovieDetail,
  MovieDetailLoader,
  MovieEditor,
  MovieEditorLoader,
  MovieFilter,
  MovieFilterLoader,
  MovieManager,
  MovieManagerLoader,
  WatchMovie,
} from './pages';
import Oauth2Redirect, { Oauth2RedirectLoader } from './pages/Oauth2Redirect';
import reportWebVitals from './reportWebVitals';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/the-loai/:genre',
        element: <MovieFilter />,
        loader: MovieFilterLoader,
      },
      {
        path: '/quoc-gia/:country',
        element: <MovieFilter />,
        loader: MovieFilterLoader,
      },
      {
        path: '/:path',
        element: <MovieDetail />,
        loader: MovieDetailLoader,
      },
      {
        path: '/xem-phim/:path',
        element: <WatchMovie />,
        loader: MovieDetailLoader,
      },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: '/admin/movie/',
        element: <MovieManager />,
        loader: MovieManagerLoader,
      },
      {
        path: '/admin/movie/new',
        element: <MovieEditor />,
        loader: MovieEditorLoader,
      },
      {
        path: '/admin/movie/:id',
        element: <MovieEditor value="Edit" />,
        loader: MovieEditorLoader,
      },
    ],
  },
  {
    path: '/redirect',
    element: <Oauth2Redirect />,
    loader: Oauth2RedirectLoader,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

reportWebVitals();

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import PrivateRoute from './component/PrivateRoute';
import './index.css';
import { AddMovie, AddMovieLoader } from './pages/Admin/AddMovie/AddMovie';
import { Admin } from './pages/Admin/Admin';
import {
  ListMovie,
  MovieManagerLoader,
} from './pages/Admin/ListMovie/ListMovieAdmin';
import {
  CountryLoader,
  Movie,
  MovieLoader,
} from './pages/ListMovie/ListMovieUser';
import {
  MovieDetail,
  MovieDetailLoader,
} from './pages/MovieDetail/MovieDetail';
import Oauth2Redirect, { Oauth2RedirectLoader } from './pages/Oauth2Redirect';
import { Page } from './pages/Page/Page';
import { WatchMovie } from './pages/WatchMovie/WatchMovie';
import reportWebVitals from './reportWebVitals';
import WatchParty from './pages/WatchParty/WatchParty';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Page />,
      },
      {
        path: '/the-loai/:keyword?',
        element: <Movie />,
        loader: MovieLoader,
      },
      {
        path: '/quoc-gia/:keyword',
        element: <Movie />,
        loader: CountryLoader,
      },
      {
        path: '/filter/:keyword',
        element: <Movie />,
        loader: MovieLoader,
      },
      {
        path: '/:id',
        element: <MovieDetail />,
        loader: MovieDetailLoader,
      },
      {
        path: '/xem-phim/:id',
        element: <WatchMovie />,
        loader: MovieDetailLoader,
      },
      {
        path: '/watch-party/:roomId',
        element: <WatchParty />,
      },
    ],
  },

  {
    path: '/admin',
    element: <PrivateRoute />,
    children: [
      {
        path: '/admin',
        element: <Admin />,
        children: [
          {
            path: '/admin/movie/',
            element: <ListMovie />,
            loader: MovieManagerLoader,
          },
          {
            path: '/admin/movie/category/:keyword',
            element: <ListMovie />,
            loader: MovieManagerLoader,
          },
          {
            path: '/admin/movie/new',
            element: <AddMovie />,
          },
          {
            path: '/admin/movie/:id',
            element: <AddMovie value="Edit" />,
            loader: AddMovieLoader,
          },
        ],
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

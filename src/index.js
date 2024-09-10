import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Login from './pages/Login';
import Register from './pages/user/Register';
import { AddOrUpdateMovie, MovieDetailLoader } from './pages/admin/AddOrUpdateMovie';
import { Admin } from './pages/admin/Admin';
import {
  ListMovie,
  MovieManagerLoader,
} from './pages/admin/ListMovieAdmin';
import {
  CountryLoader,
  Movie,
  MovieLoader,
} from './pages/user/ListMovieUser';
import {
  MovieDetail,
  posterMovieLoader,
} from './pages/user/MovieDetail';
import {
  filterMovieSeriesLoader,
  MovieVideoSeries,
} from './pages/user/MovieVideoSeries';
import {
  filterMovieLoader,
  MovieVideo,
} from './pages/user/MovieVideoSingle';
import { Page } from './pages/user/Page';
import PrivateRoute from './component/PrivateRoute';
import './index.css';
import reportWebVitals from './reportWebVitals';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Page />,
        loader: MovieLoader,
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
        path: '/:name',
        element: <MovieDetail />,
        loader: posterMovieLoader,
      },
      {
        path: '/xem-phim/:name',
        element: <MovieVideo />,
        loader: filterMovieLoader,
      },
      {
        path: '/xem-phim-bo/:name',
        element: <MovieVideoSeries />,
        loader: filterMovieSeriesLoader,
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
            element: <AddOrUpdateMovie />,
            loader: MovieDetailLoader,
          },
          {
            path: '/admin/movie/:id',
            element: <AddOrUpdateMovie />,
            loader: MovieDetailLoader,
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

reportWebVitals();

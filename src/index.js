import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Login from './component/account/Login';
import Register from './component/account/Register';
import { AddMovie, MovieDetailLoader } from './component/manager/AddMovie';
import { Admin } from './component/manager/Admin';
import {
  ListMovie,
  MovieManagerLoader,
} from './component/manager/ListMovieAdmin';
import {
  CountryLoader,
  Movie,
  MovieLoader,
} from './component/movie-user/ListMovieUser';
import {
  MovieDetail,
  posterMovieLoader,
} from './component/movie-user/MovieDetail';
import {
  filterMovieSeriesLoader,
  MovieVideoSeries,
} from './component/movie-user/MovieVideoSeries';
import {
  filterMovieLoader,
  MovieVideo,
} from './component/movie-user/movie-comment/MovieVideoSingle';
import { Page } from './component/movie-user/Page';
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
        path: '/:id',
        element: <MovieDetail />,
        loader: posterMovieLoader,
      },
      {
        path: '/xem-phim/:id',
        element: <MovieVideo />,
        loader: filterMovieLoader,
      },
      {
        path: '/xem-phim-bo/:id',
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
            element: <AddMovie />,
            loader: MovieDetailLoader,
          },
          {
            path: '/admin/movie/:id', 
            element: <AddMovie value="Edit" />, 
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

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Login from './pages/Login';
import Register from './pages/Register';
import {
  AddOrUpdateMovie,
  AddOrUpdateMovieLoader,
} from './pages/Admin/AddOrUpdateMovie/AddOrUpdateMovie';
import { Admin } from './pages/Admin/Admin';
import { ListMovie, MovieManagerLoader } from './pages/Admin/ListMovieAdmin';
import { CountryLoader, Movie, MovieLoader } from './pages/ListMovieUser';
import { MovieDetail, posterMovieLoader } from './pages/MovieDetail';
import {
  filterMovieSeriesLoader,
  MovieVideoSeries,
} from './pages/MovieVideoSeries';
import { filterMovieLoader, MovieVideo } from './pages/MovieVideoSingle';
import { Page } from './pages/Page';
import PrivateRoute from './component/PrivateRoute';
import './index.scss';
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
            loader: AddOrUpdateMovieLoader,
          },
          {
            path: '/admin/movie/:id',
            element: <AddOrUpdateMovie />,
            loader: AddOrUpdateMovieLoader,
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

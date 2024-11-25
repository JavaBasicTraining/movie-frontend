import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import { ListMovie, MovieManagerLoader } from './component/manager/list-movie/ListMovieAdmin';
import { CountryLoader, Movie, MovieLoader } from './component/movie-user/list-movie/ListMovieUser';
import { MovieDetail, posterMovieLoader } from './component/movie-user/movie-detail/MovieDetail';
import { filterMovieLoader, MovieVideo } from './component/movie-user/movie-player/MovieVideoSingle';
import { Page } from './pages/Page';
import PrivateRoute from './component/PrivateRoute';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Oauth2Redirect, { Oauth2RedirectLoader } from './component/account/Oauth2Redirect';
import { AddMovie, MovieDetailLoader } from './component/manager/add-movie/AddMovie';
import { Admin } from './component/manager/admin/Admin';
import Login from './component/account/Login';

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
        loader: posterMovieLoader,
      },
      {
        path: '/xem-phim/:id',
        element: <MovieVideo />,
        loader: filterMovieLoader,
      }
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
    path: '/redirect',
    element: <Oauth2Redirect />,
    loader: Oauth2RedirectLoader,
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);

reportWebVitals();

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import { ListMovie, MovieManagerLoader } from './component/Manager/ListMovie/ListMovieAdmin';
import { CountryLoader, Movie, MovieLoader } from './pages/ListMovie/ListMovieUser';
import { MovieDetail, posterMovieLoader } from './pages/MovieDetail/MovieDetail';
import { filterMovieLoader, MovieVideo } from './component/MovieUser/MoviePlayer/MovieVideoSingle';
import { Page } from './pages/Page/Page';
import PrivateRoute from './component/PrivateRoute';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Oauth2Redirect, { Oauth2RedirectLoader } from './component/Account/Oauth2Redirect';
import { AddMovie, MovieDetailLoader } from './component/Manager/AddMovie/AddMovie'
import { Admin } from './pages/Admin/Admin';

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

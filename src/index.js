import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import './index.css';
import {
  AddMovieLoader,
  MovieEditor,
} from './pages/Admin/MovieEditor/MovieEditor';
import { Admin } from './pages/Admin/Admin';
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
import { WatchMovie } from './pages/WatchMovie/WatchMovie';
import reportWebVitals from './reportWebVitals';
import { Home } from './pages/Home/Home';
import {
  MovieManager,
  MovieManagerLoader,
} from './pages/Admin/MovieManager/MovieManager';

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
    element: <Admin />,
    children: [
      {
        path: '/admin/movie/',
        element: <MovieManager />,
        loader: MovieManagerLoader,
      },
      {
        path: '/admin/movie/new',
        element: <MovieEditor />,
        loader: AddMovieLoader,
      },
      {
        path: '/admin/movie/:id',
        element: <MovieEditor value="Edit" />,
        loader: AddMovieLoader,
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

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import App from './App';
import {CountryLoader, Movie, MovieLoader,} from './component/movie-user/ListMovieUser';
import Register from './component/account/Register';
import {Admin} from './component/manager/Admin';
import Login from './component/account/Login';
import {AddMovie} from './component/manager/AddMovie';
import {ListMovie, MovieManagerLoader,} from './component/manager/ListMovieAdmin';
import {UpdateMovie, UpdateMovieLoader,} from './component/manager/UpdateMovie';
import {MovieDetail, posterMovieLoader,} from './component/movie-user/MovieDetail';
import {filterMovieLoader, MovieVideo,} from './component/movie-user/MovieVideoSingle';
import {filterMovieSeriesLoader, MovieVideoSeries,} from './component/movie-user/MovieVideoSeries';
import {Page} from './component/movie-user/Page';
import PrivateRoute from "./component/PrivateRoute";

// này là cách mới
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
            element: <AddMovie />,
            loader: MovieManagerLoader,
          },
          {
            path: '/admin/movie/:id',
            element: <UpdateMovie />,
            loader: UpdateMovieLoader,
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

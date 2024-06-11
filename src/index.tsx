import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider, } from "react-router-dom";
import MovieDetail, { MovieDetailLoader } from "./page/MovieDetail";
import ErrorPage from "./ErrorPage";
import Home, { HomeLoader } from "./page/Home";
import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    errorElement: <ErrorPage/>,
    children: [
      {
        path: "/",
        element: <Home/>,
        loader: HomeLoader,
      },
      {
        path: "movie/:id",
        element: <MovieDetail/>,
        loader: MovieDetailLoader,
      },
    ],
  },
]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

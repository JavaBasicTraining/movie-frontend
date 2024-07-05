import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import { Movie } from "./component/Movie";
import Register from "./component/Register";
import { Admin } from "./component/Admin";
import Login from "./component/Login";
import { AddMovie } from "./component/addPhim/AddMovie";
import { ListMovie } from "./component/addPhim/ListMovie";
import { UpdateMovie, UpdateMovieLoader } from "./component/addPhim/UpdateMovie";
import { UploadFile } from "./component/UploadFile";
import { filterMovieLoader, InfoMovie } from "./component/addPhim/InfoMovie";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/movie",
        element: <Movie />,
      },
      // {
      //   path: "/movie/:title",
      //   element: <Movie />,
      //  // loader: MovieLoader,
      // },
    ],
  },
  {
    path: "/admin",
    element: <Admin />,
    children: [
      {
        path: "/admin/movie/",
        element: <ListMovie />,
      },
      {
        path: "/admin/movie/new",
        element: <AddMovie />,
     
      },
      {
        path: "/admin/movie/:id",  
        element: <UpdateMovie />,
        loader: UpdateMovieLoader
      },
      
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/auto",
    element: <UploadFile />,
  },
  {
    path: "/movie/info/:nameMovie",
    element: <InfoMovie />,
    loader: filterMovieLoader
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// ReactDOM.render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

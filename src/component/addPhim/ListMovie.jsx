import React, { useEffect, useState } from "react";
import {  useNavigate } from "react-router-dom";
import { axiosInstance } from "../../API/axiosConfig";

export const ListMovie = () => {
  const [data, setData] = useState([]);
    const navigate = useNavigate();

  //   async function getList() {
  // const response = await axios.get(
  //   "http://localhost:8081/api/v1/movies" //
  // );
  // setData(response.data);

  // cach 2
  //   }

  // cach 2
  const deleteMovie = async (params) => {
    try {
      await axiosInstance.delete(`/api/v1/admin/movies/${params}`);
      alert("Xóa thành công");
      window.location.reload();
    } catch (error) {
      alert(`Lỗi khi xóa phim: ${error.message}`);
    }
  };

  const fetchMovies = () => {
    axiosInstance
      .get("/api/v1/admin/movies")
      .then((res) => {
        console.log(res)
        setData(res.data);
      });
  };
  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.nameMovie}</td>
              <td>{item.description}</td>
              <td>
                <button onClick={() => navigate(`/admin/movie/${item.id}`)}>Edit</button>
                <button onClick={() => deleteMovie(`${item.id}`)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

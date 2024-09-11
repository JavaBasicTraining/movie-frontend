import React, { useEffect, useState } from 'react';
import {
  Link,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { axiosInstance } from '../../API/axiosConfig';

export async function MovieManagerLoader({ params, request }) {
  const searchParams = new URL(request.url).searchParams;
  const response = await axiosInstance.get(`/api/v1/movies`, {
    params: searchParams,
  });

  return { movies: response.data ?? [] };
}

export const ListMovie = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);

  const countries = [
    { name: 'Việt Nam', path: 'viet-nam' },
    { name: 'Mỹ', path: 'my' },
    { name: 'Thái Lan', path: 'thai-lan' },
    { name: 'Nhật Bản', path: 'nhat-ban' },
    { name: 'Hồng Kông', path: 'hong-kong' },
    { name: 'Ấn Độ', path: 'an-do' },
    { name: 'Úc', path: 'uc' },
  ];

  const { movies } = useLoaderData();
  const navigate = useNavigate();

  useEffect(() => {
    fetchGenre();
  }, []);

  const fetchGenre = async () => {
    try {
      const response = await axiosInstance.get(`/api/v1/genre`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const deleteMovie = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phim này?')) {
      try {
        await axiosInstance.delete(`/api/v1/admin/movies/${id}`);
        alert('Xóa thành công');
        window.location.reload();
      } catch (error) {
        alert(`Lỗi khi xóa phim: ${error.message}`);
      }
    }
  };

  const renderSelect = (items, paramName, placeholder) => {
    const handleSearchChange = (e) => {
      const params = new URLSearchParams(searchParams);
      params.set(paramName, e.target.value);
      setSearchParams(params);
    };

    return (
      <select defaultValue={'default'} onChange={handleSearchChange}>
        <option value={'default'} disabled>
          {placeholder}
        </option>
        {items.map((item) => (
          <option key={item.label} value={item.value.name}>
            {item.label}
          </option>
        ))}
      </select>
    );
  };

  return (
    <div>
      <div className="container-navbar-admin">
        <Link to="/admin/movie/new">
          <button>Add New</button>
        </Link>

        {renderSelect(
          categories.map((category) => ({
            label: category.name,
            value: category,
          })),
          'genre',
          'Chon the loai'
        )}
        {renderSelect(
          countries.map((country) => ({
            label: country.name,
            value: country,
          })),
          'country',
          'Chon quoc gia'
        )}
      </div>
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
          {movies.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.nameMovie}</td>
              <td>{item.description}</td>
              <td>
                <button onClick={() => navigate(`/admin/movie/${item.id}`)}>
                  Edit
                </button>
                <button onClick={() => deleteMovie(item.id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

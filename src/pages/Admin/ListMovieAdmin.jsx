import React, { useEffect, useState } from 'react';
import {
  Link,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { axiosInstance } from '../../API/axiosConfig';
import SelectField from '../../component/SelectField';
import { Button } from 'react-bootstrap';
import './ListMovieAdmin.scss';

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
    const handleSearchChange = ({ value }) => {
      const params = new URLSearchParams(searchParams);
      params.set(paramName, value);
      setSearchParams(params);
    };

    return (
      <SelectField
        placeholder={placeholder}
        onChange={handleSearchChange}
        options={items.map((item) => ({
          label: item.label,
          value: item.value.name,
        }))}
        fullWidth={false}
      />
    );
  };

  return (
    <div>
      <div className="ListMovieAdmin d-flex flex-column gap-4">
        <div className="ListMovieAdmin__filter-controls">
          <Link to="/admin/movie/new">
            <Button variant={'primary'}>Tạo phim</Button>
          </Link>

          <div className="d-flex align-items-center flex-row gap-2">
            {renderSelect(
              categories.map((category) => ({
                label: category.name,
                value: category,
              })),
              'genre',
              'Thể loại'
            )}
            {renderSelect(
              countries.map((country) => ({
                label: country.name,
                value: country,
              })),
              'country',
              'Quốc gia'
            )}
          </div>
        </div>

        <table className="table table-bordered table-striped">
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
                  <div className="d-flex align-items-center gap-3">
                    <Button onClick={() => navigate(`/admin/movie/${item.id}`)}>
                      Edit
                    </Button>

                    <Button
                      variant={'danger'}
                      onClick={() => deleteMovie(item.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

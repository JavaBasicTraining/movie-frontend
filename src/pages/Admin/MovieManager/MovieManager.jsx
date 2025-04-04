import { Button, Modal, notification, Select, Space, Table } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Link,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import './MovieManager.scss';
import { genreService, loadingService, movieService } from '../../../services';
import { PlusOutlined, SyncOutlined } from '@ant-design/icons';

export async function MovieManagerLoader({ request }) {
  loadingService.show();
  const searchParams = new URL(request.url).searchParams;
  const response = await movieService.query({
    genre: searchParams.get('genre'),
    country: searchParams.get('country'),
    page: searchParams.get('page') ?? 0,
    size: searchParams.get('size') ?? 20,
    sort: 'id,desc',
  });

  loadingService.hide();

  const totalCount = parseInt(response.headers['x-total-count']) ?? 0;

  return {
    movies: response.data ?? [],
    genre: searchParams.get('genre'),
    country: searchParams.get('country'),
    totalCount,
  };
}

const countries = [
  { name: 'Việt Nam', path: 'viet-nam' },
  { name: 'Mỹ', path: 'my' },
  { name: 'Thái Lan', path: 'thai-lan' },
  { name: 'Nhật Bản', path: 'nhat-ban' },
  { name: 'Hồng Kông', path: 'hong-kong' },
  { name: 'Ấn Độ', path: 'an-do' },
  { name: 'Úc', path: 'uc' },
];

export const MovieManager = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { movies, genre, country, totalCount, size } = useLoaderData();
  const navigate = useNavigate();
  const [genres, setGenres] = useState([]);
  const [moviesState, setMoviesState] = useState(movies);
  const [reloading, setReloading] = useState(false);
  const [pagination, setPagination] = useState({
    current: (searchParams.get('page') ?? 0) + 1,
    pageSize: searchParams.get('size') ?? 20,
    total: totalCount,
  });

  const fetchGenres = useCallback(() => {
    genreService.getAll().then((res) => {
      setGenres(res.data);
    });
  }, []);

  const fetchMovies = useCallback(async () => {
    const res = await movieService.query({
      genre,
      country,
      page: pagination.current - 1,
      size: pagination.pageSize,
      sort: 'id,desc',
    });
    setMoviesState(res.data);
  }, [genre, country, pagination]);

  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  useEffect(() => {
    setMoviesState(movies);
  }, [movies]);

  const deleteMovie = async (id) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa phim này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await movieService.delete(id);
          setMoviesState(moviesState.filter((movie) => movie.id !== id));
          notification.success({ message: 'Xóa thành công' });
        } catch (error) {
          notification.error({ message: `Lỗi khi xóa phim: ${error.message}` });
        }
      },
    });
  };

  const renderSelect = (items, paramName, placeholder, defaultValue) => {
    const handleSearchChange = (value) => {
      const params = new URLSearchParams(searchParams);
      if (!value) {
        params.delete(paramName);
      } else {
        params.set(paramName, value);
      }
      setSearchParams(params);
    };

    return (
      <Select
        style={{ width: '150px' }}
        defaultValue={defaultValue}
        placeholder={placeholder}
        onChange={handleSearchChange}
        options={items.map((item) => ({
          label: item.label,
          value: item.value,
        }))}
        allowClear
      />
    );
  };

  const handleReloadClick = () => {
    loadingService.show();
    setReloading(true);
    fetchMovies().finally(() =>
      setTimeout(() => {
        loadingService.hide();
        setReloading(false);
      }, 1000)
    );
  };

  const handleTableChange = (pagination) => {
    console.log('Pagination:', pagination);
    setPagination(pagination);
    updateSearchParams({
      page: pagination.current - 1,
      size: pagination.pageSize,
    });
  };

  const updateSearchParams = ({ page, size }) => {
    const params = new URLSearchParams(searchParams);
    if (page) {
      params.set('page', page.toString());
    } else {
      params.delete('page');
    }
    if (size) {
      params.set('size', size);
    } else {
      params.delete('size');
    }
    setSearchParams(params);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'nameMovie',
      key: 'nameMovie',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button onClick={() => navigate(`/admin/movie/${record.id}`)}>
            Edit
          </Button>
          <Button danger onClick={() => deleteMovie(record.id)}>
            Remove
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="MovieManager">
      <div className="MovieManager__actions">
        <div className="MovieManager__filter-control">
          <Button
            icon={<SyncOutlined spin={reloading} />}
            onClick={handleReloadClick}
            disabled={reloading}
          >
            Reload
          </Button>

          {renderSelect(
            genres.map((category) => ({
              label: category.name,
              value: category.name,
            })),
            'genre',
            'Enter genre',
            genre
          )}

          {renderSelect(
            countries.map((country) => ({
              label: country.name,
              value: country.name,
            })),
            'country',
            'Enter country',
            country
          )}
        </div>

        <Link to="/admin/movie/new">
          <Button icon={<PlusOutlined />} type="primary">
            Add New
          </Button>
        </Link>
      </div>

      <Table
        columns={columns}
        dataSource={moviesState}
        rowKey="id"
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
        }}
        onChange={handleTableChange}
      />
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { Button, Input, notification } from 'antd';
import './Test.scss';
import { axiosInstance } from '../../../configs/axiosConfig';

const Test = () => {
  const [count, setCount] = useState(0);
  const userName = 'admin';
  const [data, setData] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [genreChange, setGenreChange] = useState('');
  const [showList, setShowList] = useState(false);

  const fetchGenres = async () => {
    const response = await axiosInstance.get('api/v1/genre');
    setData(response.data);
  };
  const incrementCount = () => {
    setCount(count + 1);
  };

  useEffect(() => {
    fetchGenres();
  }, []);
  const decrementCount = () => {
    if (count > 0) {
      setCount(count - 1);
    }
  };

  const handleShowInput = () => {
    setShowInput((prevState) => !prevState);
  };

  const handleShowList = () => {
    setShowList((prevState) => !prevState);
  };

  const handleChange = (e) => {
    setGenreChange(e.target.value);
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCreateGenre();
    }
  };

  const handleCreateGenre = async() => {
    try {
      const request = { name: genreChange };
      const res = await axiosInstance.post('/api/v1/genre', request);
      if (res.data && res.data.name) {
        setData((prevData) => [...prevData, res.data]);
      }
      notification.success({
        message: 'Tạo genre thành công!',
      });
      setShowInput(false)
    } catch (error) {
      notification.error({
        message: `Lỗi khi tạo genre ${error.message}`,
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await axiosInstance.delete(`/api/v1/genre`, {
        params: { id: id },
      });
      setData((prev) => prev.filter((item) => item.id !== id));

      notification.success({
        message: 'Xóa genre thành công!',
      });
    } catch (error) {
      notification.error({
        message: `Lỗi khi xóa genre ${error.message}`,
      });
    }
  };
  return (
    <div className="test-container">
      <div className="list-btn">
     
        <Button onClick={handleShowList}>Danh Sách</Button>
      </div>
      <div className="list-item">
        {showList &&
          data.map((item, index) => {
            return (
              <span className="item" key={index}>
                {item.name}
                <Button onClick={() => handleDelete(item.id)}> Xóa</Button>
              </span>
            );
          })}
      </div>
      <div className="btn-add">
        <Button onClick={handleShowInput}> {showInput ? 'Ẩn' : 'Add'} </Button>
        {showInput && (
          <>
            <Input
              className="input-add"
              onChange={handleChange}
              value={genreChange}
              placeholder="Nhập tên genre"
              onKeyDown={handleKeyDown}
            />

            <Button onClick={handleCreateGenre}>Submit</Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Test;

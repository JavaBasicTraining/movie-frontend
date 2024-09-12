import axios from 'axios';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import useAuth from '../hook/useAuth';
import { useEffect, useState } from 'react';
import useFetchUser from '../hook/useFetchUser';

async function login(username, password) {
  const loginUrl = 'http://localhost:8081/api/account/login';

  try {
    const response = await axios.post(loginUrl, {
      username: username,
      password: password,
    });

    if (response.status === 200) {
      const token = response.data.id_token;
      localStorage.setItem('token', token);
      return token;
    } else {
      console.error('Đăng nhập không thành công:', response.status);

      return null;
    }
  } catch (error) {
    if (error.response) {
      console.error('Lỗi đăng nhập:', error.response.data);
    } else if (error.request) {
      console.error('Không nhận được phản hồi từ server:', error.request);
    } else {
      console.error('Lỗi khác:', error.message);
    }
    return null;
  }
}

export default function Login() {
  const navigate = useNavigate();
  const isAuth = useAuth();
  const [token, setToken] = useState(null);
  const { user, isUser, fetchUser } = useFetchUser(token);

  useEffect(() => {
    if (isAuth && isUser) {
      navigate('/');
    } else if (!isUser) {
      navigate('/login');
    }
  }, [isAuth]);

  async function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const token = await login(username, password);
    if (token) {
      setToken(token);
    
      await fetchUser(
      
        (userFetched) => {
       
          if (userFetched && userFetched.authorities.includes('Admin')) {
            alert('Đăng Nhập Tài Khoản Admin Thành Công!!!');
            navigate('/admin/movie');
          } else {
            navigate('/');
          }
        }
      );
    } else if (username === '' || password === '') {
      alert('Vui lòng nhập đầy đủ user password');
    } else {
      alert(
        'Đăng nhập thất bại. Vui lòng kiểm tra lại tên đăng nhập và mật khẩu.'
      );
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };
  const getUser = async (token) => {
    try {
      const res = await axios.get('http://localhost:8081/api/account/info', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    } catch (err) {
      return null;
    }
  };

  return (
    <div className="form">
      <div className="body">
        <label className="color-label">Welcom to Admin TrumPhim.Net</label>
        <div className="login-form">
          <h2 className="color-label">Đăng nhập thành viên </h2>
          <input
            type="text"
            id="username"
            placeholder="Tên đăng nhập"
            onKeyDown={handleKeyDown}
            required
          />
          <input
            type="password"
            id="password"
            placeholder="Mật khẩu"
            onKeyDown={handleKeyDown}
            required
          />
          <button onClick={handleLogin}>Đăng nhập</button>
          <Link className="color-label" to="/src/pages/Register">
            Bạn chưa có tài khoản?
          </Link>
          <Link className="color-label" to="/public">
            Trở về trang chủ
          </Link>
          <Link className="color-label" to="https://www.facebook.com/login">
            Đăng Nhập Bằng FaceBook
          </Link>
        </div>
      </div>
    </div>
  );
}

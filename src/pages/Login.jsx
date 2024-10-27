import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useEffect, useState } from 'react';
import useFetchUser from '../hooks/useFetchUser';
import { KeycloakComponent } from '../component/account/KeycloakComponent';

async function login(username, password) {
  const loginUrl = 'http://localhost:8081/api/account/login';
  // console.log(RedirectUri)

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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { user, isUser, fetchUser } = useFetchUser(token);

  useEffect(() => {
    const storedToken = localStorage.getItem('access_token');
    if (storedToken) {
      setToken(storedToken);
    }

    if (isAuth && isUser) {
      navigate('/');
    } else if (!isUser) {
      navigate('/login');
    }
  }, [isAuth, isUser, token, navigate]);
  return (
    <div className="form">
      <div className="body">
        <label className="color-label">Welcome to Admin TrumPhim.Net</label>
        <div className="login-form">
          <h2 className="color-label">Đăng nhập thành viên</h2>
          <KeycloakComponent />

          <Link className="color-label" to="/register">
            Bạn chưa có tài khoản?
          </Link>
          <Link className="color-label" to="/">
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

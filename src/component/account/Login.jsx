import axios from "axios";
import { Link, Navigate, useNavigate } from "react-router-dom";
import useAuth from "../../hook/useAuth";
import { useEffect } from "react";
import useFetchUser from "../../hook/useFetchUser";

async function login(username, password) {

const loginUrl = "http://localhost:8081/api/account/login";
  try {
    const response = await axios.post(loginUrl, {
      username: username,
      password: password,
    });

    if (response.status === 200) {
      const token = response.data.id_token;
      localStorage.setItem("token", token);
      return token;
    } else {
      console.error("Đăng nhập không thành công:", response.status);

      return null;
    }
  } catch (error) {
    if (error.response) {
      console.error("Lỗi đăng nhập:", error.response.data);
    } else if (error.request) {
      console.error("Không nhận được phản hồi từ server:", error.request);
    } else {
      console.error("Lỗi khác:", error.message);
    }
    return null;
  }
}

export default function Login() {
  const navigate = useNavigate();
  const isAuth = useAuth();
  const {user, isUser} = useFetchUser();

  useEffect(() => {
    if (isAuth && isUser ) {
      navigate("/");
      
    }else if (!isUser)
    {
      navigate('/login')
    }
  }, [isAuth]);

  async function handleLogin() {
    const username = document.getElementById("username").value;

    const password = document.getElementById("password").value;
    const token = await login(username, password);
    if (token) {
     // const user = await getUser(token);
      if (user && user.authorities.includes("admin")) {
        alert("Đăng Nhập Tài Khoản Admin Thành Công!!!");
        navigate("/admin/movie");
      } else {
        navigate("/");
      }
    } else if (username === "" || password === "") {
      alert("Vui lòng nhập đầy đủ user password");
    } else {
      alert(
        "Đăng nhập thất bại. Vui lòng kiểm tra lại tên đăng nhập và mật khẩu."
      );
    }
  }
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
            required
          />
          <input
            type="password"
            id="password"
            placeholder="Mật khẩu"
            required
          />
          <button onClick={handleLogin}>Đăng nhập</button>
          <Link className="color-label" to="/register">
            {" "}
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

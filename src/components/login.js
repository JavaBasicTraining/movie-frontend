import axios from 'axios';
import { useState } from 'react'; 
import TextField from './text-field';

export default function Login() {
    const baseUrl = "http://localhost:8080";
    function login() {
        return axios.post(`${baseUrl}/realms/movie_website_realm/protocol/openid-connect/token`,
            {
                username: `${username}`,
                password: `${password}`,
                grant_type: "password",
                client_id: "movie_website_client",
                client_secret: "qzCJMkYA98S6fnW4V82pP19ccIGAexZf"
            },
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        ).then((response) => {
            // console.log(response.data.access_token);
            alert('Thanh cong');
            localStorage.setItem("token", response.data.access_token);
        }).catch((reason) => {
            alert('That bai');
            console.log(reason);
        })
    }

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // a , get(){return a}, set(value){a = value}, useState(value){a = value}

    return (
        <div className="login_form">
            <div className='header'>
                <label className='login'>Đăng Nhập</label>
            </div>
            <TextField label="Tài khoản" setValue={setUsername} icon={<i class="fa-solid fa-user"></i>} />
            <TextField label="Mật khẩu" setValue={setPassword} icon={<i class="fa-solid fa-lock"></i>} />
            <div className='forget_password'>
                <a href='#'>Quên mật khẩu?</a>
            </div>
            <button onClick={login} className='btn_login'>Login</button>
        </div>)
}

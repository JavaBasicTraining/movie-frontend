import axios from 'axios';
import React, { useState } from 'react';
import '../styles/register.css';
import TextField from './text-field';

// export default function Register() {
//     return (
//         <div className="register">
//             <div className="header">
//                 <label className=''>Đăng Ký</label>

//             </div>
//         </div>

//     )

// }

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [email, setEmail] = useState("");
    const [lastName, setLastname] = useState("");
    const [verifyPassword, setVerifyPassword] = useState("");

    const baseUrl = "http://localhost:8080";

    function register() {
        return axios.post(`${baseUrl}/realms/movie_website_realm/users`,
            {
                firstName: `${firstName}`,
                lastName: `${lastName}`,
                email: `${email}`,
                enable: true,
                username:  `${username}`
            },
            {
                headers: {
                    "Content-Type": "application/json"
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
    
    return (
        <div className="register_form">
            <div className="header">
                Đăng Ký
            </div>
            <TextField label="Họ Tên" type="text" setValue={setFirstName} icon={<i class="fa-solid fa-signature"></i>} />
            <TextField label="Tên đăng nhập" type="text" setValue={setUsername} icon={<i class="fa-solid fa-user"></i>} />
            <TextField label="Mật Khẩu" type="password" setValue={setPassword} icon={<i class="fa-solid fa-lock"></i>}/>
            <TextField label="Xác Nhận Mật Khẩu" type="password" setValue={setVerifyPassword} icon={<i class="fa-solid fa-lock"></i>} />
            {/* <TextField label="Giới Tính" type="text" value={sex} setValue={setSex} />
            <TextField label=" Địa chỉ" type="text" value={address} setValue={setAddress} /> */}
            <button onClick={register}>Đăng Ký</button>
        </div>

    )
}

export default Register;

// class Register extends React.Component {
//     render() {
//         return (
//             <div>dawdawdaw</div>
//         )
//     }
// }

// export default Register;
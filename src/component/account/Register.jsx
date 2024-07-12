import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });


  const handleChange = (e) => {
    const authorities = ["user"];
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      authorities: authorities

    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const checkUser = getUserName(formData.username).then((res) => console.log(res)) // chỗ res chỗ này là sao  
    // lam sai r, hàm này đang async có khả năng chạy chưa xong mà sẽ chạy suống dưới luôn
    // check dưới server lun
    try {
      if (formData.username === '' || formData.password === '' || formData.firstName === '' || formData.lastName === '' || formData.email === '' || formData.phoneNumber === '') {
        alert('Vui lòng nhập thông tin')
      } else {
        try {
          const response = await axios.post('http://localhost:8081/api/account/register', formData);
          alert('Đăng Ký Tài Khoản Thành Công', response.data);
          navigate('/login');
        } catch (error) {
          if (error.response.status === 409) {
            alert("User đã tồn tại trong hệ thống!!!")
          }
          if(error.response.status === 500) {
            alert("Lỗi hệ thống!!!")
          }
        }
      }
    } catch (error) {
      alert('Tài khoản tồn tại');
    }
  };

  return (
    <form className='form'>
      <div className='form-register'>
        <h1 className='color-label'>Welcom to Admin TrumPhim.Net</h1>
        <div className='selectedInputForm'>
          <label>Username: </label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} required />
        </div>
        <div className='selectedInputForm'>
          <label>PassWord: </label>
          <input type="text" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div className='selectedInputForm'>
          <label>Frist Name: </label>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
        </div>
        <div className='selectedInputForm'>
          <label>Last Name: </label>
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
        </div>
        <div className='selectedInputForm'>
          <label>Email: </label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className='selectedInputForm'>
          <label >Phone  :</label>
          <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
        </div>

        <button onClick={handleSubmit}>Register</button>
        <a className='color-label' href='http://localhost:3000/login'> Bạn đã có tài khoản?</a>
        <a className='color-label' href='http://localhost:3000'> Trở về trang chủ</a>

      </div>
    </form>
  );
};

export default RegistrationForm;

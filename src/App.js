import Search from 'antd/lib/input/Search';
import './App.scss';
import Filter from './components/filter';
import Navbar from './components/navbar';
function App() {

  return (
    <div className='app'>
      <div className='header'>
        <div className='title'>
          <label>PhimHay.Net</label>
          <Search className='search' placeholder="Tìm:tên phim, đạo diễn, diễn viên" enterButton />
        </div>
        <Navbar />
        <Filter />
      </div>
      <div className='body'>
        <div className='left'></div>
        <div className='right'></div>
      </div>
      <div className='footer'>

      </div>
    </div>
  );
}

export default App;

  // function getUser() {
  //   var token = localStorage.getItem("token");
  //   return axios.get(`${baseUrl}/user/1`,
  //     {
  //       headers: {
  //         "Authorization": `Bearer ${token}`
  //       }
  //     }
  //   ).then((response) => {

  //   })
  // }



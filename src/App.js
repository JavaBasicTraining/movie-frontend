import { Outlet } from 'react-router-dom';
import './App.scss';
import { HomePage } from '../src/pages/Home/Home'
import { NavbarUser } from './component/movie-user/navbar-user/NavbarUser';
function App() {
  return (
    <div className="Page">
      <HomePage />
      <NavbarUser />
      <Outlet />
    </div>
  );
}

export default App;

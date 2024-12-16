import { Outlet } from 'react-router-dom';
import './App.scss';
import { NavbarUser } from './component/NavbarUser/NavbarUser';
import { Header } from './pages/Header/Header';

function App() {
  return (
    <div className="Page">
      <Header />
      <NavbarUser />
      <Outlet />
    </div>
  );
}

export default App;

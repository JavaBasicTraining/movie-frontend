import { Outlet } from 'react-router-dom';
import './App.scss';
import { NavbarUser } from './component/NavbarUser/NavbarUser';
import { Header } from './component/Header/Header';

function App() {
  return (
    <div className="App">
      <Header />
      <NavbarUser />
      <Outlet />
    </div>
  );
}

export default App;

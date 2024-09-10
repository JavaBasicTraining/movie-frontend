import { Outlet } from 'react-router-dom';
import './App.scss';
import { HomePage } from './pages/Home';
import { NavbarUser } from './component/NavbarUser';

function App() {
  return (
    <div className="App">
      <HomePage />
      <NavbarUser />
      <Outlet />
    </div>
  );
}

export default App;

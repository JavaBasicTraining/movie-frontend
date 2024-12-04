import { Outlet } from 'react-router-dom';
import './App.scss';
import { NavbarUser } from './component/NavbarUser/NavbarUser';
import { Header } from './pages/Home/Home';
import { UserProvider } from './contexts/UserContext';

function App() {
  return (
    <UserProvider>
      <div className="Page">
        <Header />
        <NavbarUser />
        <Outlet />
      </div>
    </UserProvider>
  );
}

export default App;

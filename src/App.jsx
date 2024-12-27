import { Outlet } from 'react-router-dom';
import './App.scss';
import { Header, NavbarUser } from './component';

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

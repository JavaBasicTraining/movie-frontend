import { Outlet } from 'react-router-dom';
import './App.scss';
import { FriendSection, Header, NavbarUser } from './component';
import { AuthProvider } from './contexts';

function App() {
  return (
    <AuthProvider>
      <main className="App">
        <div className="App__container">
          <NavbarUser />

          <div className="App__content">
            <Header />
            <div>
              <Outlet />
              <FriendSection />
            </div>
          </div>
        </div>
        <div className="App__playing-section"></div>
      </main>
    </AuthProvider>
  );
}

export default App;

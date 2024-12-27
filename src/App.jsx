import { Outlet } from 'react-router-dom';
import './App.scss';
import { FriendSection, Header, NavbarUser } from './component';
import { AuthProvider } from './contexts';
import { Flex } from 'antd';

function App() {
  return (
    <AuthProvider>
      <main className="App">
        <div className="App__container">
          <NavbarUser />

          <Flex className="App__content" vertical gap={10}>
            <Header />
            <Flex vertical style={{ width: '100%' }}>
              <Outlet />
              <FriendSection />
            </Flex>
          </Flex>
        </div>
        <div className="App__playing-section"></div>
      </main>
    </AuthProvider>
  );
}

export default App;

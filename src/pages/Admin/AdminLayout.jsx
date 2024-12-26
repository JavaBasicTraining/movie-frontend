import { Outlet, useNavigate } from 'react-router-dom';

import './AdminLayout.scss';

import React, { useEffect, useState } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import PrivateRoute from '../../component/PrivateRoute';
import { Button, Layout, theme } from 'antd';
import { NavbarAdmin } from '../../component/NavbarAdmin/NavbarAdmin';
import { Loading } from '../../component/Loading/Loading';

const { Header, Sider, Content } = Layout;

export const AdminLayout = () => {
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const pathname = window.location.pathname.replace(/\//g, '');
    if (pathname === 'admin') {
      navigate('/admin/movie');
    }
  }, [navigate]);

  return (
    <PrivateRoute>
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="demo-logo-vertical" />
          <NavbarAdmin />
        </Sider>

        <Layout>
          <Header style={{ padding: 0 }}>
            <Button
              type="text"
              icon={
                collapsed ? (
                  <MenuUnfoldOutlined style={{ color: 'white' }} />
                ) : (
                  <MenuFoldOutlined style={{ color: 'white' }} />
                )
              }
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>

      <Loading />
    </PrivateRoute>
  );
};

import React, { useEffect, useState } from 'react';
import { Layout, Menu, theme } from 'antd';
import getItems from './sider/menuItem';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getMenuKeys, getRoutes } from './sider/getRoutes';
import './index.less'
import siderLogo from '@/assets/images/logo.svg';
import LayoutHeader from './header';

const { Sider, Content } = Layout;
const Home: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const items = getItems();
  // 通过menu值改变路由
  const [selectKey, setSelectKey] = useState<string>()
  // 通过路由获取menu值，显示在菜单
  const [selectedKey, setSelectedKey] = useState(getMenuKeys(location.pathname));

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    if (selectKey) {

      navigate(getRoutes(selectKey));

    }
  }, [selectKey]);
  useEffect(() => {

    const menuKey = getMenuKeys(location.pathname);

    if (menuKey !== selectKey) {
      setSelectKey(menuKey);
    }

    setSelectedKey(menuKey);
  }, [location.pathname]);

  return (
    <>
      {/* <RefreshToken /> */}
      <Layout>
        <Sider
          theme='light'
          trigger={null}
          collapsible
        // style={{ background: colorBgContainer }}
        >
          <div className="logo-container" style={{
            marginTop: '-30px',
            marginBottom: '-30px'
          }}>
            <img src={siderLogo} style={{ width: '100%' }} />
          </div>

          <Menu
            mode='inline'
            onSelect={({ key }) => {
              setSelectKey(key);
            }}
            selectedKeys={[selectedKey]}
            // defaultSelectedKeys={['menu5']}
            items={items} />

        </Sider>
        <Layout>
          <LayoutHeader />
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 500,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </Content>

        </Layout>

      </Layout>

    </>

  );
};

export default Home;

import './index.less';

import { Layout, Menu, theme } from 'antd';
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import siderLogo from '@/assets/images/logo.svg';

import LayoutHeader from './header';
import { getMenuKeys, getRoutes } from './sider/getRoutes';
import getItems from './sider/menuItem';

const { Sider, Content } = Layout;
const Home: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const items = getItems();
	// 通过menu值改变路由
	const [selectKey, setSelectKey] = useState(getMenuKeys(location.pathname));

	const {
		token: { colorBgContainer, borderRadiusLG }
	} = theme.useToken();

	useEffect(() => {
		const menuKey = getMenuKeys(location.pathname);
		setSelectKey(menuKey);
	}, [location.pathname]);

	return (
		<>
			{/* <RefreshToken /> */}
			<Layout>
				<Sider
					theme="light"
					trigger={null}
					collapsible
				// style={{ background: colorBgContainer }}
				>
					<div
						className="logo-container"
						style={{
							marginTop: '-30px',
							marginBottom: '-30px'
						}}
					>
						< img src={siderLogo} style={{ width: '100%' }} />
					</div>

					<Menu
						mode="inline"
						onSelect={({ key }) => {
							setSelectKey(key);
							navigate(getRoutes(key));
						}}
						selectedKeys={[selectKey]}
						// defaultSelectedKeys={['menu5']}
						items={items}
					/>
				</Sider>
				<Layout>
					<LayoutHeader />
					<Content
						style={{
							margin: '24px 16px',
							padding: 24,
							minHeight: 500,
							background: colorBgContainer,
							borderRadius: borderRadiusLG
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
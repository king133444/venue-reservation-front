import type { ReactNode } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

import HomePage from '@/views/home/index';
import Login from '@/views/login/index';
import PersonalManage from '@/views/personalManage';
import ReserveManage from '@/views/reserveManage';
import VenueDynamics from '@/views/venueDynamics';

import AuthRoute from './AuthRouter';

// 路由元数据的类型
interface RouteMeta {
	title: string;
	key: string;
}

// 路由对象的类型
interface Route {
	path: string; // 路径
	element: ReactNode; // 渲染组件
	meta?: RouteMeta; // 可选的元数据
	children?: Route[]; // 可选的子路由数组
}

// 定义表示整个路由结构的数组类型
type RouteConfig = Route[];
export const rootRouter: RouteConfig = [
	{
		path: '/',
		element: <Navigate to="/login" />
	},
	{
		path: '/login',
		element: <Login />,
		meta: {
			title: '登录页',
			key: 'login'
		}
	},
	{
		path: '/home',
		element: (
			<AuthRoute>
				<HomePage />
			</AuthRoute>
		),
		children: [
			{
				path: '',
				element: (
					<AuthRoute>
						<ReserveManage />
					</AuthRoute>
				),
				meta: {
					title: '预约管理',
					key: 'reserveManage'
				}
			},
			{
				path: 'venueDynamics',
				element: (
					<AuthRoute>
						<VenueDynamics />
					</AuthRoute>
				),
				meta: {
					title: '场馆动态',
					key: 'venueDynamics'
				}
			},

			{
				path: 'personalManage',
				element: (
					<AuthRoute>
						<PersonalManage />
					</AuthRoute>
				),
				meta: {
					title: '人员管理',
					key: 'personalManage'
				}
			}

			// 添加其他子路由...
		],
		meta: {
			title: '主界面',
			key: 'homepage'
		}
	}
];

const Router = () => {
	const routes = useRoutes(rootRouter);
	return routes;
};

export default Router;

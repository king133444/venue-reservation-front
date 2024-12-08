import {
	AuditOutlined,
	CheckCircleOutlined,
	EyeOutlined,
	HistoryOutlined,
	LogoutOutlined,
	ProjectOutlined,
	ReconciliationOutlined,
	SolutionOutlined,
	TeamOutlined,
	UserOutlined
} from '@ant-design/icons';
import { type MenuProps, message } from 'antd';
import type { ItemType } from 'antd/es/menu/interface';
import React, { useCallback, useEffect, useState } from 'react';

import api from '@/api';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
	label: React.ReactNode,
	key: React.Key,
	icon?: React.ReactNode,
	children?: MenuItem[],
	disable?: boolean
): MenuItem {
	return {
		key,
		icon,
		children,
		label,
		disabled: disable ?? false
	} as MenuItem;
}

export default function useItems(id: string) {

	const [items, setItems] = useState<ItemType[]>([]);
	const [menus, setMenus] = useState<any>([]);
	const getMenus = useCallback(async () => {

		try {
			const result: any = await api.GetMenus({
				id: Number(id),
			});
			const { success, data, message: info } = result;
			const { auth } = data;
			const authArray = auth ? JSON.parse(auth) : [];
			if (success) {
				setMenus(authArray);
			} else {
				message.error(info);
			}
		} catch (error) {
			message.error('获取失败');
		}
	}, [id]);
	useEffect(() => {
		getMenus();
	}, [getMenus]);
	useEffect(() => {

		const menuMapping: any = {
			'场馆动态': getItem('场馆动态', 'menu2', <ProjectOutlined />),
			'预约管理': getItem('预约管理', 'menu1', <HistoryOutlined />),
			'预约查看': getItem('预约查看', 'menu9', <EyeOutlined />),
			'人员管理': getItem('人员管理', 'menu3', <TeamOutlined />),
			'申请审核': getItem('申请审核', 'menu8', <CheckCircleOutlined />),
			'免责设置': getItem('免责设置', 'menu5', <SolutionOutlined />),
			'权限管理': getItem('权限管理', 'menu99', <AuditOutlined />, [
				getItem('账号管理', 'menu6', <ReconciliationOutlined />),
				getItem('角色管理', 'menu7', <UserOutlined />),
			]),
			'退出': getItem('退出', 'menu4', <LogoutOutlined />)
		};

		const updateItems = menus.map((item: any) => menuMapping[item]).filter(Boolean);
		setItems(updateItems);
	}, [menus]);

	return items;
}

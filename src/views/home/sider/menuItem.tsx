import { HomeOutlined, LogoutOutlined, ProjectOutlined, SmileOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import type { ItemType } from 'antd/es/menu/interface';
import React from 'react';

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

export default function getItems() {
	let items: ItemType[] = [];

	items = [
		getItem('预约管理', 'menu1', <HomeOutlined rev={undefined} />),
		getItem('场馆动态', 'menu2', <ProjectOutlined rev={undefined} />),
		getItem('人员管理', 'menu3', <SmileOutlined rev={undefined} />),
		getItem('退出', 'menu4', <LogoutOutlined rev={undefined} />)
	];

	return items;
}

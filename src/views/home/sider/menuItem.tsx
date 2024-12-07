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
		getItem('场馆动态', 'menu2', <ProjectOutlined rev={undefined} />),
		getItem('预约管理', 'menu1', <HistoryOutlined rev={undefined} />),
		getItem('预约查看', 'menu9', <EyeOutlined rev={undefined} />),
		getItem('人员管理', 'menu3', <TeamOutlined rev={undefined} />),
		getItem('申请审核', 'menu8', <CheckCircleOutlined rev={undefined} />),
		getItem('免责设置', 'menu5', <SolutionOutlined rev={undefined} />),
		getItem('权限管理', '', <AuditOutlined rev={undefined} />, [
			getItem('账号管理', 'menu6', <ReconciliationOutlined rev={undefined} />),
			getItem('角色管理', 'menu7', <UserOutlined rev={undefined} />),
		]),
		getItem('退出', 'menu4', <LogoutOutlined rev={undefined} />)
	];
	return items;
}

// 根据菜单 key 值获取路由
export const getRoutes = (key: string) => {
	switch (key) {
		case 'menu1':
			return '/home/reserveManage';
		case 'menu2':
			return '/home/venueDynamics';
		case 'menu3':
			return '/home/personalManage';
		case 'menu5':
			return '/home/disclaimers';
		case 'menu4':
			return '/login';
		default:
			return '/';
	}
};

// 根据路由获取菜单Key值
export const getMenuKeys = (route: string) => {
	// route = route.split('/')[1]
	switch (route) {
		case '/home/reserveManage':
			return 'menu1';
		case '/home/venueDynamics':
			return 'menu2';
		case '/home/personalManage':
			return 'menu3';
		case '/home/disclaimers':
			return 'menu5';
		case '/login':
			return 'menu4';
		default:
			return '/';
	}
};

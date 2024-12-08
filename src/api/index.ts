import {
	fetchDelete,
	fetchGet,
	fetchPost,
	fetchPut,
	uploadFile
} from '@/components/ReqInstance/axios';

export default {
	/**
	 * 一、认证授权相关接口
	 */
	// 登录
	Login: (params: any) => {
		return fetchPost('/users/login', params);
	},
	// 注册
	Signup: (params: any) => {
		return fetchPost('/auth/register', params);
	},
	// 刷新令牌
	RefreshToken: (params: any) => {
		return fetchPost('/auth/refreshToken', params);
	},
	// 修改密码
	UpdatePassword: (params: any) => {
		return fetchPost('/auth/changePassword', params);
	},
	/**
	 * 二、用户相关接口
	 */
	// 修改用户信息
	UpdateUser: (params: any) => {
		return fetchPut('/users/updateUser', params);
	},
	// 删除用户
	DeleteUser: (params: any) => {
		return fetchDelete('/users/deleteUser', params);
	},
	// 用户列表
	GetUsers: (params: any) => {
		return fetchGet('/users/getUsers', params);
	},
	// 查询单位和协会
	GetAudits: (params: any) => {
		return fetchGet('/audits/getAudits', params);
	},
	// 审核列表 
	AuditUser: (params: any) => {
		return fetchPost('/audits/auditUser', params);
	},
	// 新增用户
	CreateUser: (params: any) => {
		return fetchPost('/users/createUser', params);
	},
	// 批量上传用户
	UploadUsers: (params: any) => {
		return uploadFile('/users/uploadUsers', params);
	},
	// 审核用户
	BatchApprove: (userIds: number[]) => fetchPost('/audits/batchApprove', { userIds }),
	// 场馆动态列表
	GetPosts: (params: any) => {
		return fetchGet('/venuePosts/getPosts', params);
	},
	// 添加场馆动态
	CreatePost: (params: any) => {
		return fetchPost('/venuePosts/createPost', params);
	},
	// 更新动态列表
	UpdatePost: (params: any) => {
		return fetchPost('/venuePosts/updatePost', params);
	},
	// 删除动态列表
	DeletePost: (params: any) => {
		return fetchPost('/venuePosts/deletePost', params);
	},
	/**
	 * 四、场馆预约相关接口
	 */
	// 获取以及条件查询场馆预约配置
	queryReservationInfo: (params: any) => {
		return fetchPost('/reservationManagement/query', params);
	},
	// 获取预约详情
	queryReservationDetails: (params: any) => {
		return fetchPost('/reservationManagement/queryDetails', params);
	},
	// 创建场馆预约配置
	createReservationInfo: (params: any) => {
		return fetchPost('/reservationManagement/create', params);
	},
	// 更新场馆预约配置
	updateReservationInfo: (params: any) => {
		return fetchPost('/reservationManagement/update', params);
	},
	// 删除场馆预约配置
	deleteReservationInfo: (params: any) => {
		return fetchPost('/reservationManagement/delete', params);
	},
	// 导出今日预约名单
	handleExport: (params: any) => {
		return fetchGet('/reservationManagement/export', params);
	},
	/**
 * 账号管理相关接口
 */
	// 获取信息
	GetAllAccount: (params: any) => {
		return fetchGet('/account/getAll', params);
	},
	CreateAccount: (params: any) => {
		return fetchPost('/account/create', params);
	},
	UpdateAccount: (params: any) => {
		return fetchPost('/account/update', params);
	},
	DeleteAccount: (params: any) => {
		return fetchPost('/account/delete', params);
	},
	GetMenus: (params: any) => {
		return fetchPost('/account/getMenus', params);
	},
	/**
	 * 角色管理相关接口
	 */
	GetAllRole: (params: any) => {
		return fetchGet('/role/getAll', params);
	},
	CreateRole: (params: any) => {
		return fetchPost('/role/create', params);
	},
	UpdateRole: (params: any) => {
		return fetchPost('/role/update', params);
	},
	DeleteRole: (params: any) => {
		return fetchPost('/role/delete', params);
	},

};

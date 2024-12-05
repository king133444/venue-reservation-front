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
	// 新增用户
	CreateUser: (params: any) => {
		return fetchPost('/users/createUser', params);
	},
	// 批量上传用户
	UploadUsers: (params: any) => {
		return uploadFile('/users/uploadUsers', params);
	},
	/**
	 * 三、场馆动态相关接口
	 */
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
	// 获取场馆预约配置
	getReservationInfo: (params: any) => {
		return fetchGet('/reservationManagement/getReservationInfo', params);
	},
};

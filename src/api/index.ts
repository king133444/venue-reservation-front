import {
	fetchDelete,
	fetchGet,
	fetchPost,
	fetchPut,
	uploadFile
} from '@/components/ReqInstance/axios';

export default {
	/**
	 * 认证授权相关接口
	 */
	// 登录
	Login: (params: any) => {
		return fetchPost('/auth/login', params);
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
	 * 用户相关接口
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
	// 获取用户统计
	GetUserStatistics: (params: any) => {
		return fetchGet('/users/userStatistics', params);
	},
	// 游客列表
	GetTourists: (params: any) => {
		return fetchGet('/users/tourists', params);
	},
	// 批量删除用户
	RemoveUsers: (params: any) => {
		return fetchPost('/users/removeUsers', params);
	},
	// 批量删除角色
	RemoveRoles: (params: any) => {
		return uploadFile('/role/deleteRole', params);
	},
	// 获取角色列表
	GetRoles: (params: any) => {
		return fetchPost('/users/roles', params);
	},
	// 获取设备供应商
	GetEquipmentSuppliers: (params: any) => {
		return fetchGet('/users/equipmentSuppliers', params);
	},
	// 批量创建用户
	CreateUsers: (params: any) => {
		return fetchPost('/auth/createBatchUser', params);
	},
	// 充值
	Recharge: (params: any) => {
		return fetchPost('/users/reCharge', params);
	},
	// 获取评论
	GetComments: (params: any) => {
		return fetchGet('/comment/comments', params);
	},
	// 创建评论
	CreateComment: (params: any) => {
		return fetchPost('/comment/createComment', params);
	},
	// 获取评论
	DeleteComments: (params: any) => {
		return fetchGet('/comment/deleteComment', params);
	},
	/**
	 * 娱乐项目相关接口
	 */
	// 获取娱乐项目信息
	GetAllAttractions: (params: any) => {
		return fetchPost('/attraction/attractions', params);
	},
	// 创建娱乐项目
	CreateAttractions: (params: any) => {
		return fetchPost('/attraction/createAttraction', params);
	},
	// 修改娱乐项目信息
	UpdateAttraction: (params: any) => {
		return fetchPost('/attraction/updateAttraction', params);
	},
	// 删除娱乐项目信息
	DeleteAttraction: (params: any) => {
		return fetchPost('/attraction/deleteAttraction', params);
	},
	/**
	 * 设施相关接口
	 */
	// 获取全部设施
	GetAllEquipments: (params: any) => {
		return fetchPost('/equipment/equipments', params);
	},
	// 获取设施统计
	GetEquipmentsStatistics: (params: any) => {
		return fetchGet('/equipment/equipmentsStatistics', params);
	},
	// 创建设施信息
	CreateEquipments: (params: any) => {
		return fetchPost('/equipment/createEquipment', params);
	},
	// 修改设施信息
	UpdateEquipments: (params: any) => {
		return fetchPost('/equipment/updateEquipments', params);
	},
	// 删除设施信息
	DeleteEquipments: (params: any) => {
		return fetchPost('/equipment/deleteEquipments', params);
	},
	// 申请维修
	CreateEquipmentFaultReport: (params: any) => {
		return fetchPost('/equipment/createEquipmentFaultReport', params);
	},
	// 获取全部设备报修信息
	GetAllEquipmentFaultReports: (params: any) => {
		return fetchPost('/equipment/equipmentFaultReports', params);
	},
	// 获取全部设备维修记录
	GetAllEquipmentRepairRecords: (params: any) => {
		return fetchPost('/equipment/equipmentRepairRecords', params);
	},
	// 获取全部设备购买信息
	GetAllEquipmentPurchase: (params: any) => {
		return fetchPost('/equipment/equipmentPurchasePlan', params);
	},
	// 批准或拒绝报修设备审批
	ApproveEquipmentFaultReports: (params: any) => {
		return fetchPost('/equipment/approveEquipmentFaultReport', params);
	},
	// 批准或拒绝报修设备审批
	ApproveEquipmentPurchase: (params: any) => {
		return fetchPost('/equipment/approveEquipmentPurchasePlan', params);
	},
	// 删除设施信息
	DeleteEquipmentFaultReports: (params: any) => {
		return fetchPost('/equipment/deleteEquipmentFaultReport', params);
	},
	// 创建设备维修记录表
	CreateEquipmentRepairRecord: (params: any) => {
		return fetchPost('/equipment/createEquipmentRepairRecord', params);
	},
	// 创建设备维修记录表
	CreateEquipmentPurchasePlan: (params: any) => {
		return fetchPost('/equipment/createEquipmentPurchasePlan', params);
	},
	/**
	 * 门票相关接口
	 */
	// 获取所有门票
	GetAllTickets: (params: any) => {
		return fetchPost('/ticket/tickets', params);
	},
	// 创建门票信息
	CreateTicket: (params: any) => {
		return fetchPost('/ticket/createTicket', params);
	},
	// 购买门票
	BuyTickets: (params: any) => {
		return fetchPost('/ticket/buyTickets', params);
	},
	// 退票
	refundTickets: (params: any) => {
		return fetchPost('/ticket/refundTickets', params);
	}
};

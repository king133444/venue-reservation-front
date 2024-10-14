import './index.less';

import { DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import { RedoOutlined } from '@ant-design/icons';
import {
	Button, Form, Input, Layout, message,
	Modal, Space, Switch, Table, Upload
} from 'antd';
import { Content } from 'antd/es/layout/layout';
import axios from 'axios';
import { useEffect, useState } from 'react';

import api from '@/api';

const UserManagement = () => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [showAddModal, setShowAddModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [imagePreview, setImagePreview] = useState(''); // 用于显示图片预览
	const [, setImageBase64] = useState(''); // 用于存储处理后的Base64编码
	const [selectedUser, setSelectedUser] = useState<{
		id?: number;
		name?: string;
		idNumber?: string;
		phone?: string;
		image?: string;
		occupation?: string;
		is_electrical_employee?: number;
	} | null>(null);
	const [originalData, setOriginalData] = useState([]); // 添加一个状态来保存原始数据
	const [searchName, setSearchName] = useState('');

	useEffect(() => {
		fetchData();
	}, []);

	const [form] = Form.useForm();
	useEffect(() => {
		if (selectedUser) {
			form.setFieldsValue({
				...selectedUser,
				idNumber: selectedUser.idNumber,
				is_electrical_employee: selectedUser.is_electrical_employee === 1
			});
		}
	}, [selectedUser, form]);

	const fetchData = async () => {
		try {
			setLoading(true);
			const response: any = await api.GetUsers({});
			setOriginalData(response.data); // 保存原始数据
			setData(response.data);
		} catch (error) {
			message.error('获取数据错误');
		} finally {
			setLoading(false);
		}
	};

	const handleSearch = () => {
		if (!searchName.trim()) {
			setData(originalData); // 搜索框为空时显示所有数据
		} else {
			const filteredData = originalData.filter((item: any) =>
				item.name.toLowerCase().includes(searchName.toLowerCase())
			) as typeof originalData;
			setData(filteredData); // 更新数据为过滤后的数据
		}
	};

	const handleUpload = async (file: string | Blob) => {
		const formData = new FormData();
		formData.append('file', file);
		try {
			const response: any = await api.UploadUsers(formData);

			if (!response.success) {
				message.error(response.message);
				return;
			}
			message.success(response.message);
			fetchData();
		} catch (error) {
			let errorMessage = '批量上传失败';
			if (axios.isAxiosError(error) && error.response) {
				errorMessage = error.response.data.message || errorMessage;
			} else if (error instanceof Error) {
				errorMessage = error.message;
			}
			message.error(errorMessage);
		}
	};

	const showdDeleteConfirm = (record: any) => {
		Modal.confirm({
			title: '您确定要删除这个用户吗？',
			content: '删除后，您将无法恢复这个用户。',
			onOk() {
				handleDelete(record);
			}
		});
	};

	const handleDelete = async (record: { id: number }) => {
		try {
			const response: any = await api.DeleteUser({ id: record.id });
			message.success(response.message);
			fetchData();
		} catch (error) {
			message.error('删除用户失败');
		}
	};

	const handleBeforeUpload = (file: Blob) => {
		const reader = new FileReader();
		reader.onload = () => {
			if (typeof reader.result === 'string') {
				setImagePreview(reader.result); // 设置预览图片
				const base64Data = reader.result.split(',')[1]; // 移除"data:image/jpeg;base64,"前缀
				// 更新状态，存储处理后的Base64编码
				setImageBase64(base64Data);
				// 更新表单中的image字段
				form.setFieldsValue({ image: base64Data });
			}
		};
		reader.readAsDataURL(file);
		return false; // 阻止默认上传行为
	};

	const handleAddSubmit = async (values: any) => {
		try {
			const adjustedValues = {
				...values,
				is_electrical_employee: values.is_electrical_employee ? 1 : 0,
			};
			const response: any = await api.CreateUser(adjustedValues);

			// 检查后端响应的success字段
			if (!response.data.success) {
				message.error(response.data.message);
			} else {
				message.success(response.data.message);
				setShowAddModal(false);
				form.resetFields();
				fetchData();
			}
		} catch (error) {
			let errorMessage = '新增用户失败';
			if (axios.isAxiosError(error) && error.response) {
				errorMessage = error.response.data.message || errorMessage;
			}
			message.error(errorMessage);
		}
		setSelectedUser(null);
	};

	const handleEditSubmit = async (values: any) => {
		try {
			const adjustedValues = {
				...values,
				id: selectedUser?.id,
				is_electrical_employee: values.is_electrical_employee ? 1 : 0
			};
			const response: any = await api.UpdateUser(adjustedValues);
			message.success(response.message);
			setShowEditModal(false);
			setSelectedUser(null);
			fetchData();
		} catch (error) {
			let errorMessage = '更新用户失败';
			if (axios.isAxiosError(error)) {
				if (error.response) {
					errorMessage = error.response.data?.message || '请求失败，未能获取详细信息';
				} else {
					errorMessage = '请求失败，未收到响应';
				}
			} else if (error instanceof Error) {
				errorMessage = error.message;
			}
			message.error(errorMessage);
		}
	};

	// 点击新增用户按钮时调用
	const openAddModal = () => {
		// 重置表单字段
		form.resetFields();
		// 清除图片预览
		setImagePreview('');
		// 清除Base64图片数据
		setImageBase64('');
		// 显示新增用户模态框
		setShowAddModal(true);
	};

	const openEditModal = (record: any) => {
		setSelectedUser({
			...record,
			idNumber: record.id_number,
			is_electrical_employee: record.is_electrical_employee === 1,
			image: record.image
		});

		// 如果当前记录没有图片，清除图片预览
		if (!record.image) {
			setImagePreview(''); // 清除图片预览
		} else {
			// 如果有图片，设置图片预览为当前记录的图片
			setImagePreview(`data:image/jpeg;base64,${record.image}`);
		}

		setShowEditModal(true);
	};

	const columns = [
		{
			title: '序号',
			key: 'index',
			render: (_: undefined, __: any, index: number) =>
				1 + index,
		},
		{ title: '姓名', dataIndex: 'name', key: 'name' },
		{ title: '身份证号', dataIndex: 'id_number', key: 'idNumber' },
		{ title: '手机号', dataIndex: 'phone', key: 'phone' },
		{
			title: '人脸照片',
			dataIndex: 'image',
			key: 'image',
			render: (text: string | undefined) => {
				const imageUrl = text ? `data:image/jpeg;base64,${text}` : '';
				return imageUrl ?
					<img src={imageUrl}
						style={{ width: 50, height: 50 }} /> : <span>暂无照片</span>;
			}
		},
		{ title: '职位', dataIndex: 'occupation', key: 'occupation' },
		{
			title: '操作',
			key: 'action',
			render: (text: any, record: any) => (
				<span>
					<Button icon={<EditOutlined />} onClick={() => openEditModal(record)}>
						编辑
					</Button>
					<Button
						icon={<DeleteOutlined />}
						onClick={() => showdDeleteConfirm(record)} style={{ marginLeft: 8 }}>
						删除
					</Button>
				</span>
			)
		}
	];

	const uploadProps = {
		beforeUpload: (file: any) => {
			handleUpload(file);
			return false;
		},
		showUploadList: false // 不显示文件列表
	};

	const handleReset = () => {
		setSearchName(''); // 清空搜索框
		fetchData(); // 重新获取并显示所有用户数据
	};

	return (
		<>
			<Layout
				style={{
					marginTop: 20,
					borderRadius: '10px',
					backgroundColor: 'white',
					flexDirection: 'column',
					position: 'relative',
				}}
			>
				<Content>
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<Space wrap size={'middle'}>
							<Button onClick={openAddModal}>新增用户</Button>
							<Input
								placeholder="根据姓名搜索"
								value={searchName}
								onChange={(e) => setSearchName(e.target.value)}
								style={{ width: 200 }}
							/>
							<Button onClick={handleSearch}>搜索</Button>
							<Button onClick={handleReset}><RedoOutlined />重置</Button>
							<Upload {...uploadProps}>
								<Button icon={<UploadOutlined />}>文件批量上传</Button>
							</Upload>
						</Space>
					</div>
					<br />
					<div>
						<Table
							className='personalTable'
							dataSource={data}
							columns={columns}
							loading={loading}
							rowKey="id"
							pagination={{
								className: 'pagination',
								pageSize: 10,
								hideOnSinglePage: false,
								showTotal: (total) => `总共 ${total} 条`
							}}
						/>
					</div>
					<div style={{
					}}>
					</div>
				</Content>
			</Layout>

			<Modal
				title="新增用户"
				open={showAddModal}
				footer={null} onCancel={() => setShowAddModal(false)}>
				<Form form={form} onFinish={handleAddSubmit}>
					<Form.Item
						label="姓名" name="name" rules={[{ required: true, message: '请输入姓名' }]}>
						<Input />
					</Form.Item>
					<Form.Item
						label="身份证号"
						name="idNumber"
						rules={[{ required: true, message: '请输入身份证号' }]}>
						<Input />
					</Form.Item>
					<Form.Item
						label="手机号" name="phone" rules={[{ required: true, message: '请输入手机号' }]}>
						<Input />
					</Form.Item>
					<Form.Item label="人脸照片" name="image">
						<Upload
							showUploadList={false}
							beforeUpload={handleBeforeUpload}
							accept="image/*">
							<Button icon={<UploadOutlined />}>上传图片</Button>
						</Upload>
						{imagePreview && (
							<img
								src={imagePreview}
								alt="预览"
								style={{
									maxWidth: '100%', marginTop: 10, width: 100, height: 100
								}} />
						)}
					</Form.Item>
					<Form.Item
						label="职位"
						name="occupation"
						rules={[{ required: true, message: '请输入职位' }]}>
						<Input />
					</Form.Item>
					<Form.Item
						label="是否为电力员工"
						name="is_electrical_employee"
						valuePropName="checked"
						rules={[{ required: true, message: '请选择是否为电力员工' }]}
					>
						<Switch />
					</Form.Item>
					<Button type="primary" htmlType="submit">
						新增用户
					</Button>
				</Form>
			</Modal>

			<Modal
				title="编辑用户" open={showEditModal}
				footer={null} onCancel={() => setShowEditModal(false)}>
				{selectedUser && (
					<Form form={form} onFinish={handleEditSubmit}>
						<Form.Item
							label="姓名"
							name="name"
							rules={[{ required: true, message: '请输入姓名' }]}>
							<Input />
						</Form.Item>

						<Form.Item
							label="身份证号"
							name="idNumber"
							rules={[{ required: true, message: '请输入身份证号' }]}>
							<Input />
						</Form.Item>
						<Form.Item
							label="手机号"
							name="phone"
							rules={[{ required: true, message: '请输入手机号' }]}>
							<Input />
						</Form.Item>
						<Form.Item label="人脸照片" name="image">
							{selectedUser?.image ? (
								<div>
									<img
										src={`data:image/jpeg;base64,${selectedUser.image}`}
										style={{ width: 100, height: 100, marginBottom: 10 }}
									/>
									<Upload
										showUploadList={false}
										beforeUpload={file => {
											handleBeforeUpload(file);
											return false; // 阻止自动上传
										}}
										accept="image/*"
									>
										<Button icon={<UploadOutlined />}>更改图片</Button>
									</Upload>
								</div>
							) : (
								// 当没有图片时，显示上传按钮
								<Upload
									showUploadList={false}
									beforeUpload={file => {
										handleBeforeUpload(file);
										return false; // 阻止自动上传
									}}
									accept="image/*"
								>
									<Button icon={<UploadOutlined />}>上传图片</Button>
								</Upload>
							)}
							{/* 如果有图片预览，则显示图片预览 */}
							{imagePreview && !selectedUser?.image && (
								<img
									src={imagePreview}
									alt="预览"
									style={{
										maxWidth: '100%',
										marginTop: 10,
										width: 100,
										height: 100
									}} />
							)}
						</Form.Item>
						<Form.Item
							label="职位"
							name="occupation"
							rules={[{ required: true, message: '请输入职位' }]}>
							<Input />
						</Form.Item>
						<Form.Item
							label="是否为电力员工"
							name="is_electrical_employee"
							valuePropName="checked"
							rules={[{ required: true, message: '请选择是否为电力员工' }]}
						>
							<Switch />
						</Form.Item>
						<Button type="primary" htmlType="submit">
							提交
						</Button>
					</Form>
				)}
			</Modal>
		</>
	);
};

export default UserManagement;

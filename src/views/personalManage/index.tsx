import './index.less';

import { DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import { RedoOutlined } from '@ant-design/icons';
import {
	Button, Form, Input, Layout, message,
	Modal, Select, Switch, Table, Upload
} from 'antd';
import { Content } from 'antd/es/layout/layout';
import axios from 'axios';
import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

import api from '@/api';
const { Option } = Select;

const UserManagement = () => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [showAddModal, setShowAddModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [imagePreview, setImagePreview] = useState('');
	const [, setImageBase64] = useState('');
	const [selectedUser, setSelectedUser] = useState<{
		id?: number;
		name?: string;
		id_number?: string;
		phone?: string;
		image?: string;
		organization?: String;
		association?: String;
		is_outsider?: Boolean;
		is_car_coming?: Boolean;
		status?: Boolean;
		license_plate_number?: String; // 确保这是一个字符串或者null
		remark?: String; // 确保这是一个字符串或者null
		audit_status?: String;
		notification?: String;
		openId?: string;
	} | null>(null);
	const [originalData, setOriginalData] = useState([]);
	// const [searchName, setSearchName] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const rowHeight = 90;
	const totalPages = Math.ceil(data.length / 10);
	const isLastPage = currentPage === totalPages;
	const dataOnLastPage = data.length % 10 || 10;
	const actualDataCount = isLastPage ? dataOnLastPage : 10;
	const [organizations] = useState([]); // 新增状态
	const [associations] = useState(['篮协', '羽协']); // 新增状态

	// 计算需要补充的高度
	const fillHeight = isLastPage ? (10 - actualDataCount) * rowHeight : 0;

	useEffect(() => {
		fetchData();
	}, [organizations, associations]);

	const [form] = Form.useForm();
	useEffect(() => {
		if (selectedUser) {
			form.setFieldsValue({
				...selectedUser,
				id_number: selectedUser.id_number,
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

	const fetchFilteredUsers = async (organization: any, association: any) => {
		try {
			// 构建查询参数
			const params = { organization, association };

			// 发送 GET 请求，并将参数附加到 URL 上
			const response = await axios.get('http://127.0.0.1:8001/users/getUsers', { params });

			return response.data;
		} catch (error) {
			message.error('获取筛选后的用户列表失败');
		}
	};

	const handleSearch = async (values: any) => {
		const { organization, association } = values;
		const filteredData = await fetchFilteredUsers(organization, association);
		setData(filteredData.data);
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
			let errorMessage = '导入失败';
			if (axios.isAxiosError(error) && error.response) {
				errorMessage = error.response.data.message || errorMessage;
			} else if (error instanceof Error) {
				errorMessage = error.message;
			}
			message.error(errorMessage);
		}
	};

	// 导出用户名单
	const exportToExcel = () => {
		// 首先，我们需要确保数据是按照分页排序的，并且有一个连续的序号
		const sortedData: any = data.slice(); // 复制数据以避免修改原始数据

		// 为每一行数据添加序号，并去掉 id 列
		const 序号数据 = sortedData.map((item: any, index: number) => ({
			序号: index + 1, // 序号从1开始
			姓名: item.name,
			单位: item.organization,
			协会: item.association,
			身份证号: item.id_number,
			手机号: item.phone,
			人脸照片: item.image,
			是否有车: item.is_car_coming ? '是' : '否',
			车牌号: item.license_plate_number ? '是' : '否',
			车牌照片: item.license_plate_picture,
			状态: item.status ? '正常' : '请假', // 假设状态为布尔值，转换为中文
			审核状态: item.audit_status,
			通知: item.notification,
			创建时间: item.create_time,
			更新时间: item.update_time,
			openId: item.openId
		}));

		// 定义中文列标题
		const headers = [
			'序号',
			'姓名',
			'单位',
			'协会',
			'身份证号',
			'手机号',
			'人脸照片',
			'是否有车',
			'车牌号',
			'车牌照片',
			'状态',
			'审核状态',
			'通知',
			'创建时间',
			'更新时间',
			'openId'
		];

		// 使用序号数据和中文列标题创建工作表
		const worksheet = XLSX.utils.json_to_sheet(序号数据, { header: headers });
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, '用户名单');
		XLSX.writeFile(workbook, '用户名单.xlsx');
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
			if (!response.success) {
				message.error(response.message);
				return;
			}
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
				setImagePreview(reader.result);
				const base64Data = reader.result.split(',')[1];
				setImageBase64(base64Data);
				form.setFieldsValue({ image: base64Data });
			}
		};
		reader.readAsDataURL(file);
		return false;
	};

	// 用于前后端连接的新增操作
	const handleAddSubmit = async (values: any) => {
		// values通常包含了表单中的输入数据
		try {
			// 创建一个新对象adjustedValues，它是values的一个浅拷贝，这里可以添加或者修改要发送到后端的数据
			const adjustedValues = {
				...values,
				name: values.name,
				phone: values.phone,
				image: values.image,
				organization: values.organization,
				association: values.association,
				id: selectedUser?.id,
				is_outsider: values.is_outsider ? true : false,
				is_car_coming: values.is_car_coming ? true : false,
				status: values.status ? true : false,
				id_number: values.id_number, // 确保这里使用的是 id_number
				license_plate_number: values.license_plate_number || null, // 确保这是一个字符串或者null
				remark: values.remark || null, // 确保这是一个字符串或者null
				audit_status: values.audit_status,
				notification: values.notification || null,
				openId: values.openId || null
			};

			//  定义了一个变量 response，类型为 any。这行代码调用了一个名为 api.CreateUser 的函数
			// （可能是通过 axios 发送 HTTP POST 请求的封装函数），并传递了 adjustedValues 作为参数。
			// await 关键字用于等待这个异步操作完成，并获取响应。
			const response: any = await api.CreateUser(adjustedValues);

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
		// 调用 setSelectedUser 函数，这可能是一个用于清除当前选中用户状态的函数。
		setSelectedUser(null);
	};

	// 关于修改的前后端连接函数
	const handleEditSubmit = async (values: any) => {
		try {
			const adjustedValues = {
				...values,
				name: values.name,
				phone: values.phone,
				image: values.image,
				organization: values.organization,
				association: values.association,
				id: selectedUser?.id,
				is_outsider: values.is_outsider ? true : false,
				is_car_coming: values.is_car_coming ? true : false,
				status: values.status ? true : false,
				id_number: values.id_number, // 确保这里使用的是 id_number
				license_plate_number: values.license_plate_number || null, // 确保这是一个字符串或者null
				remark: values.remark || null, // 确保这是一个字符串或者null
				audit_status: values.audit_status,
				notification: values.notification || null,
				openId: values.openId || null
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

	const openAddModal = () => {
		form.resetFields();
		setImagePreview('');
		setImageBase64('');
		setShowAddModal(true);
	};

	const openEditModal = (record: any) => {
		setSelectedUser({
			...record,
			id_number: record.id_number,
			is_car_coming: record.is_car_coming === true,
			license_plate_number: record.license_plate_number === true,
			status: record.status === true,
			image: record.image,
			license_plate_picture: record.license_plate_picture
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
		{ title: '单位', dataIndex: 'organization', key: 'organization' },
		{ title: '协会', dataIndex: 'association', key: 'association' },
		{ title: '身份证号', dataIndex: 'id_number', key: 'id_number' },
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
		{
			title: '是否有车进入',
			dataIndex: 'is_car_coming',
			key: 'is_car_coming',
			render: (text: string) => (text ? '是' : '否'),
		},
		// { title: '车牌号', dataIndex: 'license_plate_number', key: 'license_plate_number' },
		{
			title: '车牌号',
			dataIndex: 'license_plate_number',
			key: 'license_plate_number',
			render: (text: string) => (text ? '是' : '否'),
		},
		{
			title: '车牌照片',
			dataIndex: 'license_plate_picture',
			key: 'license_plate_picture',
			render: (text: string | undefined) => {
				const imageUrl = text ? `data:image/jpeg;base64,${text}` : '';
				return imageUrl ?
					<img src={imageUrl}
						style={{ width: 50, height: 50 }} /> : <span>暂无照片</span>;
			}
		},
		{
			title: '状态',
			dataIndex: 'status',
			key: 'status',
			render: (text: boolean) => (text ? '正常' : '请假'),
		},
		{
			title: '操作',
			key: 'action',
			render: (text: any, record: any) => (
				<span>
					<Button
						icon={<EditOutlined />}
						onClick={() => openEditModal(record)}>
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
		showUploadList: false
	};

	const handleReset = () => {
		fetchData();
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
				<Content style={{ position: 'relative' }}>

					<div style={{
						marginBottom: '20px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center', // 水平居中对齐
					}}>
						<Form form={form} layout="inline" onFinish={handleSearch}>
							<Form.Item label="单位" name="organization">
								<Select placeholder="请选择单位" allowClear>
									{originalData.map((org: any) => (
										<Option key={org} value={org.organization}>
											{org.organization}</Option>
									))}
								</Select>
							</Form.Item>
							<Form.Item label="协会" name="association">
								<Select placeholder="请选择协会" allowClear>
									{associations.map(ass => (
										<Option key={ass} value={ass}>{ass}</Option>
									))}
								</Select>
							</Form.Item>
							<Form.Item>
								<Button type="primary" htmlType="submit" onClick={handleSearch}>
									查询
								</Button>
							</Form.Item>
							<Button onClick={handleReset} style={{ marginLeft: 8 }}>
								<RedoOutlined /> 重置
							</Button>
						</Form>
					</div>
					<div style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						marginBottom: '20px' // 添加下边距以分隔按钮组和下方内容
					}}>
						<Button
							onClick={openAddModal}
							className="custom-add-button"
						>新增用户</Button>
						<div style={{ display: 'flex', alignItems: 'center' }}>
							<Upload {...uploadProps}>
								<Button icon={<UploadOutlined />} className="custom-add-button">
									导入用户
								</Button>
							</Upload>
							<Button
								onClick={exportToExcel}
								className="custom-add-button"
								style={{ marginLeft: '8px' }}>
								导出人员名单
							</Button>
						</div>
					</div>

					<br />
					<div>
						<Table
							className='personalTable'
							dataSource={data}
							columns={columns}
							loading={loading}
							rowKey="id"
							style={{
								display: 'flex',
								flexDirection: 'column',
								flexGrow: 1,
								overflow: 'hidden'
							}}
							pagination={{
								className: 'pagination',
								pageSize: 10,
								hideOnSinglePage: false,
								onChange: (page) => {
									setCurrentPage(page);
								},
								showTotal: (total) => `总共 ${total} 条`
							}}
							footer={() => (
								<div style={{ height: fillHeight + 'px' }}></div>
							)}
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
						label="单位" name="organization"
						rules={[{ required: true, message: '请输入单位' }]}>
						<Input />
					</Form.Item>
					<Form.Item
						label="协会"
						name="association"
						rules={[{ required: true, message: '请输入协会' }]}
					>
						<Select placeholder="请选择协会" allowClear>
							<Option value="篮协">篮协</Option>
							<Option value="羽协">羽协</Option>
						</Select>
					</Form.Item>
					<Form.Item
						label="身份证号"
						name="id_number"
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
						label="是否有车进入"
						name="is_car_coming"
						valuePropName="checked"
						rules={[{ required: false, message: '是否有车进入' }]}
					>
						<Switch />
					</Form.Item>
					{/* <Form.Item
                        label="车牌号"
                        name="license_plate_number"
                        valuePropName="checked"
                        rules={[{ required: false, message: '是否有车牌号' }]}
                    >
                        <Switch />
                    </Form.Item> */}
					<Form.Item
						label="车牌号"
						name="license_plate_number"
						rules={[{ required: true, message: '请填写是或者否' }]}>
						<Input />
					</Form.Item>
					<Form.Item label="车牌照片" name="license_plate_picture">
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
					{/* <Form.Item
                        label="职位"
                        name="occupation"
                        rules={[{ required: true, message: '请输入职位' }]}>
                        <Input />
                    </Form.Item> */}
					{/* <Form.Item
                        label="是否为电力员工"
                        name="is_electrical_employee"
                        valuePropName="checked"
                        rules={[{ required: true, message: '请选择是否为电力员工' }]}
                    >
                        <Switch />
                    </Form.Item> */}
					<Form.Item
						label="是否请假"
						name="status"
						valuePropName="checked"
						rules={[{ required: false, message: '请选择状态' }]}
					>
						<Switch />
					</Form.Item>
					<Form.Item
						label="审核状态" name="audit_status"
						rules={[{ required: true, message: '请输入审核状态' }]}>
						<Input />
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
							label="单位" name="organization"
							rules={[{ required: true, message: '请输入单位' }]}>
							<Input />
						</Form.Item>
						<Form.Item
							label="协会"
							name="association"
							rules={[{ required: true, message: '请输入协会' }]}
						>
							<Select placeholder="请选择协会" allowClear>
								<Option value="篮协">篮协</Option>
								<Option value="羽协">羽协</Option>
							</Select>
						</Form.Item>
						<Form.Item
							label="身份证号"
							name="id_number"
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
										return false;
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
							label="是否有车进入"
							name="is_car_coming"
							valuePropName="checked"
							rules={[{ required: false, message: '是否有车进入' }]}
						>
							<Switch />
						</Form.Item>
						<Form.Item
							label="车牌号"
							name="license_plate_number"
							valuePropName="checked"
							rules={[{ required: false, message: '是否有车牌号' }]}
						>
							<Switch />
						</Form.Item>
						<Form.Item label="车牌照片" name="license_plate_picture">
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
										return false;
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
						{/* <Form.Item
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
                        </Form.Item> */}
						<Form.Item
							label="是否请假"
							name="status"
							valuePropName="checked"
							rules={[{ required: false, message: '请选择状态' }]}
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

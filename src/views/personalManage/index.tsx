import { useState, useEffect } from "react";
import { Table, Button, Upload, message, Modal, Form, Input, Switch } from "antd";
import { UploadOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import api from "@/api";
import axios, { AxiosResponse } from "axios";

const UserManagement = () => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [showAddModal, setShowAddModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [selectedUser, setSelectedUser] = useState<{
		id?: number;
		name?: string;
		idNumber?: string;
		phone?: string;
		image?: string;
		occupation?: string;
		is_electrical_employee?: number;
	} | null>(null);
	const [currentPage, setCurrentPage] = useState(1);

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
			setData(response.data);
		} catch (error) {
			console.error("获取数据错误:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleUpload = async (file: any) => {
		const reader = new FileReader();
		reader.onload = async () => {
			const base64Image = reader.result?.toString().split(",")[1];
			try {
				const response = (await api.UploadUsers(base64Image)) as AxiosResponse;
				message.success(response.data.message);
				fetchData();
			} catch (error) {
				message.error("批量上传失败");
				console.error("上传文件错误:", error);
			}
		};
		reader.readAsDataURL(file);
	};

	const handleDelete = async (record: { id: number }) => {
		try {
			const response = (await api.DeleteUser({ id: record.id })) as AxiosResponse;
			message.success(response.data.message);
			fetchData();
		} catch (error) {
			message.error("删除用户失败");
			console.error("删除用户错误:", error);
		}
	};

	const handleAddSubmit = async (values: any) => {
		try {
			const adjustedValues = {
				...values,
				is_electrical_employee: values.is_electrical_employee ? 1 : 0
			};
			const response = (await api.CreateUser(adjustedValues)) as AxiosResponse;
			message.success(response.data.message);
			setShowAddModal(false);
			form.resetFields();
			fetchData();
		} catch (error) {
			message.error("新增用户失败");
			console.error("新增用户错误:", error);
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
			const response = (await api.UpdateUser(adjustedValues)) as AxiosResponse;
			message.success(response.data.message || "用户更新成功");
			setShowEditModal(false);
			setSelectedUser(null);
			fetchData();
		} catch (error) {
			let errorMessage = "更新用户失败";
			if (axios.isAxiosError(error)) {
				if (error.response) {
					console.error("Axios Error Response:", error.response);
					errorMessage = error.response.data?.message || "请求失败，未能获取详细信息";
				} else {
					console.error("Axios Error No Response:", error);
					errorMessage = "请求失败，未收到响应";
				}
			} else if (error instanceof Error) {
				errorMessage = error.message;
			}
			message.error(errorMessage);
			console.error("更新用户错误:", error);
		}
	};

	const openEditModal = (record: any) => {
		setSelectedUser({
			...record,
			idNumber: record.id_number,
			is_electrical_employee: record.is_electrical_employee === 1,
			image: record.image // Ensure this is Base64 string
		});
		setShowEditModal(true);
	};

	const columns = [
		{
			title: "序号",
			key: "index",
			render: (text: any, record: any, index: number) => {
				const pageIndex = (currentPage - 1) * 10 + index + 1;
				return `${pageIndex}`;
			}
		},
		{ title: "姓名", dataIndex: "name", key: "name" },
		{ title: "身份证号", dataIndex: "id_number", key: "idNumber" },
		{ title: "手机号", dataIndex: "phone", key: "phone" },
		{
			title: "人脸照片",
			dataIndex: "image",
			key: "image",
			render: (text: string | undefined) => {
				const imageUrl = text ? `data:image/jpeg;base64,${text}` : "";
				return imageUrl ? <img src={imageUrl} style={{ width: 50, height: 50 }} /> : <span>暂无照片</span>;
			}
		},
		{ title: "职位", dataIndex: "occupation", key: "occupation" },
		{
			title: "操作",
			key: "action",
			render: (text: any, record: any) => (
				<span>
					<Button icon={<EditOutlined />} onClick={() => openEditModal(record)}>
						编辑
					</Button>
					<Button icon={<DeleteOutlined />} onClick={() => handleDelete(record)} style={{ marginLeft: 8 }}>
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
		}
	};

	return (
		<div>
			<div style={{ display: "flex", justifyContent: "space-between" }}>
				<Button onClick={() => setShowAddModal(true)}>新增用户</Button>
				<Upload {...uploadProps}>
					<Button icon={<UploadOutlined />}>文件批量上传</Button>
				</Upload>
			</div>
			<br />
			<Table
				dataSource={data}
				columns={columns}
				loading={loading}
				pagination={{
					pageSize: 10,
					onChange: page => setCurrentPage(page)
				}}
				rowKey="id"
			/>

			<Modal title="新增用户" open={showAddModal} footer={null} onCancel={() => setShowAddModal(false)}>
				<Form form={form} onFinish={handleAddSubmit}>
					<Form.Item label="姓名" name="name" rules={[{ required: true, message: "请输入姓名" }]}>
						<Input />
					</Form.Item>
					<Form.Item label="身份证号" name="idNumber" rules={[{ required: true, message: "请输入身份证号" }]}>
						<Input />
					</Form.Item>
					<Form.Item label="手机号" name="phone" rules={[{ required: true, message: "请输入手机号" }]}>
						<Input />
					</Form.Item>
					<Form.Item label="人脸照片" name="image">
						<Upload
							showUploadList={false}
							beforeUpload={file => {
								handleAddSubmit(file);
								return false;
							}}
							accept="image/*"
						>
							<Button icon={<UploadOutlined />}>上传图片</Button>
						</Upload>
					</Form.Item>
					<Form.Item label="职位" name="occupation" rules={[{ required: true, message: "请输入职位" }]}>
						<Input />
					</Form.Item>
					<Form.Item
						label="是否为电力员工"
						name="is_electrical_employee"
						valuePropName="checked"
						rules={[{ required: true, message: "请选择是否为电力员工" }]}
					>
						<Switch />
					</Form.Item>
					<Button type="primary" htmlType="submit">
						新增用户
					</Button>
				</Form>
			</Modal>

			<Modal title="编辑用户" open={showEditModal} footer={null} onCancel={() => setShowEditModal(false)}>
				{selectedUser && (
					<Form form={form} onFinish={handleEditSubmit}>
						<Form.Item label="姓名" name="name" rules={[{ required: true, message: "请输入姓名" }]}>
							<Input />
						</Form.Item>

						<Form.Item label="身份证号" name="idNumber" rules={[{ required: true, message: "请输入身份证号" }]}>
							<Input />
						</Form.Item>
						<Form.Item label="手机号" name="phone" rules={[{ required: true, message: "请输入手机号" }]}>
							<Input />
						</Form.Item>
						<Form.Item label="人脸照片" name="image">
							{selectedUser?.image ? (
								<div>
									<img src={`data:image/jpeg;base64,${selectedUser.image}`} style={{ width: 100, height: 100 }} />
									<Upload
										showUploadList={false}
										beforeUpload={file => {
											handleUpload(file);
											return false;
										}}
										accept="image/*"
									>
										<Button icon={<UploadOutlined />}>更改图片</Button>
									</Upload>
								</div>
							) : (
								<Upload
									showUploadList={false}
									beforeUpload={file => {
										handleEditSubmit(file);
										return false;
									}}
									accept="image/*"
								>
									<Button icon={<UploadOutlined />}>上传图片</Button>
								</Upload>
							)}
						</Form.Item>
						<Form.Item label="职位" name="occupation" rules={[{ required: true, message: "请输入职位" }]}>
							<Input />
						</Form.Item>
						<Form.Item
							label="是否为电力员工"
							name="is_electrical_employee"
							valuePropName="checked"
							rules={[{ required: true, message: "请选择是否为电力员工" }]}
						>
							<Switch />
						</Form.Item>
						<Button type="primary" htmlType="submit">
							提交
						</Button>
					</Form>
				)}
			</Modal>
		</div>
	);
};

export default UserManagement;

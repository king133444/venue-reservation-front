import React, { useState, useEffect } from "react";
import { Table, Button, Upload, message, Modal, Form, Input } from "antd";
import { UploadOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import api from "@/api";
import  { AxiosResponse } from "axios";

const UserManagement = () => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [showAddModal, setShowAddModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [selectedUser, setSelectedUser] = useState<{ id: any, name: string, id_number: string, phone: string, image: string, occupation: string }>();

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		try {
			setLoading(true);
			// const response = await api.GetUsers({}) as AxiosResponse;
			// const response = await axios.get("http://localhost:8001/users/getUsers");
			const response: any = await api.GetUsers({});
			console.log(response.data);
			console.log(data);
			
			setData(response.data);
		} catch (error) {
			console.error("Error fetching data:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleUpload = async (file: string | Blob) => {
		try {
			const response = await api.UploadUsers(file) as AxiosResponse;
			message.success(response.data.message);
			fetchData();
		} catch (error) {
			message.error("批量上传失败");
			console.error("Error uploading file:", error);
		}
	};

	const handleDelete = async (record: { id: any }) => {
		try {
			const response = await api.DeleteUser(record.id) as AxiosResponse;
			message.success(response.data.message);
			fetchData();
		} catch (error) {
			message.error("删除用户失败");
			console.error("Error deleting user:", error);
		}
	};

	const handleAddSubmit = async (values: any) => {
		try {
			const response = await api.CreateUser(values) as AxiosResponse;
			message.success(response.data.message);
			setShowAddModal(false);
			fetchData();
		} catch (error) {
			message.error("新增用户失败");
			console.error("Error adding user:", error);
		}
	};

	const handleEditSubmit = async (values: any) => {
		try {
			const response = await api.UpdateMyUser(values) as AxiosResponse;
			message.success(response.data.message);
			setShowEditModal(false);
			fetchData();
		} catch (error) {
			message.error("编辑用户失败");
			console.error("Error editing user:", error);
		}
	};

	const openEditModal = (record: any) => {
		setSelectedUser(record);
		setShowEditModal(true);
	};

	const columns = [
		{ title: "姓名", dataIndex: "name", key: "name" },
		{ title: "身份证号", dataIndex: "id_number", key: "idNumber" },
		{ title: "手机号", dataIndex: "phone", key: "phone" },
		{
			title: "人脸照片",
			dataIndex: "image",
			key: "image",
			render: (text: string | undefined) => <img src={`images/${text}`} alt="人脸照片" style={{ width: 50, height: 50 }} />,
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
			),
		},
	];

	const uploadProps = {
		beforeUpload: (file: any) => {
			handleUpload(file);
			return false;
		},
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
			<Table dataSource={data} columns={columns} loading={loading} pagination={{ pageSize: 10 }} rowKey="id" />

			<Modal
				title="新增用户"
				open={showAddModal}
				footer={null}
				onCancel={() => setShowAddModal(false)} // 添加取消按钮的点击事件处理函数
			>
				<Form onFinish={handleAddSubmit}>
					<Form.Item
						label="姓名"
						name="name"
						rules={[{ required: true, message: '请输入姓名' }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						label="身份证号"
						name="id_number"
						rules={[{ required: true, message: '请输入身份证号' }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						label="手机号"
						name="phone"
						rules={[{ required: true, message: '请输入手机号' }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						label="人脸照片"
						name="image"
						rules={[{ required: true, message: '请上传人脸照片' }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						label="职位"
						name="occupation"
						rules={[{ required: true, message: '请输入职位' }]}
					>
						<Input />
					</Form.Item>
					<Button type="primary" htmlType="submit">提交</Button>
				</Form>
			</Modal>

			<Modal
				title="编辑用户"
				open={showEditModal}
				footer={null}
				onCancel={() => setShowEditModal(false)}
			>
				<Form
					onFinish={handleEditSubmit}
					initialValues={selectedUser}
				>
					<Form.Item
						label="姓名"
						name="name"
						rules={[{ required: true, message: '请输入姓名' }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						label="身份证号"
						name="id_number"
						rules={[{ required: true, message: '请输入身份证号' }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						label="手机号"
						name="phone"
						rules={[{ required: true, message: '请输入手机号' }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						label="人脸照片"
						name="image"
						rules={[{ required: true, message: '请上传人脸照片' }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						label="职位"
						name="occupation"
						rules={[{ required: true, message: '请输入职位' }]}
					>
						<Input />
					</Form.Item>
					<Button type="primary" htmlType="submit">提交</Button>
				</Form>
			</Modal>

		</div>
	);
};

export default UserManagement;

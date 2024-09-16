import { UploadOutlined } from '@ant-design/icons';
import { Button, Card, DatePicker, Form, Input, Layout, List, message, Modal, Upload } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

import api from '@/api'; // 确保这里的路径正确指向您的API函数

const { Content } = Layout;

interface Dynamic {
	id: number;
	title: string;
	content: string;
	publish_date: Date;
	image: string | null;
}

const VenueDynamics = () => {
	const [dynamics, setDynamics] = useState<Dynamic[]>([]);
	const [loading, setLoading] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [selectedDynamic, setSelectedDynamic] = useState<Dynamic | null>(null);
	const [isEditMode, setIsEditMode] = useState(false);
	const [imagePreview, setImagePreview] = useState('');
	const [form] = Form.useForm();

	useEffect(() => {
		fetchDynamics();
	}, []);

	const fetchDynamics = async () => {
		setLoading(true);
		try {
			const response = await api.GetPosts({});
			const dynamics = response as Dynamic[];
			setDynamics(dynamics);
		} catch (error) {
			console.error('Error fetching dynamics:', error);
		}
		setLoading(false);
	};

	const showModal = (dynamic: Dynamic | null = null) => {
		setIsEditMode(dynamic !== null);
		setSelectedDynamic(dynamic);
		form.resetFields();
		if (dynamic) {
			form.setFieldsValue({
				...dynamic,
				publish_date: moment(dynamic.publish_date),
				image: undefined // 清除图片字段
			});
			setImagePreview(dynamic.image ? `data:image/png;base64,${dynamic.image}` : '');
		} else {
			setImagePreview('');
		}
		setIsModalVisible(true);
	};

	const handleCreate = async () => {
		console.log('handleCreate is triggered');
		try {
			const values = await form.validateFields();
			const formattedValues = {
				...values,
				publish_date: values.publish_date,
				// .format("YYYY-MM-DD HH:mm:ss"),
				image: values.image || undefined
			};
			console.log('values:', formattedValues);
			await api.CreatePost(formattedValues);
			message.success('场馆动态创建成功');
			setIsModalVisible(false);
			fetchDynamics();
		} catch (error) {
			console.log('Create Failed:', error);
			message.error('创建操作失败，请检查输入或稍后再试');
		}
	};

	const handleUpdate = async () => {
		if (!selectedDynamic) {
			message.info('没有表单更新');
			return;
		}
		try {
			const values = await form.validateFields();
			const formattedValues = {
				...values,
				publish_date: values.publish_date,
				image: values.image || undefined
			};
			console.log('values:', formattedValues);
			await api.UpdatePost({ id: selectedDynamic.id, ...formattedValues });
			message.success('场馆动态更新成功');
			setIsModalVisible(false);
			fetchDynamics();
		} catch (error) {
			console.log('Update Failed:', error);
			message.error('更新操作失败，请检查输入或稍后再试');
		}
	};
	const showdDeleteConfirm = (record: any) => {
		Modal.confirm({
			title: '删除',
			content: '删除后，您将无法恢复这个场馆动态。',
			onOk() {
				handleDelete(record);
			}
		});
	};
	const handleDelete = async (id: number) => {
		try {
			const response: any = await api.DeletePost({ id });
			console.log('LOG', response);

			if (response.success) {
				message.success(response.message);
			} else {
				message.error(response.message);
			}
			fetchDynamics();
		} catch (error) {
			console.error('Delete dynamic error:', error);
			message.error('删除失败');
		}
	};

	const handleBeforeUpload = (file: Blob) => {
		const reader = new FileReader();
		reader.onload = () => {
			if (typeof reader.result === 'string') {
				setImagePreview(reader.result); // 设置预览图片，这里保留前缀，因为预览需要

				// 移除"data:image/jpeg;base64,"前缀，只存储纯Base64编码到数据库
				const base64Data = reader.result.split(',')[1];
				form.setFieldsValue({ image: base64Data });
			}
		};
		reader.readAsDataURL(file);
		return false; // 阻止默认上传行为
	};

	return (
		<>
			<Layout>
				<Content style={{ padding: '20px' }}>
					<Button
						type="primary"
						onClick={() => showModal()}
						style={{ marginBottom: '20px' }}>
						新增动态
					</Button>
					<List
						loading={loading}
						grid={{ gutter: 16, column: 4 }}
						dataSource={dynamics}
						renderItem={item => (
							<List.Item>
								<Card
									title={item.title}
									extra={<Button onClick={() => showModal(item)}>编辑</Button>}
									actions={[
										<Button
											key="delete"
											onClick={() => showdDeleteConfirm(item.id)}>
											删除
										</Button>
									]}
								>
									<p>{item.content}</p>
									{item.image && (
										<img
											src={`data:image/png;base64,${item.image}`}
											alt="dynamic"
											style={{ maxWidth: '100%', maxHeight: '100px' }}
										/>
									)}
									<p>{moment(item.publish_date).format('YYYY-MM-DD HH:mm')}</p>
								</Card>
							</List.Item>
						)}
					/>
				</Content>
			</Layout>
			<Modal
				title={`${isEditMode ? '编辑' : '新增'}场馆动态`}
				open={isModalVisible}
				onOk={() => (isEditMode ? handleUpdate() : handleCreate())}
				onCancel={() => setIsModalVisible(false)}
			>
				<Form form={form} layout="vertical">
					<Form.Item
						name="title"
						label="标题"
						rules={[{ required: true, message: '请输入标题' }]}>
						<Input />
					</Form.Item>
					<Form.Item
						name="content"
						label="内容"
						rules={[{ required: true, message: '请输入内容' }]}>
						<Input.TextArea />
					</Form.Item>
					<Form.Item
						name="publish_date"
						label="发布日期"
						rules={[{ required: true, message: '请选择发布日期' }]}>
						<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
					</Form.Item>
					<Form.Item label="动态图片" name="image">
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
								style={{ maxWidth: '100%', marginTop: 10, maxHeight: '100px' }} />
						)}
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
};

export default VenueDynamics;

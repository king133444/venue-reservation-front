import React, { useState, useEffect } from "react";
import { Button, Form, Input, Layout, Modal, message, DatePicker, List, Card } from "antd";
import moment from "moment";
import api from "@/api";

const { Content } = Layout;

interface Dynamic {
	id: number;
	title: string;
	content: string;
	publish_date: string;
	image: string | null;
}

const VenueDynamics = () => {
	const [dynamics, setDynamics] = useState<Dynamic[]>([]);
	const [loading, setLoading] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);
	const [selectedDynamic, setSelectedDynamic] = useState<Dynamic | null>(null);
	const [form] = Form.useForm();

	useEffect(() => {
		console.log("Fetching dynamics...");
		fetchDynamics();
	}, []);

	const fetchDynamics = async () => {
		setLoading(true);
		try {
			console.log("Sending API request...");
			const response = await api.GetPosts({});
			console.log("API Response:", response);
			// 使用类型断言将响应断言为 Dynamic[]
			const dynamics = response as Dynamic[];
			setDynamics(dynamics);
			console.log("Dynamics set:", dynamics);
		} catch (error) {
			console.error("Error fetching dynamics:", error);
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
				publish_date: moment(dynamic.publish_date)
			});
		}
		setIsModalVisible(true);
	};

	const handleOk = async () => {
		try {
			let values = await form.validateFields();
			values = {
				...values,
				publish_date: values.publish_date.format("YYYY-MM-DD HH:mm:ss")
			};
			if (isEditMode && selectedDynamic) {
				await api.UpdatePost({ ...selectedDynamic, ...values });
				message.success("场馆动态更新成功");
			} else {
				await api.CreatePost(values);
				message.success("场馆动态创建成功");
			}
			setIsModalVisible(false);
			fetchDynamics();
		} catch (error: any) {
			console.log("Failed:", error);
			// 对于表单验证失败的情况，Ant Design 已经内部处理，这里主要处理 API 调用失败的情况
			if (error.response) {
				// 如果错误中包含响应体，打印出更详细的信息
				console.error("API Error status:", error.response.status);
				console.error("API Error data:", error.response.data);
				message.error("操作失败，请检查输入或稍后再试");
			}
		}
	};

	const handleDelete = async (id: number) => {
		try {
			await api.DeletePost(id);
			message.success("场馆动态删除成功");
			fetchDynamics();
		} catch (error: any) {
			console.error("Delete dynamic error:", error);
			if (error.response) {
				// 打印更详细的错误信息
				console.error("Delete Error status:", error.response.status);
				console.error("Delete Error data:", error.response.data);
			}
			message.error("删除失败");
		}
	};

	return (
		<>
			<Layout>
				<Content style={{ padding: "20px" }}>
					<Button type="primary" onClick={() => showModal()} style={{ marginBottom: "20px" }}>
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
										<Button key="delete" onClick={() => handleDelete(item.id)}>
											删除
										</Button>
									]}
								>
									<p>{item.content}</p>
									{item.image && (
										<img
											src={`data:image/png;base64,${item.image}`}
											alt="dynamic"
											style={{ maxWidth: "100%", maxHeight: "100px" }}
										/>
									)}
									<p>{moment(item.publish_date).format("YYYY-MM-DD HH:mm")}</p>
								</Card>
							</List.Item>
						)}
					/>
				</Content>
			</Layout>
			<Modal
				title={`${isEditMode ? "编辑" : "新增"}场馆动态`}
				open={isModalVisible}
				onOk={handleOk}
				onCancel={() => setIsModalVisible(false)}
			>
				<Form form={form} layout="vertical">
					<Form.Item name="title" label="标题" rules={[{ required: true, message: "请输入标题" }]}>
						<Input />
					</Form.Item>
					<Form.Item name="content" label="内容" rules={[{ required: true, message: "请输入内容" }]}>
						<Input.TextArea />
					</Form.Item>
					<Form.Item name="publish_date" label="发布日期" rules={[{ required: true, message: "请选择发布日期" }]}>
						<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
					</Form.Item>
					<Form.Item name="image" label="图片(Base64)">
						<Input.TextArea rows={4} placeholder="请输入图片的Base64编码" />
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
};

export default VenueDynamics;

import { Button, Form, Input, Layout, List, Modal } from "antd";
import { useState } from "react";

const { Content } = Layout;
const initialDynamics = [
	{
		id: 1,
		title: "场馆动态标题1",
		content: "场馆动态内容1……"
	},
	{
		id: 2,
		title: "场馆动态标题2",
		content: "场馆动态内容2……"
	}
];

const VenueDynamics = () => {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false); // 新增还是编辑模式
	const [dynamics, setDynamics] = useState(initialDynamics); // 场馆动态列表
	const [selectedDynamic, setSelectedDynamic] = useState<any>(null);
	const [form] = Form.useForm();

	const showModal = () => {
		setIsEditMode(false);
		setIsModalVisible(true);
		form.resetFields(); // 显示模态框前重置表单
	};

	const handleOk = () => {
		form
			.validateFields()
			.then(values => {
				if (isEditMode && selectedDynamic !== null) {
					// 编辑模式下的更新逻辑
					const updatedDynamics = dynamics.map(dynamic =>
						dynamic.id === selectedDynamic.id ? { ...dynamic, ...values } : dynamic
					);
					setDynamics(updatedDynamics);
				} else {
					// 新增动态
					const newDynamic = { id: dynamics.length + 1, ...values };
					setDynamics([...dynamics, newDynamic]);
				}
				setIsModalVisible(false);
			})
			.catch(info => {
				console.log("Validate Failed:", info);
			});
	};

	const viewDetail = (id: number) => {
		const dynamic = dynamics.find(d => d.id === id);
		setSelectedDynamic(dynamic);
		setIsEditMode(true); // 设置为编辑模式
		setIsModalVisible(true); // 打开模态框
		form.setFieldsValue(dynamic); // 初始化表单值
	};

	return (
		<>
			<Layout style={{ borderRadius: "10px", backgroundColor: "white", overflow: "auto", height: "70vh" }}>
				<Content style={{ padding: "20px" }}>
					<Button type="primary" onClick={showModal}>
						新增场馆动态
					</Button>
					<List
						itemLayout="horizontal"
						dataSource={dynamics}
						renderItem={item => (
							<List.Item key={item.id} onClick={() => viewDetail(item.id)}>
								<List.Item.Meta title={item.title} description={item.content} />
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
					<Form.Item name="title" label="标题" rules={[{ required: true, message: "请输入标题!" }]}>
						<Input />
					</Form.Item>
					<Form.Item name="content" label="内容" rules={[{ required: true, message: "请输入内容!" }]}>
						<Input.TextArea />
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
};

export default VenueDynamics;

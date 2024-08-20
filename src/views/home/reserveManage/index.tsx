import { useState } from "react";
import { Layout, Button, Modal, Form, DatePicker, Select, Table, Col, Row } from "antd";
import dayjs from "dayjs";
const { Content } = Layout;
const { Option } = Select;

const ReserveManage = () => {
	// State for showModal, form values, and reservations
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [form] = Form.useForm();
	const [reservations, setReservations] = useState<any>([]);

	const disabledTime = (current: any) => {
		if (!current) {
			// 如果没有选中的日期，不禁用任何时间
			return { disabledHours: () => [], disabledMinutes: () => [], disabledSeconds: () => [] };
		}
		const isToday = current.format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD");
		if (isToday) {
			// 如果选中的日期是今天，则根据当前时间禁用过去的小时和分钟
			const hours = dayjs().hour();
			const minutes = dayjs().minute();
			return {
				disabledHours: () => Array.from({ length: hours }, (_, i) => i),
				disabledMinutes: (hour: number) => {
					if (hour === hours) {
						return Array.from({ length: minutes }, (_, i) => i);
					}
					return [];
				}
			};
		}
		// 如果选中的日期不是今天，则不禁用任何时间
		return { disabledHours: () => [], disabledMinutes: () => [], disabledSeconds: () => [] };
	};

	// Function to show modal
	const showModal = (record: any) => {
		setIsModalVisible(true);
		if (record) {
			form.setFieldsValue({
				sportType: record.sportType,
				date: dayjs(record.date),
				duration: record.duration
			});
		}
	};

	// Function to handle modal ok
	const handleOk = async () => {
		try {
			const values = await form.validateFields();
			setReservations([...reservations, { ...values, id: reservations.length + 1 }]);
			setIsModalVisible(false);
			form.resetFields(); // Reset form after submission
		} catch (errorInfo) {
			console.log("Failed:", errorInfo);
		}
	};

	// Columns for table
	const columns = [
		{
			title: "运动类型",
			dataIndex: "sportType",
			key: "sportType"
		},
		{
			title: "预约时间",
			dataIndex: "date",
			key: "date",
			render: (text: dayjs.Dayjs) => dayjs(text).format("YYYY-MM-DD HH:mm")
		},
		{
			title: "预约时长（小时）",
			dataIndex: "duration",
			key: "duration"
		},
		{
			title: "操作",
			dataIndex: "operation",
			render: (_: any, record: any) => <Button onClick={() => showModal(record)}>详情</Button>
		}
	];

	return (
		<>
			<Layout style={{ borderRadius: "10px", backgroundColor: "white", overflow: "auto", height: "70vh" }}>
				<Content style={{ padding: "20px" }}>
					<Button type="primary" onClick={() => showModal(null)}>
						新增预约
					</Button>
					<Table dataSource={reservations} columns={columns} rowKey="id" />
				</Content>
			</Layout>
			<Modal title="预约详情" open={isModalVisible} onOk={handleOk} onCancel={() => setIsModalVisible(false)}>
				<Form form={form} layout="vertical">
					<Form.Item name="sportType" label="运动类型" rules={[{ required: true }]}>
						<Select placeholder="请选择运动类型">
							<Option value="badminton">羽毛球</Option>
							<Option value="basketball">篮球</Option>
						</Select>
					</Form.Item>
					<Row>
						<Col span={16}>
							<Form.Item name="date" label="预约时间" rules={[{ required: true }]}>
								<DatePicker
									showTime={{ format: "HH:mm" }}
									disabledTime={disabledTime}
									disabledDate={current => current && current < dayjs().startOf("day")}
								/>
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item name="duration" label="预约时长" rules={[{ required: true }]}>
								<Select placeholder="时长">
									<Option value="15分钟">15分钟</Option>
									<Option value="30分钟">30分钟</Option>
									<Option value="1小时">1小时</Option>
									<Option value="2小时">2小时</Option>
									<Option value="3小时">3小时</Option>
								</Select>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Modal>
		</>
	);
};

export default ReserveManage;

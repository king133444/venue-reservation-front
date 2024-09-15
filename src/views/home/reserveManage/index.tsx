import { useEffect, useState } from "react";
import { Layout, Table} from "antd";
import dayjs from "dayjs";
import axios from "axios";
const { Content } = Layout;
// const { Option } = Select;

const ReserveManage = () => {
	// State for showModal, form values, and reservations
	// const [isModalVisible, setIsModalVisible] = useState(false);
	// const [form] = Form.useForm();
	const [reservations, setReservations] = useState<any>([]);
	// const disabledTime = (current: any) => {
	// 	if (!current) {
	// 		// 如果没有选中的日期，不禁用任何时间
	// 		return { disabledHours: () => [], disabledMinutes: () => [], disabledSeconds: () => [] };
	// 	}
	// 	const isToday = current.format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD");
	// 	if (isToday) {
	// 		// 如果选中的日期是今天，则根据当前时间禁用过去的小时和分钟
	// 		const hours = dayjs().hour();
	// 		const minutes = dayjs().minute();
	// 		return {
	// 			disabledHours: () => Array.from({ length: hours }, (_, i) => i),
	// 			disabledMinutes: (hour: number) => {
	// 				if (hour === hours) {
	// 					return Array.from({ length: minutes }, (_, i) => i);
	// 				}
	// 				return [];
	// 			}
	// 		};
	// 	}
	// 	// 如果选中的日期不是今天，则不禁用任何时间
	// 	return { disabledHours: () => [], disabledMinutes: () => [], disabledSeconds: () => [] };
	// };

	// // Function to show modal
	// const showModal = (record: any) => {
	// 	setIsModalVisible(true);
	// 	if (record) {
	// 		form.setFieldsValue({
	// 			type_name: record.sportType,
	// 			time: dayjs(record.date),
	// 			duration: record.duration
	// 		});
	// 	}
	// };

	// Function to handle modal ok
	// const handleOk = async () => {
	// 	try {
	// 		const values = await form.validateFields();
	// 		values.duration = Number(values.duration)
	// 		//准备要发送到后端的数据
	// 		const reservationData = {
	// 			type_name: values.type_name,
    //             time: values.time.toDate(), //日期格式
    //             duration: values.duration,
    //             user_id: 1, // 假设您有用户ID，需要从某处获取
    //             status: -1, // 假设新预约的初始状态为 'pending'
	// 		}
			
	// 		// 发送POST请求到后端API
	// 		const response = await axios.get('http://127.0.0.1:8001/reservation', reservationData);
			
	// 		// 如果后端返回成功响应，则更新前端的reservations状态
	// 		if (response.status === 201) {
	// 			// 将新创建的预约添加到reservations数组中
	// 			setReservations([...reservations, response.data]);

	// 		// setReservations([...reservations, { ...values, id: reservations.length + 1 }]);
	// 		setIsModalVisible(false);
	// 		form.resetFields(); // Reset form after submission
	// 	} else {
	// 		// 处理错误情况
	// 		console.error('Failed to create reservation:', response);
	// 	}
	// } catch (errorInfo) {
	// 	console.log("Failed:", errorInfo);
	//   }
	// };

	//连接前后端将预约信息显示在表格里
	const fetchReservations = async () => {
		try{
			const response = await axios.get('http://127.0.0.1:8001/reservation');
			if(response.status === 200) {
				setReservations(response.data);
			}else{
				console.error('Failed to fetch reservations:', response);
			}
		}catch(error){
			console.error('Error fetching reservations:', error);
		}
	};

	//监听这个函数
	useEffect(()=>{
		fetchReservations();
	},[]);

	// Columns for table
	const columns = [
		{
			title: "id",
			dataIndex: "id",
			key: "id"
		},
		{
			title: "运动类型",
			dataIndex: "type_name",
			key: "type_name"
		},
		{
			title: "预约时间",
			dataIndex: "time",
			key: "time",
			render: (text: dayjs.Dayjs) => dayjs(text).format("YYYY-MM-DD HH:mm")
		},
		{
			title: "预约时长（小时）",
			dataIndex: "duration",
			key: "duration"
		},
		{
			title: "预约用户id",
			dataIndex: "user_id",
			key: "user_id"
		},
		{
			title: "预约状态",
			dataIndex: "status",
			key: "status"
		},
		{
			title: "操作",
			dataIndex: "operation",
			// render: (_: any, record: any) => <Button onClick={() => showModal(record)}>详情</Button>
		}
	];

	return (
		<>
			<Layout style={{ borderRadius: "10px", backgroundColor: "white", overflow: "auto", height: "70vh" }}>
				<Content style={{ padding: "20px" }}>
					{/* <Button type="primary" onClick={() => showModal(null)}>
						新增预约
					</Button> */}
					<Table 
					dataSource={reservations} 
					columns={columns} 
					rowKey="id" />
				</Content>
			</Layout>
			{/* <Modal title="预约详情" open={isModalVisible} onOk={handleOk} onCancel={() => setIsModalVisible(false)}>
				<Form form={form} layout="vertical">
					<Form.Item name="type_name" label="运动类型" rules={[{ required: true }]}>
						<Select placeholder="请选择运动类型">
							<Option value="BADMINTON">羽毛球</Option>
							<Option value="BASKETBALL">篮球</Option>
						</Select>
					</Form.Item>
					<Row>
						<Col span={16}>
							<Form.Item name="time" label="预约时间" rules={[{ required: true }]}>
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
									<Option value="15">15分钟</Option>
									<Option value="30">30分钟</Option>
									<Option value="1">1小时</Option>
									<Option value="2">2小时</Option>
									<Option value="3">3小时</Option>
								</Select>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Modal> */}
		</>
	);
};

export default ReserveManage;

import { Button, Layout, message, Modal, Table } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import DateManage from '../dateManage';
import SetReservationModal from '../reservePeoples';
const { Content } = Layout;
// const { Option } = Select;

const ReserveManage = () => {
	// State for showModal, form values, and reservations
	// const [isModalVisible, setIsModalVisible] = useState(false);
	// const [form] = Form.useForm();
	const [reservations, setReservations] = useState<any>([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isSettingModalVisible, setIsSettingModalVisible] = useState(false);

	// 处理设置预约人数的逻辑
	const handleOkSetting = async (sportType: string, availablePeoples: number) => {
		try {
			// 发送POST请求到后端API，确保URL与您的NestJS服务匹配
			const response = await axios.post(
				'http://127.0.0.1:8001/ReservationPeoples/updateReservationPeoples', {
				name: sportType, // 注意：这里的字段名需要与后端DTO一致
				available_peoples: availablePeoples,
			});
			if (response.status === 200) {
				message.success('设置预约人数成功');
				setIsSettingModalVisible(false); // 关闭模态框
				// 可选：重新获取预约信息
				fetchReservations();
			} else {
				console.error('设置预约人数失败:', response);
			}
		} catch (error) {
			console.error('请求错误:', error);
			// 可以在这里处理错误，例如显示一个错误消息
		}
	};

	// 连接前后端将预约信息显示在表格里
	const fetchReservations = async () => {
		try {
			const response = await axios.get('http://127.0.0.1:8001/reservation');
			if (response.status === 200) {
				setReservations(response.data);
			} else {
				console.error('Failed to fetch reservations:', response);
			}
		} catch (error) {
			console.error('Error fetching reservations:', error);
		}
	};

	// 监听这个函数
	useEffect(() => {
		fetchReservations();
	}, []);
	const showDateManageModal = () => {
		setIsModalVisible(true);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	// Columns for table
	const columns = [
		{
			title: 'id',
			dataIndex: 'id',
			key: 'id'
		},
		{
			title: '运动类型',
			dataIndex: 'type_name',
			key: 'type_name'
		},
		{
			title: '预约时间',
			dataIndex: 'time',
			key: 'time',
			render: (text: dayjs.Dayjs) => dayjs(text).format('YYYY-MM-DD HH:mm')
		},
		{
			title: '预约时长（小时）',
			dataIndex: 'duration',
			key: 'duration'
		},
		{
			title: '预约用户id',
			dataIndex: 'user_id',
			key: 'user_id'
		},
		{
			title: '预约状态',
			dataIndex: 'status',
			key: 'status'
		},
		{
			title: '操作',
			dataIndex: 'operation',
			// render: (_: any, record: any) => 
			// <Button onClick={() => showModal(record)}>详情</Button>
		}
	];

	return (
		<>
			<Layout style={{
				marginTop: 20,
				borderRadius: '10px',
				backgroundColor: 'white',
				display: 'flex',
				flexDirection: 'column',
				height: '70vh', // 调整整体高度以适应不同的屏幕
			}}>
				<Content style={{
					padding: '20px',
					overflow: 'auto', flex: 1, display: 'flex', flexDirection: 'column'
				}}>
					<div style={{ marginBottom: '16px' }}>
						<Button onClick={showDateManageModal}>
							日期管理
						</Button>
						<Button
							onClick={() => setIsSettingModalVisible(true)}
							style={{ marginLeft: '10px' }}>
							设置预约人数
						</Button>
					</div>
					<div style={{ flex: 1, overflow: 'auto' }}>
						<Table
							dataSource={reservations}
							columns={columns}
							rowKey="id"
							pagination={{ pageSize: 10 }}
							style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
						/>
					</div>
				</Content>
			</Layout>
			<Modal
				title="日期管理"
				open={isModalVisible}
				onCancel={handleCancel}
				footer={null}
				width={1000}
			>
				<DateManage />
			</Modal>
			<SetReservationModal
				isVisible={isSettingModalVisible}
				onCancel={() => setIsSettingModalVisible(false)}
				onOk={(sportType, availablePeoples) => handleOkSetting(sportType, availablePeoples)}
			/>
		</>
	);
};

export default ReserveManage;

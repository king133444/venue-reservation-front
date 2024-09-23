import { Button, Descriptions, Layout, message, Modal, Table, Tag } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import DateManage from '../dateManage';
import SetReservationModal from '../reservePeoples';
const { Content } = Layout;

const ReserveManage = () => {
	// State for showModal, form values, and reservations
	// const [isModalVisible, setIsModalVisible] = useState(false);
	// const [form] = Form.useForm();
	const [reservations, setReservations] = useState<any>([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isSettingModalVisible, setIsSettingModalVisible] = useState(false);

	const [detailModalVisible, setDetailModalVisible] = useState(false);
	const [selectedUserId, setSelectedUserId] = useState(0);
	const [userDetails, setuserDetails] = useState<any>([]);
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
				const filteredReservations =
					response.data.filter
						((reservation: { status: number; }) => reservation.status !== 3);
				setReservations(filteredReservations);
				// setReservations(response.data);
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

	// 显示用户详情模态框
	const showUserDetailModal = (userId: number) => {
		setSelectedUserId(userId);
		setDetailModalVisible(true);
	};

	// 模态框中的取消按钮
	const handleCancelDetailModal = () => {
		setDetailModalVisible(false);
	};

	// 前后端连接获取用户详情,拿到数据库当中的用户的信息
	const fetchUserDetails = async (selectedUserId: number) => {
		try {
			const response = await axios.get(`http://127.0.0.1:8001/users/getUser/${selectedUserId}`);
			if (response.status === 200) {
				console.log('User details:', response.data.data);
				return response.data.data;
			} else {
				console.error('Failed to fetch user details:', response);
				return null;
			}
		} catch (error) {
			console.error('Error fetching user details:', error);
			return null;
		}
	};

	// 连接前后端中取消预约按钮
	const cancelReservation = async (reservationId: number) => {
		try {
			const response = await axios.post(`http://127.0.0.1:8001/reservation/cancelReservation/${reservationId}`);
			if (response.status === 201) {
				console.log('111');
				message.success('取消预约成功');
				fetchReservations();
			} else {
				console.error('取消预约失败:', response);
			}
		} catch (error) {
			console.error('请求错误:', error);
		}
	};

	// 连接前后端中取消删除按钮
	const deleteReservation = async (reservationId: number) => {
		try {
			const response = await axios.delete(`http://127.0.0.1:8001/reservation/delete/${reservationId}`);
			if (response.status === 200) {
				message.success('删除预约成功');
				fetchReservations();
			} else {
				console.error('删除预约失败:', response);
			}
		} catch (error) {
			console.error('请求错误:', error);
		}
	};

	// 使用useEffect来控制fetchUserDetails调用，仅在detailModalVisible为true时请求
	useEffect(() => {
		if (detailModalVisible) {
			fetchUserDetails(selectedUserId).then((data) => {
				setuserDetails(data);
			});
		}
	}, [detailModalVisible, selectedUserId]); // 添加selectedUserId作为依赖，以便在id改变时重新获取数据// 确保依赖项拼写正确
	// Columns for table
	const columns = [
		{
			title: '序号',
			dataIndex: 'id',
			key: 'id',
			render: (_: undefined, __: any, index: number) =>
				1 + index,
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
			title: '预约用户信息',
			dataIndex: 'user_id',
			key: 'user_id',
			render: (text: any) => (
				<Button onClick={() => showUserDetailModal(text)}>详情</Button>
			),
		},
		{
			title: '预约状态',
			dataIndex: 'status',
			key: 'status',
			render: (text: number) => {
				let statusText = '';
				let statusColor = 'default';
				switch (text) {
					case 1:
						statusText = '预约成功';
						statusColor = 'green';
						break;
					case 2:
						statusText = '取消预约';
						statusColor = 'red';
						break;
					case 3:
						statusText = '预约删除';
						statusColor = 'gray';
						break;
				}
				return <Tag color={statusColor}>{statusText}</Tag>;
			}
		},
		{
			title: '操作',
			dataIndex: 'operation',
			render: (text: any, record: any) => {
				return (
					<div>
						{record.status === 1 &&
							<Button onClick={() => cancelReservation(record.id)}>
								取消预约</Button>}
						{(record.status === 2 || record.status === 3) &&
							<Button onClick={() => deleteReservation(record.id)}>删除预约</Button>}
					</div>
				);
			}
		},
	];

	// 渲染用户详情模态框
	const renderDetailModal = () => {
		return (
			<Modal
				title="用户信息"
				open={detailModalVisible}
				onCancel={handleCancelDetailModal}
				footer={null}
			>
				{userDetails ? (
					<Descriptions column={1}>
						<Descriptions.Item label="姓名">{userDetails.name}</Descriptions.Item>
						<Descriptions.Item label="身份证号">
							{userDetails.id_number}</Descriptions.Item>
						<Descriptions.Item label="电话">{userDetails.phone}</Descriptions.Item>
						<Descriptions.Item label="是否电工">
							{userDetails.is_electrical_employee ? '是' : '否'}</Descriptions.Item>
						<Descriptions.Item label="职业">{userDetails.occupation}</Descriptions.Item>
					</Descriptions>
				) : (
					<div>加载中....</div>
				)}
			</Modal>
		);
	};

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
			{renderDetailModal()}
		</>
	);
};

export default ReserveManage;

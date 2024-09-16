import './DateManage.css';

import { Button, Checkbox, InputNumber, message, Modal, Table } from 'antd';
import { useEffect, useState } from 'react';

export interface Reservation {
	id: number;
	name: string;
	available_days: number[];
	available_peoples: number;
	status: number;
}

const weekDays = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
const nameMap = {
	BADMINTON: '羽毛球馆',
	BASKETBALL: '篮球馆'
};
const defaultData: Reservation[] = [
	{ id: 1, name: 'BADMINTON', available_days: [], available_peoples: 2, status: 0 },
	{ id: 2, name: 'BASKETBALL', available_days: [], available_peoples: 2, status: 0 },
];

// const DateManage = () => {
// 	const [reservations, setReservations] = useState<Reservation[]>([]);
// 	const [modalVisible, setModalVisible] = useState(false);
// 	const [selectedRecord, setSelectedRecord] = useState<Reservation | null>(null);

// 	const fetchReservations = async () => {
// 		try {
// 			const response = await fetch('http://127.0.0.1:8001/dateManage/selectDate');
// 			const data = await response.json();
// 			if (data.length === 0) {
// 				setReservations(defaultData);
// 			} else {
// 				const transformedData = data.map((item: any) => ({
// 					id: item.id,
// 					name: item.name,
// 					available_days: Array.isArray(item.available_days) ? item.available_days : [],
// 					available_peoples: item.available_peoples,
// 					status: item.status || 0,
// 				}));

// 				setReservations(transformedData);
// 			}
// 		} catch (error) {
// 			console.error("Error fetching reservations:", error);
// 			setReservations(defaultData);
// 		}
// 	};

// 	const updateReservationSettings = async (record: Reservation) => {
// 		try {
// 			const response = await fetch(`http://127.0.0.1:8001/dateManage/updateDate/${record.id}`,
// {
// 				method: 'PUT',
// 				headers: {
// 					'Content-Type': 'application/json',
// 				},
// 				body: JSON.stringify({
// 					available_days: JSON.stringify(record.available_days),
// 					available_peoples: record.available_peoples,
// 					name: record.name,
// 				}),
// 			});

// 			if (response.ok) {
// 				message.success('设置已保存');
// 				fetchReservations();
// 			} else {
// 				message.error('保存失败');
// 			}
// 		} catch (error) {
// 			console.error("Error updating reservation settings:", error);
// 		}
// 	};

// 	useEffect(() => {
// 		fetchReservations();
// 	}, []);

// 	const handleOpenModal = (record: Reservation) => {
// 		setSelectedRecord(record);
// 		setModalVisible(true);
// 	};

// 	const handleSaveDays = () => {
// 		if (selectedRecord) {
// 			updateReservationSettings(selectedRecord);
// 		}
// 		setModalVisible(false);
// 	};

// 	const columns = [
// 		{
// 			title: "预约场馆",
// 			dataIndex: "name",
// 			key: "name",
// 			render: (name: string) => nameMap[name as keyof typeof nameMap] || name
// 		},
// 		{
// 			title: "可预约日期",
// 			key: "available_days",
// 			render: (_: any, record: Reservation) => (
// 				<span>
// 					{record.available_days.map(day => weekDays[day - 1]).join(', ')}
// 				</span>
// 			)
// 		},
// 		{
// 			title: "修改日期",
// 			key: "select",
// 			render: (_: any, record: Reservation) => (
// 				<Button onClick={() => handleOpenModal(record)}>修改</Button>
// 			)
// 		},
// 		{
// 			title: "最大可预约人数",
// 			key: "available_peoples",
// 			render: (_: any, record: Reservation) => (
// 				<InputNumber
// 					min={1}
// 					max={27}
// 					value={record.available_peoples}
// 					onChange={(value) => {
// 						if (value !== null) {
// 							setReservations(prev =>
// 								prev.map(item => item.id === record.id ? 
// { ...item, available_peoples: value } : item)
// 							);
// 						}
// 					}}
// 				/>
// 			)
// 		},
// 		{
// 			title: "操作",
// 			key: "action",
// 			render: (_: any, record: Reservation) => (
// 				<Button type="primary" onClick={() => updateReservationSettings(record)}>
// 					保存设置
// 				</Button>
// 			)
// 		}
// 	];

// 	return (
// 		<>
// 			<Table
// 				dataSource={reservations}
// 				columns={columns}
// 				rowKey="id"
// 				pagination={false}
// 			/>
// 			<Modal
// 				title="选择可预约日期"
// 				visible={modalVisible}
// 				onOk={handleSaveDays}
// 				onCancel={() => setModalVisible(false)}
// 			>
// 				{selectedRecord && (
// 					<Checkbox.Group
// 						options={weekDays}
// 						value={selectedRecord.available_days.map(day => weekDays[day - 1])}
// 						onChange={(checkedValues) => {
// 							const selectedDays = checkedValues.map(
// day => weekDays.indexOf(day) + 1
// );
// 							const limit = selectedRecord.name === 'BADMINTON' ? 3 : 2;
// 							if (selectedDays.length <= limit) {
// 								setSelectedRecord(prev => prev ? { 
// ...prev, available_days: selectedDays } : null
// );
// 							} else {
// 								message.error(`最多只能选择${limit}个日期`);
// 							}
// 						}}
// 					/>
// 				)}
// 			</Modal>
// 		</>
// 	);
// };
const DateManage = () => {
	const [reservations, setReservations] = useState<Reservation[]>([]);
	const [modalVisible, setModalVisible] = useState(false);
	const [selectedRecord, setSelectedRecord] = useState<Reservation | null>(null);

	const fetchReservations = async () => {
		try {
			const response = await fetch('http://127.0.0.1:8001/dateManage/selectDate');
			const data = await response.json();
			if (data.length === 0) {
				setReservations(defaultData);
			} else {
				const transformedData = data.map((item: any) => ({
					id: item.id,
					name: item.name,
					available_days: Array.isArray(item.available_days) ? item.available_days : [],
					available_peoples: item.available_peoples,
					status: item.status || 0,
				}));

				setReservations(transformedData);
			}
		} catch (error) {
			console.error('Error fetching reservations:', error);
			setReservations(defaultData);
		}
	};

	const updateReservationSettings = async (record: Reservation) => {
		try {
			const response = await fetch(`http://127.0.0.1:8001/dateManage/updateDate/${record.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					available_days: JSON.stringify(record.available_days),
					available_peoples: record.available_peoples,
					name: record.name,
				}),
			});

			if (response.ok) {
				message.success('设置已保存');
				fetchReservations();
			} else {
				message.error('保存失败');
			}
		} catch (error) {
			console.error('Error updating reservation settings:', error);
		}
	};

	useEffect(() => {
		fetchReservations();
	}, []);

	const handleOpenModal = (record: Reservation) => {
		setSelectedRecord(record);
		setModalVisible(true);
	};

	const handleSaveDays = () => {
		if (selectedRecord) {
			const selectedDays = selectedRecord.available_days;
			const requiredDays = selectedRecord.name === 'BADMINTON' ? 3 : 2;

			if (selectedDays.length < requiredDays) {
				message.error(`请至少选择${requiredDays}个日期`);
				return;
			}

			updateReservationSettings(selectedRecord);
			setModalVisible(false);
		}
	};
	const columns = [
		{
			title: '预约场馆',
			dataIndex: 'name',
			key: 'name',
			width: 150,
			render: (name: string) => nameMap[name as keyof typeof nameMap] || name
		},
		{
			title: '可预约日期',
			key: 'available_days',
			width: 200,
			render: (_: any, record: Reservation) => (
				<span>
					{record.available_days.map(day => weekDays[day - 1]).join(', ')}
				</span>
			)
		},
		{
			title: '修改日期',
			key: 'select',
			width: 100,
			render: (_: any, record: Reservation) => (
				<Button onClick={() => handleOpenModal(record)}>修改</Button>
			)
		},
		{
			title: '最大可预约人数',
			key: 'available_peoples',
			width: 150,
			render: (_: any, record: Reservation) => (
				<InputNumber
					min={1}
					max={27}
					value={record.available_peoples}
					style={{ width: '80px' }}
					onChange={(value) => {
						if (value !== null) {
							setReservations(prev =>
								prev.map(
									item => item.id === record.id ? {
										...item, available_peoples: value
									} : item
								)
							);
						}
					}}
				/>
			)
		},
		{
			title: '操作',
			key: 'action',
			width: 150,
			render: (_: any, record: Reservation) => (
				<Button type="primary" onClick={() => updateReservationSettings(record)}>
					保存设置
				</Button>
			)
		}
	];

	return (
		<>
			<Table
				dataSource={reservations}
				columns={columns}
				rowKey="id"
				pagination={false}
				style={{ marginBottom: '20px', width: '100%' }}
				scroll={{ x: 800 }}
			/>
			<Modal
				title="选择可预约日期"
				open={modalVisible}
				onOk={handleSaveDays}
				onCancel={() => setModalVisible(false)}
				width={1000}
			>
				{selectedRecord && (
					<Checkbox.Group
						options={weekDays}
						value={selectedRecord.available_days.map(day => weekDays[day - 1])}
						onChange={(checkedValues) => {
							const selectedDays = checkedValues.map(
								day => weekDays.indexOf(day) + 1
							);
							const limit = selectedRecord.name === 'BADMINTON' ? 3 : 2;
							if (selectedDays.length <= limit) {
								setSelectedRecord(
									prev => prev ? { ...prev, available_days: selectedDays } : null
								);
							} else {
								message.error(`最多只能选择${limit}个日期`);
							}
						}}
					/>
				)}
			</Modal>
		</>
	);
};

export default DateManage;

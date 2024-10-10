import './DateManage.css';

import { Button, Checkbox, message, Modal, Table } from 'antd';
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
	{
		id: 1, name: 'BADMINTON', available_days: [],
		available_peoples: 2, status: 0
	},
	{ id: 2, name: 'BASKETBALL', available_days: [], available_peoples: 2, status: 0 },
];

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

			const week1Days = selectedDays.filter(day => day <= 7);
			const week2Days = selectedDays.filter(day => day > 7 && day <= 14);

			if (week1Days.length > requiredDays || week2Days.length > requiredDays) {
				message.error(`每周最多选择${requiredDays}个日期`);
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
			title: '本周可预约日期',
			key: 'week1_days',
			width: 200,
			render: (_: any, record: Reservation) => (
				<span>
					{record.available_days.filter(
						day => day <= 7).map(day => weekDays[day - 1]).join(', ')}
				</span>
			)
		},
		{
			title: '下周可预约日期',
			key: 'week2_days',
			width: 200,
			render: (_: any, record: Reservation) => (
				<span>
					{record.available_days.filter(
						day => day > 7 && day <= 14).map(day => weekDays[day - 8]).join(', ')}
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
					<>
						<div style={{ marginBottom: '20px' }}>本周可预约日期</div>
						<Checkbox.Group
							options={weekDays}
							value={selectedRecord.available_days.filter(
								day => day <= 7).map(day => weekDays[day - 1])}
							onChange={(checkedValues) => {
								const selectedDays = checkedValues.map(
									day => weekDays.indexOf(day) + 1
								);
								const limit = selectedRecord.name === 'BADMINTON' ? 3 : 2;
								if (selectedDays.length <= limit) {
									setSelectedRecord(
										prev => prev ? {
											...prev,
											available_days: [
												...selectedDays,
												...prev.available_days.filter(day => day > 7)]
										} : null
									);
								} else {
									message.error(`每周最多选择${limit}个日期`);
								}
							}}
						/>
						<div style={{ marginBottom: '20px', marginTop: '20px' }}>下周可预约日期</div>
						<Checkbox.Group
							options={weekDays}
							value={selectedRecord.available_days.filter(
								day => day > 7 && day <= 14).map(day => weekDays[day - 8])}
							onChange={(checkedValues) => {
								const selectedDays = checkedValues.map(
									day => weekDays.indexOf(day) + 8
								);
								const limit = selectedRecord.name === 'BADMINTON' ? 3 : 2;
								if (selectedDays.length <= limit) {
									setSelectedRecord(
										prev => prev ? {
											...prev,
											available_days: [
												...prev.available_days.filter(
													day => day <= 7), ...selectedDays]
										} : null
									);
								} else {
									message.error(`每周最多选择${limit}个日期`);
								}
							}}
						/>
					</>
				)}
			</Modal>
		</>
	);
};

export default DateManage;

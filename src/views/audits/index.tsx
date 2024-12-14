import './index.less';

import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import {
	Button, Form, Input, Layout, message,
	Modal, Radio, Table,
} from 'antd';
import { Content } from 'antd/es/layout/layout';
import { useEffect, useState } from 'react';

import { baseURL } from '@/components/ReqInstance/axios';

// 首先定义用户数据的接口
interface UserData {
	id: number;
	name: string;
	organization?: string;
	association?: string;
	id_number?: string;
	phone?: string;
	image?: string;
	is_car_coming?: boolean;
	license_plate_number?: string;
	license_plate_picture?: string;
	is_outsider?: boolean;
	remark?: string;
	audit_status?: string;
}

const Audits = () => {
	const [data, setData] = useState<UserData[]>([]);
	const [loading, setLoading] = useState(false);
	const [showAuditModal, setShowAuditModal] = useState(false);
	const [organization, setOrganization] = useState('');
	const [association, setAssociation] = useState('');
	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const [modal, contextHolder] = Modal.useModal();
	const [selectedUser, setSelectedUser] = useState<{
		id?: number;
		name?: string;
		idNumber?: string;
		phone?: string;
		image?: string;
		occupation?: string;
		is_electrical_employee?: number;
		is_outsider?: boolean;
		organization?: string;
		association?: string;
		is_car_coming?: boolean;
		license_plate_number?: string;
		license_plate_picture?: string;
		notification?: string;
		remark?: string;
		audit_status?: string;
	} | null>(null);
	// const [originalData, setOriginalData] = useState([]);
	// const [searchName, setSearchName] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const rowHeight = 90;
	const totalPages = Math.ceil(data.length / 10);
	const isLastPage = currentPage === totalPages;
	const dataOnLastPage = data.length % 10 || 10;
	const actualDataCount = isLastPage ? dataOnLastPage : 10;

	// 计算需要补充的高度
	const fillHeight = isLastPage ? (10 - actualDataCount) * rowHeight : 0;

	useEffect(() => {
		fetchData();
	}, []);

	const [form] = Form.useForm();
	useEffect(() => {
		if (selectedUser) {
			form.setFieldsValue({
				...selectedUser,
				idNumber: selectedUser.idNumber,
				is_electrical_employee: selectedUser.is_electrical_employee === 1
			});
		}
	}, [selectedUser, form]);

	// 获取数据
	const fetchData = async () => {
		try {
			setLoading(true);
			console.log('ba', baseURL);

			const response = await fetch(baseURL + '/audits/getAudits');
			const result = await response.json();
			const usersWithDefaultStatus = result.data.map((user: any) => ({
				...user,
				audit_status: user.audit_status || '待审核'
			}));
			setData(usersWithDefaultStatus);
		} catch (error) {
			message.error('获取数据错误');
		} finally {
			setLoading(false);
		}
	};

	// 批量通过
	const handleBatchApprove = async () => {
		if (selectedRowKeys.length === 0) {
			message.warning('请选择至少一个用户进行批量通过');
			return;
		}
		try {
			const numericKeys = selectedRowKeys.map(key => Number(key));
			const response = await fetch(baseURL + '/audits/batchApprove', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ userIds: numericKeys }),
			});
			const result = await response.json();
			if (result.success) {
				message.success('批量通过成功');
				fetchData();
				setSelectedRowKeys([]);
			} else {
				message.error('批量通过失败');
			}
		} catch (error) {
			message.error('批量通过失败');
		}
	};

	// 行选择配置
	const rowSelection = {
		selectedRowKeys,
		onChange: (newSelectedRowKeys: React.Key[]) => {
			setSelectedRowKeys(newSelectedRowKeys);
		},
	};

	// 显示删除确认对话框
	const showdDeleteConfirm = (record: any) => {
		modal.confirm({
			title: '您确定要删除这条审核信息吗？',
			content: '删除后，您将无法恢复这个审核。',
			okText: '确认',
			cancelText: '取消',
			onOk() {
				handleDelete(record);
			}
		});
	};

	// 查询
	const handleSearch = async () => {
		if (!organization && !association) {
			message.warning('请输入查询内容');
			return;
		}
		try {
			setLoading(true);
			const response = await fetch(baseURL + `/audits/getAudits?organization=${organization}&association=${association}`);
			const result = await response.json();
			if (!result.success) {
				message.error(result.message);
				return;
			}
			setData(result.data);
			message.success(result.message);
		} catch (error) {
			message.error('查询失败');
		} finally {
			setLoading(false);
		}
	};

	// 重置查询条件
	const handleReset = () => {
		setOrganization('');
		setAssociation('');
		fetchData(); // 重置后重新获取所有数据
	};

	// 删除
	const handleDelete = async (record: { id: number }) => {
		try {
			const response = await fetch(baseURL + `/audits/deleteAudit?id=${record.id}`, {
				method: 'DELETE',
			});
			const result = await response.json();
			if (result.success) {
				message.success('删除成功');
				fetchData();
			} else {
				message.error('删除信息失败');
			}
		} catch (error) {
			message.error('删除信息失败');
		}
	};

	// 提交审核
	const handleAuditSubmit = async (values: any) => {
		try {
			const adjustedValues = {
				id: selectedUser?.id,
				audit_status: values.audit_status,
				notification: values.notification
			};
			const response = await fetch(baseURL + '/audits/auditUser', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(adjustedValues),
			});
			const result = await response.json();
			if (result.success) {
				if (values.audit_status === '通过') {
					message.success('通过审核');
				} else if (values.audit_status === '拒绝') {
					message.success('拒绝审核');
				}
				setShowAuditModal(false);
				setSelectedUser(null);
				fetchData();
			} else {
				message.error(result.message || '审核失败');
			}
		} catch (error) {
			message.error('审核失败');
		}
	};

	// 打开审核对话框
	const openAuditModal = (record: any) => {
		setSelectedUser({
			id: record.id,
			name: record.name,
			audit_status: record.audit_status || '待审批'
		});
		form.setFieldsValue({ audit_status: record.audit_status || '待审批' });
		setShowAuditModal(true);
	};

	// 表格列配置
	const columns = [
		{
			title: '序号',
			key: 'index',
			align: 'center' as const,
			render: (_: undefined, __: any, index: number) =>
				1 + index,
		},
		{ title: '姓名', dataIndex: 'name', key: 'name', align: 'center' as const },
		{ title: '单位', dataIndex: 'organization', key: 'organization', align: 'center' as const },
		{ title: '协会', dataIndex: 'association', key: 'association', align: 'center' as const },
		{ title: '身份证号', dataIndex: 'id_number', key: 'idNumber', align: 'center' as const },
		{ title: '机号', dataIndex: 'phone', key: 'phone', align: 'center' as const },
		{
			title: '人脸照片',
			dataIndex: 'image',
			key: 'image',
			align: 'center' as const,
			render: (text: string | undefined) => {
				const imageUrl = text ? `data:image/jpeg;base64,${text}` : '';
				return imageUrl ?
					<img src={imageUrl}
						style={{ width: 50, height: 50 }} alt="人脸照片" /> : <span>暂无照片</span>;
			}
		},
		{
			title: '是否车辆进入',
			dataIndex: 'is_car_coming',
			key: 'is_car_coming',
			align: 'center' as const,
			render: (text: boolean) => (text ? '是' : '否'),
		},
		{
			title: '车牌号',
			dataIndex: 'license_plate_number', key: 'license_plate_number', align: 'center' as const
		},
		{
			title: '车牌照片',
			dataIndex: 'license_plate_picture',
			key: 'license_plate_picture',
			align: 'center' as const,
			render: (text: string | undefined) => {
				const imageUrl = text ? `data:image/jpeg;base64,${text}` : '';
				return imageUrl ?
					<img src={imageUrl}
						style={{ width: 50, height: 50 }} alt="车牌照片" /> : <span>暂无照片</span>;
			}
		},
		{
			title: '是否外来人员',
			dataIndex: 'is_outsider',
			key: 'is_outsider',
			align: 'center' as const,
			render: (text: boolean) => (text ? '是' : '否'),
		},
		{ title: '备注', dataIndex: 'remark', key: 'remark', align: 'center' as const },
		{ title: '审核状态', dataIndex: 'audit_status', key: 'audit_status', align: 'center' as const },
		{
			title: '操作',
			key: 'action',
			align: 'center' as const,
			render: (text: any, record: any) => (
				<span>
					<Button icon={<EditOutlined />}
						onClick={() => openAuditModal(record)}>  审核
					</Button>
					<Button
						icon={<DeleteOutlined />}
						onClick={() => showdDeleteConfirm(record)}
						style={{ marginLeft: 8 }}>
						删除
					</Button>
				</span>
			)
		}
	];

	return (
		<>
			<Layout
				style={{
					marginTop: 20,
					borderRadius: '10px',
					backgroundColor: 'white',
					padding: '20px',
					flexDirection: 'column',
					position: 'relative',
				}}
			>
				{contextHolder}
				<Content style={{ position: 'relative' }}>
					<div style={{ marginBottom: 16, display: 'flex', alignItems: 'center' }}>
						<label htmlFor="organizationInput" style={{ marginRight: 8 }}>单位：</label>
						<Input
							id="organizationInput"
							placeholder="请输入单位"
							value={organization}
							onChange={e => setOrganization(e.target.value)}

							style={{ width: 200, marginRight: 16 }}
						/>
						<label htmlFor="associationInput" style={{ marginRight: 8 }}>协会：</label>
						<Input
							id="associationInput"
							placeholder="请输入协会"
							value={association}
							onChange={e => setAssociation(e.target.value)}
							style={{ width: 200, marginRight: 16 }}
						/>
						<Button type="primary" onClick={handleSearch} style={{ marginRight: 8 }}>
							查询
						</Button>
						<Button onClick={handleReset} style={{ marginRight: 8 }}>
							重置
						</Button>
						<Button
							type="primary"
							onClick={handleBatchApprove}
							disabled={selectedRowKeys.length === 0}
						>
							批量通过
						</Button>
					</div>
					<Table
						rowSelection={rowSelection}
						className='personalTable'
						dataSource={data}
						columns={columns}
						loading={loading}
						rowKey="id"
						style={{
							display: 'flex',
							flexDirection: 'column',
							flexGrow: 1,
							overflow: 'hidden'
						}}
						pagination={{
							className: 'pagination',
							pageSize: 10,
							hideOnSinglePage: false,
							onChange: (page) => {
								setCurrentPage(page);
							},
							showTotal: (total) => `总共 ${total} 条`
						}}
						footer={() => (
							<div style={{ height: fillHeight + 'px' }}></div>
						)}
					/>
				</Content>
			</Layout>

			<Modal
				title="审核" open={showAuditModal}
				footer={null} onCancel={() => setShowAuditModal(false)}>
				{selectedUser && (
					<Form form={form} onFinish={handleAuditSubmit}>
						<Form.Item
							label="是否通过"
							name="audit_status"
							rules={[{ required: true, message: '请选择审核状态' }]}
							initialValue="待审核"
						>
							<Radio.Group>
								<Radio value="通过">通过</Radio>
								<Radio value="拒绝">拒绝</Radio>
							</Radio.Group>
						</Form.Item>
						<Form.Item
							label="理由（可选）"
							name="notification"
						>
							<Input.TextArea placeholder="请输入拒绝理由" />
						</Form.Item>
						<Button type="primary" htmlType="submit">
							确认
						</Button>
						<Button onClick={() => setShowAuditModal(false)} style={{ marginLeft: 8 }}>
							取消
						</Button>
					</Form>
				)}
			</Modal>
		</>
	);
};

export default Audits;

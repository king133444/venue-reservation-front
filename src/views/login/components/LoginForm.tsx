import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd'; // 引入 Space 组件
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import api from '@/api';
import { HOME_URL } from '@/config/config';

const LoginForm = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [form] = Form.useForm();
	const [loading, setLoading] = useState<boolean>(false);

	// 登录
	const handleSubmit = async () => {
		const { username, password } = form.getFieldsValue();
		setLoading(true);
		try {
			const response: any = await api.Login({ username, password });
			// 检查登录是否成功
			if (response.data.success) {
				sessionStorage.setItem('username', username); // 根据实际需求决定是否需要
				message.success(response.data.message);
				navigate(location.state?.from || HOME_URL);
			} else {
				// 登录失败，显示错误消息，不跳转页面
				message.error(response.data.message || '登录失败');
			}
		} catch (error) {
			// API调用异常，显示错误消息，不跳转页面
			message.error('登录失败');
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Form
				form={form}
				layout="vertical"
				name="basic"
				labelCol={{ span: 8 }}
				initialValues={{ remember: true }}
				onFinish={handleSubmit}
				size="large"
				autoComplete="on"
				requiredMark={false}
				colon={false}
			>
				<div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '-10px' }}>登录</div>
				<Form.Item
					label="用户名"
					name="username"
					rules={[{ required: true, message: '请输入用户名' }]}
					style={{ marginBottom: '10px' }}
				>
					<Input
						autoComplete="on"
						placeholder="请输入用户名"
						prefix={<UserOutlined rev={undefined} />} />
				</Form.Item>
				<Form.Item
					label="密码"
					name="password"
					rules={[{ required: true, message: '请输入密码' }]}
					style={{ marginBottom: '10px' }}
				>
					<Input.Password
						autoComplete="new-password"
						placeholder="请输入密码"
						prefix={<LockOutlined rev={undefined} />} />
				</Form.Item>
				<Form.Item>
					<br />
					<Button
						type="primary"
						htmlType="submit"
						loading={loading}
						icon={<UserOutlined rev={undefined} />}
						style={{ width: '250px', marginTop: '20px' }}
					>
						登录
					</Button>
				</Form.Item>
			</Form>
		</>
	);
};

export default LoginForm;

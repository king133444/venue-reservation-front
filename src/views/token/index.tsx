import { message } from 'antd';
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';

import api from '@/api/index';

export default function RefreshToken() {
	const navigate = useNavigate();

	const timer = useRef<NodeJS.Timeout | null>(null);

	// 一小时刷新一次令牌
	useEffect(() => {
		timer.current = setInterval(async () => {
			const refreshToken = sessionStorage.getItem('refresh_token');

			if (refreshToken === '') {
				navigate('/login');
			}
			try {
				const result: any = await api.RefreshToken({
					refreshToken: refreshToken
				});
				const { success, data, message: info } = result;
				if (!success) {
					message.error(info);
					sessionStorage.setItem('access_token', '');
					logout();
				} else {
					const newAccessToken = data.accessToken;
					// 不再更新刷新令牌
					sessionStorage.setItem('access_token', newAccessToken);
				}
			} catch {
				message.error('刷新令牌失败，请重新登录');
				navigate('/login');
			}
		}, 3600 * 1000);
		return () => {
			if (timer.current) {
				clearInterval(timer.current);
			}
		};
	});

	const logout = () => {
		sessionStorage.setItem('access_token', '');
		sessionStorage.setItem('refresh_token', '');
		sessionStorage.setItem('selectKey', '');
		navigate('/login');
	};

	return <></>;
}

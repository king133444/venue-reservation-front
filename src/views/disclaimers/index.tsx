import { Button, Form, Input, message } from 'antd';
import React, { useEffect, useState } from 'react';

import api from '@/api';

interface DisclaimerFormValues {
    content: string;
}

const DisclaimerForm: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [latestDisclaimer, setLatestDisclaimer] = useState<string | null>(null);

    useEffect(() => {
        // 获取最新的免责声明
        const fetchLatestDisclaimer = async () => {
            try {
                const response: any = await api.GetDisclaimers({});
                if (response) {
                    setLatestDisclaimer(response.content); // 提取 content 字段
                } else {
                    message.error('获取失败');
                }

            } catch (error) {
                message.error('获取免责声明失败');
            }
        };

        fetchLatestDisclaimer();
    }, []);
    const onFinish = async (values: DisclaimerFormValues) => {
        setLoading(true);
        try {
            const response: any = await api.CreateDisclaimers(values);
            if (response.data) {
                message.success(response.data);
            } else {
                message.error('提交失败');
            }

            // 更新最新的免责声明
            setLatestDisclaimer(values.content);
        } catch (error) {
            message.error('提交失败');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', height: '1000px' }}>
            <h2>最新免责声明</h2>
            <p style={{ whiteSpace: 'pre-wrap' }}>{latestDisclaimer || '暂无免责声明'}</p>

            <Form onFinish={onFinish} layout="vertical">
                <Form.Item
                    name="content"
                    label="请输入免责声明内容"
                    rules={[{ required: true, message: '请输入免责声明内容' }]}
                >
                    <Input.TextArea rows={4} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        提交
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default DisclaimerForm;

import { Button, Form, Input, message } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';

interface DisclaimerFormValues {
    content: string;
}

const DisclaimerForm: React.FC = () => {
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: DisclaimerFormValues) => {
        setLoading(true);
        try {
            const response = await axios.post('http://127.0.0.1:8001/disclaimers', values);
            message.success(response.data);
        } catch (error) {
            message.error('提交失败');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form onFinish={onFinish} layout="vertical" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <Form.Item
                name="content"
                label="免责声明内容"

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
    );
};

export default DisclaimerForm;

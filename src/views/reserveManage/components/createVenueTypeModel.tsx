import { Button, Checkbox, Form, Input, Modal, Radio, TimePicker } from 'antd';
import React from 'react';
interface CreateVenueTypeModalProps {
    isVisible: boolean;
    onClose: () => void;
}

const { RangePicker } = TimePicker;

const CreateVenueTypeModal: React.FC<CreateVenueTypeModalProps> = ({ isVisible, onClose }) => {
    const [form] = Form.useForm();
    const weekDaysOptions = [
        { label: '周一', value: 'monday' },
        { label: '周二', value: 'tuesday' },
        { label: '周三', value: 'wednesday' },
        { label: '周四', value: 'thursday' },
        { label: '周五', value: 'friday' },
        { label: '周六', value: 'saturday' },
        { label: '周日', value: 'sunday' },
    ];

    const handleOk = () => {
        form.submit();
    };

    const handleCancel = () => {
        onClose(); // 使用从props传入的onClose方法来关闭模态框
    };

    const handleSubmit = () => {
        onClose(); // 提交表单后关闭模态框
    };

    return (
        <>
            <Modal
                title="新建场馆类型"
                open={isVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        取消
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleOk}>
                        确认新增
                    </Button>,
                ]}
            >
                <Form form={form} onFinish={handleSubmit} layout="horizontal" autoComplete="off">
                    {/* 场馆类型名称 */}
                    <Form.Item
                        name="venueTypeName"
                        label="场馆类型名称"
                        rules={[{ required: true, message: '请输入场馆类型名称' }]}
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                    >
                        <Input />
                    </Form.Item>

                    {/* 是否适用之后全部日期 */}
                    <Form.Item
                        name="applicableAllDates"
                        label="是否适用之后全部日期"
                        rules={[{ required: true, message: '请选择是否适用之后全部日期' }]}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 18 }}
                    >
                        <Radio.Group>
                            <Radio value={true}>是</Radio>
                            <Radio value={false}>否</Radio>
                        </Radio.Group>
                    </Form.Item>

                    {/* 上午时间段设置 */}
                    <Form.Item
                        name="is_lunchtime_available"
                        label="上午时间段是否可用"
                        labelCol={{ span: 7 }}
                        wrapperCol={{ span: 18 }}
                    >
                        <Radio.Group>
                            <Radio value={true}>是</Radio>
                            <Radio value={false}>否</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        name="morningTime"
                        label="上午时间段设置"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                    >
                        <RangePicker format="HH:mm" />
                    </Form.Item>
                    <Form.Item
                        name="morningNumber"
                        label="上午可预约人数"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                    >
                        <Input type="number" />
                    </Form.Item>

                    {/* 中午时间段设置 */}
                    <Form.Item
                        name="is_lunchtime_available"
                        label="中午时间段是否可用"
                        labelCol={{ span: 7 }}
                        wrapperCol={{ span: 18 }}
                    >
                        <Radio.Group>
                            <Radio value={true}>是</Radio>
                            <Radio value={false}>否</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        name="lunch_time"
                        label="中午时间段设置"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                    >
                        <RangePicker format="HH:mm" />
                    </Form.Item>
                    <Form.Item
                        name="lunchtime_number"
                        label="中午可预约人数"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                    >
                        <Input type="number" />
                    </Form.Item>

                    {/* 下午时间段设置 */}
                    <Form.Item
                        name="is_afternoon_time_available"
                        label="下午时间段是否可用"
                        labelCol={{ span: 7 }}
                        wrapperCol={{ span: 18 }}
                    >
                        <Radio.Group>
                            <Radio value={true}>是</Radio>
                            <Radio value={false}>否</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        name="afternoon_time"
                        label="下午时间段设置"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                    >
                        <RangePicker format="HH:mm" />
                    </Form.Item>
                    <Form.Item
                        name="afternoon_number"
                        label="下午可预约人数"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                    >
                        <Input type="number" />
                    </Form.Item>

                    {/* 晚上时间段设置 */}
                    <Form.Item
                        name="is_evening_time_available"
                        label="晚上时间段是否可用"
                        labelCol={{ span: 7 }}
                        wrapperCol={{ span: 18 }}
                    >
                        <Radio.Group>
                            <Radio value={true}>是</Radio>
                            <Radio value={false}>否</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        name="evening_time"
                        label="晚上时间段设置"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                    >
                        <RangePicker format="HH:mm" />
                    </Form.Item>
                    <Form.Item
                        name="evening_number"
                        label="晚上可预约人数"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                    >
                        <Input type="number" />
                    </Form.Item>

                    {/* 可预约日期 */}
                    <Form.Item
                        name="dates"
                        label="可预约日期"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                    >
                        <Checkbox.Group options={weekDaysOptions} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default CreateVenueTypeModal;

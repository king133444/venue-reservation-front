import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  TimePicker
} from 'antd';
import React, { useState } from 'react';

import api from '@/api';
interface CreateVenueTypeModalProps {
  isVisible: boolean;
  onClose: () => void;
  getInfo: Function;
}

const { RangePicker } = TimePicker;

const CreateVenueTypeModal: React.FC<CreateVenueTypeModalProps> = (
  {
    isVisible,
    onClose,
    getInfo,
  }
) => {
  const [form] = Form.useForm();
  const [isMorningAvailable, setIsMorningAvailable] = useState(true);
  const onAvailabilityChange1 = (e: any) => {

    setIsMorningAvailable(e.target.value);
    if (!e.target.value) {
      form.setFieldsValue({
        morningTime: undefined,
        morningNumber: undefined,
      });
    }
  };
  const [isNoonAvailable, setIsNoonAvailable] = useState(true);
  const onAvailabilityChange2 = (e: any) => {

    setIsNoonAvailable(e.target.value);
    if (!e.target.value) {
      form.setFieldsValue({
        lunch_time: undefined,
        lunchtime_number: undefined,
      });
    }
  };
  const [isANoonAvailable, setIsANoonAvailable] = useState(true);
  const onAvailabilityChange3 = (e: any) => {

    setIsANoonAvailable(e.target.value);
    if (!e.target.value) {
      form.setFieldsValue({
        afternoon_time: undefined,
        afternoon_number: undefined,
      });
    }
  };
  const [isEveningAvailable, setIsEveningAvailable] = useState(true);
  const onAvailabilityChange4 = (e: any) => {

    setIsEveningAvailable(e.target.value);
    if (!e.target.value) {
      form.setFieldsValue({
        evening_time: undefined,
        evening_number: undefined,
      });
    }
  };

  const disabledMorningHours = () => {
    return {
      disabledHours: () => {
        const hours = [];
        for (let i = 0; i < 24; i++) {
          // 禁用8:00到11:00之外的所有小时
          if (i < 8 || i > 11) {
            hours.push(i);
          }
        }
        return hours;
      },
    };
  };
  const disabledNoonHours = () => {
    return {
      disabledHours: () => {
        const hours = [];
        for (let i = 0; i < 24; i++) {
          // 禁用8:00到11:00之外的小时
          if (i < 11 || i > 13) {
            hours.push(i);
          }
        }
        return hours;
      }
    };

  };
  const disabledANoonHours = () => {
    return {
      disabledHours: () => {
        const hours = [];
        for (let i = 0; i < 24; i++) {
          // 禁用8:00到11:00之外的小时
          if (i < 13 || i > 17) {
            hours.push(i);
          }
        }
        return hours;
      }
    };

  };
  const disabledEveningHours = () => {
    return {
      disabledHours: () => {
        const hours = [];
        for (let i = 0; i < 24; i++) {
          // 禁用8:00到11:00之外的小时
          if (i < 17 || i > 21) {
            hours.push(i);
          }
        }
        return hours;
      }
    };

  };
  const weekDaysOptions = [
    { label: '周一', value: 1 },
    { label: '周二', value: 2 },
    { label: '周三', value: 3 },
    { label: '周四', value: 4 },
    { label: '周五', value: 5 },
    { label: '周六', value: 6 },
    { label: '周日', value: 7 },
  ];

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    onClose(); // 使用从props传入的onClose方法来关闭模态框
  };

  const handleSubmit = async () => {
    const data = form.getFieldsValue();
    try {
      const response: any = await api.createReservationInfo({
        venue_name: data.venueTypeName,
        is_applicable_all_future_dates: data.applicableAllDates,
        is_morning_available: data.is_morning_available,
        morning_time_start: data.morningTime?.[0]?.format('HH:mm'),
        morning_time_end: data.morningTime?.[1]?.format('HH:mm'),
        morning_number: Number(data.morningNumber),
        is_lunchtime_available: data.is_lunchtime_available,
        lunchtime_start: data.lunch_time?.[0]?.format('HH:mm'),
        lunchtime_end: data.lunch_time?.[1]?.format('HH:mm'),
        lunchtime_number: Number(data.lunchtime_number),
        is_afternoon_time_available: data.is_afternoon_time_available,
        afternoon_time_start: data.afternoon_time?.[0]?.format('HH:mm'),
        afternoon_time_end: data.afternoon_time?.[1]?.format('HH:mm'),
        afternoon_number: Number(data.afternoon_number),
        is_evening_time_available: data.is_evening_time_available,
        evening_time_start: data.evening_time?.[0]?.format('HH:mm'),
        evening_time_end: data.evening_time?.[1]?.format('HH:mm'),
        evening_number: Number(data.evening_number),
        available_days: data.dates,
      });

      const { success, message: info } = response;
      if (success) {
        message.success(info);
      } else {
        message.error(info);
      }
    } catch (error) {

      message.error('添加失败');
    } finally {
      getInfo();
      setIsMorningAvailable(true);
      setIsNoonAvailable(true);
      setIsANoonAvailable(true);
      setIsEveningAvailable(true);
      form.resetFields();
      onClose();
    }

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
            确认
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
            name="is_morning_available"
            label="上午时间段是否可用"
            initialValue={true}
            rules={[{ required: true }]}
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 18 }}
          >
            <Radio.Group onChange={onAvailabilityChange1}>
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="morningTime"
            label="上午时间段设置"
            rules={isMorningAvailable ? [{ required: true, message: '请选择时间段' }] : []}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
          >
            <RangePicker
              disabled={!isMorningAvailable}
              disabledTime={disabledMorningHours}
              format="HH:mm"
              minuteStep={30}
              hourStep={1}
            />
          </Form.Item>
          <Form.Item
            name="morningNumber"
            label="上午可预约人数"
            rules={isMorningAvailable ? [{ required: true, message: '请选择可预约人数' }] : []}
          // labelCol={{ span: 6 }}
          // wrapperCol={{ span: 18 }}
          >

            <InputNumber style={{ width: '50%' }}
              addonAfter="人"
              disabled={!isMorningAvailable} type="number" />

          </Form.Item>

          {/* 中午时间段设置 */}
          <Form.Item
            name="is_lunchtime_available"
            label="中午时间段是否可用"
            initialValue={true}
            rules={[{ required: true }]}
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 18 }}
          >
            <Radio.Group onChange={onAvailabilityChange2}>
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="lunch_time"
            label="中午时间段设置"
            rules={isNoonAvailable ? [{ required: true, message: '请选择时间段' }] : []}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
          >
            <RangePicker
              disabled={!isNoonAvailable}
              disabledTime={disabledNoonHours}
              format="HH:mm" minuteStep={30}
              hourStep={1} />
          </Form.Item>
          <Form.Item
            name="lunchtime_number"
            label="中午可预约人数"
            rules={isNoonAvailable ? [{ required: true, message: '请选择可预约人数' }] : []}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
          >
            <InputNumber style={{ width: '50%' }} min={0}
              addonAfter="人"
              disabled={!isNoonAvailable} />
          </Form.Item>

          {/* 下午时间段设置 */}
          <Form.Item
            name="is_afternoon_time_available"
            label="下午时间段是否可用"
            initialValue={true}
            rules={[{ required: true }]}
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 18 }}
          >
            <Radio.Group onChange={onAvailabilityChange3}>
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="afternoon_time"
            label="下午时间段设置"
            rules={isANoonAvailable ? [{ required: true, message: '请选择时间段' }] : []}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
          >
            <RangePicker
              disabled={!isANoonAvailable}
              disabledTime={disabledANoonHours}
              format="HH:mm"
              minuteStep={30}
              hourStep={1} />
          </Form.Item>
          <Form.Item
            name="afternoon_number"
            label="下午可预约人数"
            rules={isANoonAvailable ? [{ required: true, message: '请选择可预约人数' }] : []}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
          >
            <InputNumber style={{ width: '50%' }} min={0}
              addonAfter="人"
              disabled={!isANoonAvailable} />

          </Form.Item>

          {/* 晚上时间段设置 */}
          <Form.Item
            name="is_evening_time_available"
            label="晚上时间段是否可用"
            initialValue={true}
            rules={[{ required: true }]}
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 18 }}
          >
            <Radio.Group onChange={onAvailabilityChange4}>
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="evening_time"
            label="晚上时间段设置"
            rules={isEveningAvailable ? [{ required: true, message: '请选择时间段' }] : []}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
          >
            <RangePicker
              disabled={!isEveningAvailable}
              disabledTime={disabledEveningHours}
              format="HH:mm"
              minuteStep={30}
              hourStep={1}
            />
          </Form.Item>
          <Form.Item
            name="evening_number"
            label="晚上可预约人数"
            rules={isEveningAvailable ? [{ required: true, message: '请选择可预约人数' }] : []}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
          >
            <InputNumber style={{ width: '50%' }} min={0} addonAfter="人"
              disabled={!isEveningAvailable} />

          </Form.Item>

          {/* 可预约日期 */}
          <Form.Item
            name="dates"
            label="可预约日期"
            rules={[{ required: true, message: '请选择可预约日期' }]}
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

import React, { useState } from 'react';
import { Layout, Table, Button, Modal, Form, Input, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
const dataSource = [{
  key: '1', photo: 'URL', name: '张三', phone: '12345678901', department: 'IT部门',
}];
const PersonalManage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  // const [currentRecord, setCurrentRecord] = useState({});

  const [form] = Form.useForm();

  const showModal = (record: React.SetStateAction<any>) => {
    form.setFieldsValue(record);
    // setCurrentRecord(record);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    { title: '序号', dataIndex: 'key', key: 'key' },
    {
      title: '个人照片',
      dataIndex: 'photo',
      key: 'photo',
      render: (text: string | undefined) => <img src={text} style={{ width: '50px', height: '50px' }} alt="avatar" />
    },
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '手机号', dataIndex: 'phone', key: 'phone' },
    { title: '单位部门', dataIndex: 'department', key: 'department' },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => <Button onClick={() => showModal(record)}>编辑</Button>,
    },
  ];

  const uploadProps = {
    beforeUpload: () => {
      // 实现文件上传逻辑
      return false;
    },
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={() => showModal({})}>添加用户</Button>
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />}>文件批量上传</Button>
        </Upload>
      </div>
      <br />
      <Layout style={{ borderRadius: '10px', backgroundColor: 'white', overflow: 'auto', height: '70vh' }}>
        <Table dataSource={dataSource} columns={columns} />
      </Layout>
      <Modal title="编辑人员信息" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="手机号" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="department" label="单位部门" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="photo" label="个人照片">
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>上传照片</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PersonalManage;

import './styles/styles.less';

import {
  ExclamationCircleTwoTone,
  LockOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Button, Form, Input, Layout, message, Modal, Select, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';

import api from '../../api/index';

const AccountManagement = () => {
  const [form] = Form.useForm();
  const [formAdd] = Form.useForm();
  const [data, setData] = useState([]);
  const [total, setTotal] = useState();
  const [editId, setEditId] = useState<number>();
  const [role, setRole] = useState<string>('1');
  const [tableLoading, setTableLoading] = useState(false);
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [visibleAdd, setVisibleAdd] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [roles, setRoles] = useState<any>([]);
  const [roleLoading, setRoleLoading] = useState<boolean>(true);

  // 获取用户列表信息
  const getAccouts = async () => {
    try {
      const result: any = await api.GetAllAccount({});
      const { success, data, message: info } = result;
      if (success) {
        setData(data.accounts);
        setTotal(data.total);
      } else {
        message.error(info);
      }
    } catch (error) {
      message.error('获取失败');
    } finally {
      setTableLoading(false);
    }
  };

  const getRoles = async () => {
    try {
      const result: any = await api.GetAllRole({});
      const { success, data, message: info } = result;
      if (success) {
        setRoles(data.roles);
      } else {
        message.error(info);
      }
    } catch (error) {
      message.error('获取失败');
    } finally {
      setRoleLoading(false);
    }
  };
  // 修改框
  const showEditModal = async (_text: any, record: any) => {
    setEditId(record.id);
    setVisibleEdit(true);
  };
  // 删除框
  const showDeleteModal = (_text: any, record: any) => {
    // 打开删除弹窗
    setVisibleDelete(true);
    setEditId(record.id);

  };
  // 确认修改
  const handleEdit = async () => {
    await form.validateFields();
    try {
      const user = {
        id: editId,
        password: form.getFieldValue('password')
      };
      const result: any = await api.UpdateAccount(user);

      const { success, message: info } = result;
      if (success) {
        message.success('修改密码成功');
      } else {
        message.error(info);
      }
    } catch (error: any) {
      message.error(error.response.data.message);
    } finally {
      setVisibleEdit(false);
      getAccouts();
      form.resetFields();
    }
  };
  const handleCancle = () => {
    setVisibleEdit(false);
    form.resetFields();
  };
  useEffect(() => {
    setTableLoading(true);
    getAccouts();
    getRoles();
  }, []);
  const handleSubmit = async () => {
    const { account, password } = formAdd.getFieldsValue();

    try {
      setLoading(true);
      const result: any = await api.CreateAccount({
        role_id: Number(role),
        account: account,
        password,
      });
      const { success, message: info } = result;

      if (success) {
        message.success(info);
        getAccouts();
      } else {
        message.error(info);
      }
    } catch (error) {
      message.error('添加失败');
    } finally {
      setLoading(false);
      setVisibleAdd(false);
      getAccouts();
      formAdd.resetFields();
    }
  };
  // 确认删除
  const handleOkDeleteUser = async () => {
    try {
      const user = {
        id: editId,
      };
      const result: any = await api.DeleteAccount(user);
      const { success, message: info } = result;
      if (success) {
        message.success(info);
      } else {
        message.error(info);
      }
    } catch (error: any) {
      message.error(error.response.data.message);
    } finally {
      setVisibleDelete(false);
      getAccouts();
    }
  };
  const columns: ColumnsType<any> = [
    {
      title: '序号',
      dataIndex: 'id',
      align: 'center',
      key: 'id',
      width: '10%',
      render: (_text, record, index) => {
        if (record) return index + 1;
      },
    },
    {
      title: '账号',
      dataIndex: 'account',
      align: 'center',
      key: 'account',
    },
    {
      title: '角色',
      dataIndex: ['role', 'role'],
      align: 'center',
      key: 'role',
      render: (record) => {
        return role === undefined ? '-' : record;
      }
    },
    {
      title: '操作',
      dataIndex: 'operation',
      align: 'center',
      width: '50%',
      render: (_text, record) => (
        <Space size="large">
          <a
            onClick={() => {
              showEditModal(_text, record);
            }}
          >
            修改
          </a>
          <a
            onClick={() => {
              showDeleteModal(_text, record);
            }}
          >
            删除
          </a>
        </Space>
      ),
    },
  ];
  const validateConfirmPassword = ({ getFieldValue }: any) => ({
    validator(_rule: any, value: any) {
      if (!value || getFieldValue('password') === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error('两次输入的密码不一致'));
    },
  });
  const handleChange = (value: string) => {
    setRole(value);
  };

  return (
    <Layout >
      <Layout.Content style={{
        position: 'relative',
        height: '800px',
        backgroundColor: 'white',
      }}>
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Button
            type='primary'
            onClick={() => {
              setVisibleAdd(true);
            }}
          >
            添加账号
          </Button>
        </div>
        <br />
        <Table
          className='custom-table'
          rowKey="id"
          dataSource={data}
          columns={columns}
          loading={tableLoading}
          bordered={true}
          pagination={
            {
              total: total,
              showTotal: (total) => `总共 ${total} 条数据`,
              defaultPageSize: 5,
              defaultCurrent: 1
            }}
        />
        <Modal
          title='修改密码'
          onOk={handleEdit}
          open={visibleEdit}
          onCancel={handleCancle}
        >
          <Form
            title='修改'
            form={form}
          >
            {/* <Form.Item
            label="账号："
            name="name"
            rules={[
              {
                required: true,
                message: '请输入账号',
              },
            ]}
          >
            <Input placeholder="请输入账号" />
          </Form.Item> */}
            <Form.Item
              label="新密码"
              labelCol={{ span: 4, offset: 0 }}
              name="password"
              rules={[
                {
                  required: true,
                  message: '请输入密码',
                },
                {
                  min: 8,
                  message: '密码不能小于8位字符',
                },
              ]}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>
            <Form.Item
              name="confirm"
              label="确认密码"
              rules={[{ required: true, message: '请确认密码' }, validateConfirmPassword,]}
              style={{ marginBottom: '10px' }}
            >
              <Input.Password
                autoComplete="new-password"
                placeholder="输入确认密码"
              />
            </Form.Item>

          </Form>
        </Modal>
        <Modal
          title={
            <Space>
              <ExclamationCircleTwoTone rev={undefined} />
              删除账号
            </Space>
          }
          open={visibleDelete}
          onOk={handleOkDeleteUser}
          onCancel={() => { setVisibleDelete(false); }}
          okText="确定"
          cancelText="取消"

        >
          删除该账号，您确认要删除嘛？
        </Modal>
        <Modal
          open={visibleAdd}
          okText='添加账号'
          confirmLoading={loading}
          onCancel={() => { setVisibleAdd(false); }}
          onOk={handleSubmit}
        >
          <Form
            form={formAdd}
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
            <Form.Item
              label="账号"
              name="account"
              rules={[{ required: true, message: '请输入账号' }]}
              style={{ marginBottom: '10px' }}
            >
              <Input placeholder="请输入账号" prefix={<UserOutlined rev={undefined} />} />
            </Form.Item>
            <Form.Item
              label="密码"
              name="password"
              rules={[
                {
                  required: true,
                  message: '请输入密码',
                },
                {
                  min: 8,
                  message: '密码不能小于8位字符',
                },
              ]}
              style={{ marginBottom: '10px' }}
            >
              <Input.Password
                autoComplete="new-password"
                placeholder="请输入密码"

                prefix={<LockOutlined rev={undefined} />}
              />
            </Form.Item>
            <Form.Item
              name="confirm"
              label="确认密码"
              rules={[{ required: true, message: '请确认密码' }, validateConfirmPassword]}
              style={{ marginBottom: '10px' }}
            >
              <Input.Password
                autoComplete="new-password"
                placeholder="输入确认密码"
                prefix={<LockOutlined rev={undefined} />}
              />
            </Form.Item>
            <Form.Item
              label="角色"
              name="role"
              rules={[{ required: true, message: '请选择角色' }]}
              style={{ marginBottom: '10px' }}
            >
              <Select
                loading={roleLoading}
                style={{ width: 240 }}
                placeholder='请选择角色'
                onChange={handleChange}
              >
                {roles.map((item: any, key: any) => (
                  <Select.Option key={key} value={item?.id}>
                    {item?.role}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </Layout.Content>
    </Layout>

  );
};

export default AccountManagement;

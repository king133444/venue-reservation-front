import './styles/styles.less';

import {
  ExclamationCircleTwoTone,
  RedoOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { Button, Col, Form, Input, Layout, message, Modal, Row, Select, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';

import api from '@/api';
const RoleManagement = () => {
  const [data, setData] = useState([]);
  const [currentData, setCurrentData] = useState([]);
  const [total, setTotal] = useState<number>();
  const [tableLoading, setTableLoading] = useState(false);

  const [selectedRole, setSelectedRole] = useState(undefined);
  const [visibleAdd, setVisibleAdd] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [permissionSelect, setPermissionSelect] = useState<string[]>([]);

  const [editId, setEditId] = useState<number>();
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [formAdd] = Form.useForm();
  const columns: ColumnsType<any> = [
    {
      title: '序号',
      dataIndex: 'id',
      align: 'center',
      key: 'id',
      width: '10%',
    },
    {
      title: '角色名',
      dataIndex: 'role',
      align: 'center',
      width: '15%',
    },
    {
      title: '权限',
      dataIndex: 'menu_arr',
      align: 'center',
      key: 'menu_arr',
      width: '50%',
      render: (record: string) => {
        const menu = JSON.parse(record);
        if (Array.isArray(menu)) {
          return (
            <Space>
              {menu.map((item, index) => (
                <span key={index} style={{ marginRight: '5px' }}>{item}
                  {index < menu.length - 1 ? ',' : ''}</span>
              ))}
            </Space>
          );
        }
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
  // 修改框
  const showEditModal = async (_text: any, record: any) => {
    setEditId(record.id);
    const menus = JSON.parse(record.menu_arr);
    formAdd.setFieldsValue({
      role: record.role,
      permission: menus,
    });
    setVisibleEdit(true);
    setVisibleAdd(true);
  };
  // 删除框
  const showDeleteModal = (_text: any, record: any) => {
    // 打开删除弹窗
    setVisibleDelete(true);
    setEditId(record.id);

  };
  // 获取角色列表信息
  const getRoles = async () => {
    try {
      const result: any = await api.GetAllRole({});
      const { success, data, message: info } = result;
      if (success) {
        setData(data.roles);
        setCurrentData(data.roles);
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
  useEffect(() => {
    setTableLoading(true);
    getRoles();
  }, []);
  const onChange = (value: any) => {
    setSelectedRole(value);

  };

  const onSearch = () => {
    const filteredData = data.filter((item: any) => item.role.includes(selectedRole));
    setCurrentData(filteredData);
    setTotal(filteredData.length);
  };

  const handleReset = () => {
    setSelectedRole(undefined);
    setCurrentData(data);
    setTotal(data.length);
  };
  // 创建角色
  const handleSubmit = async () => {
    const { role } = formAdd.getFieldsValue();
    const arrayString = JSON.stringify(permissionSelect);
    let params: any = {
      role: role,
      menu_arr: arrayString,
    };
    if (visibleEdit) {
      params.id = editId;
      try {
        setLoading(true);
        const result: any = await api.UpdateRole(params);
        const { success, message: info } = result;

        if (success) {
          message.success(info);
          getRoles();
        } else {
          message.error(info);
        }
      } catch (error) {
        message.error('修改失败');
      } finally {
        setLoading(false);
        setVisibleAdd(false);
        getRoles();
        formAdd.resetFields();
      }
    } else {
      try {
        setLoading(true);
        const result: any = await api.CreateRole(params);
        const { success, message: info } = result;

        if (success) {
          message.success(info);
          getRoles();
        } else {
          message.error(info);
        }
      } catch (error) {
        message.error('添加失败');
      } finally {
        setLoading(false);
        setVisibleAdd(false);
        getRoles();
        formAdd.resetFields();
      }
    }

  };
  const handleChange = (value: string[]) => {
    setPermissionSelect(value);

  };
  const handleDelete = async () => {
    try {
      const user = {
        id: editId,
      };
      const result: any = await api.DeleteRole(user);
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
      getRoles();
    }
  };
  const options = [
    { label: '场馆动态', value: '场馆动态' },
    { label: '预约管理', value: '预约管理' },
    { label: '预约查看', value: '预约查看', disabled: true },
    { label: '人员管理', value: '人员管理' },
    { label: '申请审核', value: '申请审核' },
    { label: '免责设置', value: '免责设置' },
    { label: '权限管理', value: '权限管理' },
  ];
  return (
    <Layout >

      <Layout.Content style={{
        position: 'relative',
        height: '800px',
        backgroundColor: 'white',
      }}>
        <Row style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
          <Col>
            <Button
              type='primary'
              onClick={() => {
                setVisibleAdd(true);
                setVisibleEdit(false);
              }}
            >
              新增角色
            </Button>
          </Col>
          <Col style={{ justifyContent: 'flex-end' }}>
            角色：
            <Select
              placeholder="请选择角色"
              optionFilterProp="label"
              loading={tableLoading}
              onChange={onChange}
              value={selectedRole}
              style={{ width: '250px' }}

            >
              {data.map((item: any) => (
                <Select.Option key={item.id} value={item.role}>{item.role}</Select.Option>
              ))}
            </Select>
            <Button
              type="primary"
              style={{ marginLeft: '20px' }}
              icon={<SearchOutlined />}
              onClick={onSearch}
            >
              搜索
            </Button>
            <Button
              style={{ marginLeft: '20px' }}
              icon={<RedoOutlined />}
              onClick={handleReset}
            >
              重置
            </Button>
          </Col>

        </Row>
        <Table
          className='custom-table'
          loading={tableLoading}
          bordered={true}
          dataSource={currentData}
          columns={columns}
          pagination={
            {
              total: total,
              showTotal: (total) => `总共 ${total} 条数据`,
              defaultPageSize: 5,
              defaultCurrent: 1
            }}
        />
      </Layout.Content>
      <Modal
        open={visibleAdd}
        title={visibleEdit ? '修改角色' : '新增角色'}
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
          size="large"
          autoComplete="on"
          requiredMark={false}
          colon={false}
        >
          <Form.Item
            label="角色名"
            name="role"
            rules={[{ required: true, message: '请输入角色名' }]}
            style={{ marginBottom: '10px' }}
          >
            <Input placeholder="请输入角色名" />
          </Form.Item>
          <Form.Item
            label="分配权限"
            name="permission"
            rules={[
              {
                required: true,
                message: '请选择权限',
              },
            ]}
            style={{ marginBottom: '10px' }}
          >
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="请选择分配的权限"
              onChange={handleChange}
              value={permissionSelect}
              options={options}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={
          <Space>
            <ExclamationCircleTwoTone rev={undefined} />
            删除角色
          </Space>
        }
        open={visibleDelete}
        onOk={handleDelete}
        onCancel={() => { setVisibleDelete(false); }}
        okText="确定"
        cancelText="取消"

      >
        删除该角色，您确认要删除嘛？
      </Modal>
    </Layout>

  );
};

export default RoleManagement;

import { useState } from "react";
import { Button, Form, Input, Modal, Select, message } from "antd"; // 引入 Space 组件
import { useLocation, useNavigate } from "react-router-dom";
import { HOME_URL } from "@/config/config";
import { UserOutlined, LockOutlined, UserAddOutlined } from "@ant-design/icons";
import api from "@/api";

interface LocationState {
  from?: string;
}

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [register, setRegister] = useState(false);

  // 登录
  const handleSubmit = async () => {
    const { username, password, confirm, email, role } = form.getFieldsValue();
    if (register) {
      if (password !== confirm) {
        form.setFields([
          {
            name: 'confirm',
            errors: ['密码和确认密码不一致'],
          },
        ]);
        return;
      }
      try {
        setLoading(true);
        const result: any = await api.Signup({
          name: username,
          password,
          email: email,
          roleId: role,
        })
        const { success } = result;

        if (success) {
          message.success("添加用户成功");
          setRegister(false);
        } else {
          message.error('添加用户失败')
        }
      } catch (error) {
        message.error('添加用户失败');
        console.log('error',error);
      } finally {
        setLoading(false);

      }
    }
    else {
      try {
        setLoading(true);
        // const result: any = await api.Login({
        //   name: username,
        //   password
        // })
        // const { success, data, message: info } = result

          sessionStorage.setItem('username', username)
          sessionStorage.setItem('email', email)
          sessionStorage.setItem('roleId', '1')
          sessionStorage.setItem('balance', '12')

          sessionStorage.setItem('id', '1')
          message.success("登录成功！");
          // 检查路由状态中是否有 'from' 属性
          const state = location.state as LocationState;
          if (state?.from) {
            // 如果有，跳转回用户试图访问的页面
            navigate(state.from);
          } else {
            // 如果没有，跳转到默认页面，例如首页
            navigate(HOME_URL);
          }
          navigate(HOME_URL);
       
      } catch (error: any) {
        console.log(error);
        message.error(error.response.data.message)
      }
      finally {
        setLoading(false);
      }
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
        <div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '-10px' }}>
          登录
        </div>
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: '请输入用户名' }]}
          style={{ marginBottom: '10px' }}
        >
          <Input autoComplete="on" placeholder="请输入用户名" prefix={<UserOutlined rev={undefined} />} />
        </Form.Item>
        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: '请输入密码' }]}
          style={{ marginBottom: '10px' }}
        >
          <Input.Password autoComplete="new-password" placeholder="请输入密码" prefix={<LockOutlined rev={undefined} />} />
        </Form.Item>
        <Form.Item>
          <br />
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            icon={<UserOutlined rev={undefined} />}
            style={{ width: '16vw', marginTop: '2vh' }}
          >
            登录
          </Button>
          <br />
          <Button
            type="text"
            onClick={() => {
              setRegister(true);
            }}
            style={{ marginLeft: '5vw', marginTop: '2vh' }}
            icon={<UserAddOutlined rev={undefined} />}
          >
            注册
          </Button>
        </Form.Item>
      </Form>
      <Modal
        open={register}
        okText='注册'
        onCancel={() => { setRegister(false) }}
        onOk={handleSubmit}
      >
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
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
            style={{ marginBottom: '10px' }}
          >
            <Input placeholder="请输入用户名" prefix={<UserOutlined rev={undefined} />} />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
            style={{ marginBottom: '10px' }}
          >
            <Input.Password autoComplete="new-password" placeholder="请输入密码" prefix={<LockOutlined rev={undefined} />} />
          </Form.Item>
          <Form.Item
            name="confirm"
            label="确认密码"
            rules={[{ required: true, message: '请确认密码' }]}
            style={{ marginBottom: '10px' }}
          >
            <Input.Password autoComplete="new-password" placeholder="输入确认密码" prefix={<LockOutlined rev={undefined} />} />
          </Form.Item>
          <Form.Item
            label="邮箱"
            name="email"
            // rules={[{ required: true, message: '请输入邮箱' }]}
            style={{ marginBottom: '10px' }}
          >
            <Input placeholder="请输入邮箱（选填）" prefix={<UserOutlined rev={undefined} />} />
          </Form.Item>
          <Form.Item
            label="角色"
            name="role"
            rules={[{ required: true, message: '请选择角色' }]}
            style={{ marginBottom: '10px' }}
          >
            <Select
              defaultValue={1}
              style={{ width: 240 }}
              options={[
                { value: 1, label: '管理员' },
                { value: 2, label: '经理' },
                { value: 7, label: '游客' },
                { value: 3, label: '维修人员' },
                { value: 4, label: '检查人员' },
                { value: 5, label: '采购人员' },
                { value: 6, label: '设备供应商' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );

};

export default LoginForm;

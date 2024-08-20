import { useState } from "react";
import { Button, Form, Input, message } from "antd"; // 引入 Space 组件
import { useLocation, useNavigate } from "react-router-dom";
import { HOME_URL } from "@/config/config";
import { UserOutlined, LockOutlined } from "@ant-design/icons"; 

interface LocationState {
  from?: string;
}

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);

  // 登录
  const handleSubmit = async () => {
    const { username, password  } = form.getFieldsValue();
    
      try {
        setLoading(true);
        // const result: any = await api.Login({
        //   name: username,
        //   password
        // })
        // const { success, data, message: info } = result

          sessionStorage.setItem('username', username)
          sessionStorage.setItem('email', password)
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

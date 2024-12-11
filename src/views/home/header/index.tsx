import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Layout, Popover, Row } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;
export default function LayoutHeader() {
  const navigate = useNavigate();
  const id = sessionStorage.getItem('id') ?? '暂无';
  const role = sessionStorage.getItem('role') ?? '暂无';
  const name = sessionStorage.getItem('name') ?? '暂无';
  const logout = () => {
    sessionStorage.setItem('id', '');
    sessionStorage.setItem('role', '');
    sessionStorage.setItem('name', '');
    sessionStorage.setItem('auth', '');
    navigate('/login');
  };
  return (
    <>
      <Header
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          width: '100%',
          paddingTop: '10px',
          paddingLeft: '20px',
          paddingRight: '20px',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#FFFFFF'
        }}
      >
        <Popover
          content={
            <Row style={{ width: '300px', }} justify="start" align="middle">
              {/* 头像列 */}
              <Col
                span={8}
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Avatar
                  style={{ backgroundColor: '#87d068' }}
                  size={64}>
                  {role} {/* 假设头像显示角色名的首字母 */}
                </Avatar>
              </Col>
              {/* 信息列 */}
              <Col span={16}>
                {/* ID 和 角色名 */}
                <div style={{ padding: '0 10px' }}>
                  <p
                    style={{ margin: '5px 0', fontSize: '16px', fontWeight: 'bold' }}>ID: {id}
                  </p>
                  <p
                    style={{ margin: '5px 0', fontSize: '16px', fontWeight: 'bold' }}>账号: {name}
                  </p>
                  <p style={{
                    margin: '5px 0', fontSize: '16px', fontWeight: 'bold'
                  }}>身份: {role}</p>
                </div>
                {/* 按钮 */}
                <Row
                  justify="space-around"
                ><Col>
                    <Button type="link">
                      修改密码
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      type="link"
                      onClick={() => {
                        logout();
                      }}
                    >
                      退出
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          }
          trigger="click"
        >
          <Avatar
            style={{ backgroundColor: '#87d068' }}
            icon={<UserOutlined />} />
        </Popover>

      </Header>
    </>
  );
}

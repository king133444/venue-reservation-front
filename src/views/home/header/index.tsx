import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Layout, Popover, Row } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;
export default function LayoutHeader() {
  const navigate = useNavigate();

  const logout = () => {
    sessionStorage.setItem('access_token', '');
    sessionStorage.setItem('refresh_token', '');
    sessionStorage.setItem('selectKey', '');
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
            <Row style={{ width: '300px', height: '180px' }} justify={'center'}>
              <Col
                span={12}
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Avatar
                  style={{ marginRight: 30, marginBottom: 30, backgroundColor: '#87d068' }}
                  size={64}>
                  管理员
                </Avatar>
              </Col>
              <Col span={12}>
                <Row align="middle" style={{ marginTop: '2vh' }}>
                  <Col span={8} style={{ fontSize: 14 }}>
                    身份：
                  </Col>
                  <Col span={16}>管理员</Col>
                </Row>
                <Row align="middle" style={{ marginTop: '2vh' }}>
                  <Col span={8} style={{ fontSize: 14 }}>
                    用户名:
                  </Col>
                  <Col span={16}>admin</Col>
                </Row>
                <Row align="middle" style={{ marginTop: '2vh' }}>
                  <Col span={8} style={{ fontSize: 14 }}>
                    邮箱:
                  </Col>
                  <Col span={16} style={{ fontSize: 14 }}>
                    123456
                  </Col>
                </Row>
              </Col>
              <Row
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginLeft: '2vw',
                  marginTop: '2vh'
                }}
              >
                <Col style={{ marginRight: '50px' }}>
                  <Button
                    type="primary"
                    size="small"
                  // style={{ width: '6vw' }}
                  >
                    修改密码
                  </Button>
                </Col>
                <Col>
                  <Button
                    type="text"
                    size="small"
                    // style={{ width: '6vw' }}
                    onClick={() => {
                      logout();
                    }}
                  >
                    登出
                  </Button>
                </Col>
              </Row>
            </Row>
          }
          trigger="click"
        >
          <Avatar
            style={{ marginRight: 40, backgroundColor: '#87d068' }}
            icon={<UserOutlined rev={undefined} />} />
        </Popover>
      </Header>
    </>
  );
}

import {  Breadcrumb, Layout } from 'antd';
import {  HomeOutlined} from '@ant-design/icons';

const { Content } = Layout;

const ProjectManage = () => {
 
  return (
    <>
      <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Breadcrumb
          items={[
            {
              href: '#/home',
              title: (
                <>
                  <HomeOutlined rev={undefined} />
                  <span>主菜单</span>
                </>
              ),
            },
            {
              title: (
                <>
                  <span>场馆动态</span>
                </>
              ),
            },
          ]}
        />
        {/* <Button
          onClick={() => {
          
          }}
        >添加用户
        </Button> */}
      </div>
      <br />
      <Layout style={{ borderRadius: '10px', backgroundColor: 'white', overflow: 'auto', height: '70vh' }}>
    <Content style={{ padding: '0 50px', borderRadius: '10px' }}>
     
    </Content>
  </Layout>
    </div>
    </>

  );
};

export default ProjectManage;

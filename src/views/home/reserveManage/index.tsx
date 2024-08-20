import React from 'react';
import { Breadcrumb, Layout } from 'antd';
import { HomeOutlined } from '@ant-design/icons'
const { Content } = Layout;

const ReserveManage: React.FC = () => (
  <><div>
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
          // href: '', // 或者设置为空字符串，保持当前页面
          title: (
            <>

              <span>预约管理</span>
            </>
          ),
        },
      ]} />
  </div>
  <br />
  <Layout style={{ borderRadius: '10px', backgroundColor: 'white', overflow: 'auto', height: '70vh' }}>
    <Content style={{ padding: '0 50px', borderRadius: '10px' }}>
     
    </Content>
  </Layout>
  </>
);

export default ReserveManage;

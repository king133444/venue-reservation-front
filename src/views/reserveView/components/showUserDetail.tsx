import { Button, Layout, message, Table, Tabs } from 'antd';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useState } from 'react';
dayjs.locale('zh-cn');
import api from '@/api';

const { TabPane } = Tabs;

interface Props {
  setShow: Function;
  activeKey: string;
  handleKeyChange: (value: string) => void;
  queryDate: any;
}
const columns = [
  {
    title: '序号',
    dataIndex: 'key',
    key: 'key',
    render: (_: undefined, __: any, index: number) => 1 + index,
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '单位',
    dataIndex: 'organization',
    key: 'organization',
  },
  {
    title: '协会',
    dataIndex: 'association',
    key: 'association',
    render: (record: null) => {
      return record === null ? '-' : record;
    }
  },
  {
    title: '时间',
    dataIndex: 'appointmentDate',
    key: 'appointmentDate',
    render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
  },
  {
    title: '身份证号',
    dataIndex: 'idNumber',
    key: 'idNumber',
  },
  {
    title: '电话',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: '车牌号',
    dataIndex: 'licensePlateNumber',
    key: 'licensePlateNumber',
    render: (record: null) => {
      return record === null ? '-' : record;
    }
  },
];

const ShowUserDetail: React.FC<Props> = ({ setShow, activeKey, handleKeyChange, queryDate }) => {
  const [details, setDetails] = useState<any[]>([]);
  const [availableNumber, setAvailableNumber] = useState<number>(0);
  // 获取所有场馆预约配置
  const getReservations = useCallback(async (qData: any) => {
    try {
      const response: any = await api.queryReservationDetails(qData);
      const { success, message: info, data } = response;
      if (success) {
        setDetails(data.details);
        setAvailableNumber(data.avaliableNumber !== undefined ? data.avaliableNumber : 0);
        // message.success(info);
      } else {
        message.info(info);
      }
    } catch (error) {
      message.error('获取详情失败，请稍后再试');
    }
  }, []);

  useEffect(() => {
    getReservations(queryDate);
  }, [getReservations, queryDate]);
  return (
    <Layout style={{
      marginTop: 20,
      borderRadius: '10px',
      backgroundColor: 'white',
      flexDirection: 'column',
      position: 'relative',
      height: '800px'
    }}>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button type='link' onClick={() => setShow(false)}> 关闭</Button>
      </div>
      <h3>查看预约详情</h3>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <span>
          <Tabs activeKey={activeKey} onChange={handleKeyChange}>
            <TabPane tab="上午" key='1' />
            <TabPane tab="中午" key='2' />
            <TabPane tab="下午" key='3' />
            <TabPane tab="晚上" key='4' />
          </Tabs>
        </span>
        <span style={{ display: 'flex', alignItems: 'center', marginRight: '100px' }}>
          <p>{
            (
              () => {
                switch (activeKey) {
                  case '1':
                    return '上午';
                  case '2':
                    return '中午';
                  case '3':
                    return '下午';
                  case '4':
                    return '晚上';
                }

              })()
          }已预约人数: {details.length} 人</p>
          <p style={{ marginLeft: '20px' }}>{
            (
              () => {
                switch (activeKey) {
                  case '1':
                    return '上午';
                  case '2':
                    return '中午';
                  case '3':
                    return '下午';
                  case '4':
                    return '晚上';
                }

              })()
          }可预约人数: {availableNumber} 人</p>
        </span>
      </div>

      <Table columns={columns} dataSource={details} />
    </Layout>
  );
};

export default ShowUserDetail;

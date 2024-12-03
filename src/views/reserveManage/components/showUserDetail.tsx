import { Table, Tabs } from 'antd';
import React from 'react';

const { TabPane } = Tabs;

interface Props {
    setShow: Function;
    activeKey: string;
    setActivateKey: (value: string) => void;
}
const columns = [
    {
        title: '序号',
        dataIndex: 'key',
        key: 'key',
    },
    {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '单位',
        dataIndex: 'unit',
        key: 'unit',
    },
    {
        title: '协会',
        dataIndex: 'association',
        key: 'association',
    },
    {
        title: '时间',
        dataIndex: 'time',
        key: 'time',
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
        dataIndex: 'licensePlate',
        key: 'licensePlate',
    },
];

const ShowUserDetail: React.FC<Props> = ({ setShow, activeKey, setActivateKey }) => {

    return (
        <div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <a onClick={() => setShow(false)}> 关闭</a>
            </div>
            <h3>查看预约详情</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <span>
                    <Tabs activeKey={activeKey} onChange={setActivateKey}>
                        <TabPane tab="上午" key='1' />
                        <TabPane tab="中午" key='2' />
                        <TabPane tab="下午" key='3' />
                        <TabPane tab="晚上" key='4' />
                    </Tabs>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', marginRight: '100px' }}>
                    <p>上午预约人数: 10</p>
                    <p style={{ marginLeft: '20px' }}>上午可预约人数: 5</p>
                </span>
            </div>

            <Table columns={columns} />
        </div>
    );
};

export default ShowUserDetail;

import './reserveManage.less';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');
import {
  Button, Calendar, ConfigProvider, DatePicker, Descriptions,
  Layout, message, Modal, Select, Table, Tag
} from 'antd';
import locale from 'antd/locale/zh_CN';
import axios from 'axios';
import dayjs from 'dayjs';
// import type { SetStateAction } from 'react';
import { useCallback, useEffect, useState } from 'react';
const { Option } = Select;

import { RedoOutlined } from '@ant-design/icons';

import DateManage from '../dateManage';
import SetReservationModal from '../reservePeoples';
const { Content } = Layout;

const ReserveManage = () => {
  const [reservations, setReservations] = useState<any>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSettingModalVisible, setIsSettingModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(0);
  const [userDetails, setuserDetails] = useState<any>([]);
  const [filterDate, setFilterDate] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSportType, setFilterSportType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowHeight = 90;
  const totalPages = Math.ceil(reservations.length / 10);
  const isLastPage = currentPage === totalPages;
  const dataOnLastPage = reservations.length % 10 || 10;
  const actualDataCount = isLastPage ? dataOnLastPage : 10;
  const fillHeight = isLastPage ? (10 - actualDataCount) * rowHeight : 0;
  const [isCalendarModalVisible, setIsCalendarModalVisible] = useState(false);
  const [selectedDateReservations, setSelectedDateReservations] = useState([]);
  const [selectedDateCount, setSelectedDateCount] = useState(0);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  // 处理设置预约人数的逻辑
  const handleOkSetting = async (sportType: string, availablePeoples: number) => {
    try {
      const response = await axios.post(
        'http://127.0.0.1:8001/ReservationPeoples/updateReservationPeoples', {
        name: sportType,
        available_peoples: availablePeoples,
      });
      if (response.status === 200) {
        message.success('设置预约人数成功');
        setIsSettingModalVisible(false);
        fetchReservations();
      } else {
        message.error('设置预约人数失败');
      }
    } catch (error) {
      message.error('设置预约人数失败，请稍后再试');
    }
  };

  const convertDurationToTimeRange = (duration: any) => {
    const durationStr = duration.toString();
    const isShortFormat = durationStr.length === 7;

    const startHour = parseInt(durationStr.slice(0, isShortFormat ? 1 : 2), 10);
    const startMinute = parseInt(durationStr
      .slice(isShortFormat ? 1 : 2, isShortFormat ? 3 : 4), 10);
    const endHour = parseInt(durationStr.slice(isShortFormat ? 3 : 4, isShortFormat ? 5 : 6), 10);
    const endMinute = parseInt(durationStr.slice(isShortFormat ? 5 : 6), 10);

    const formatTime = (hour: any, minute: any) => {
      return dayjs().hour(hour).minute(minute).format('HH:mm');
    };
    return `${formatTime(startHour, startMinute)} - ${formatTime(endHour, endMinute)}`;
  };

  // 连接前后端将预约信息显示在表格里
  const fetchReservations = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filterDate) {
        params.append('date', dayjs(filterDate).format('YYYY-MM-DD'));
      }
      if (filterStatus) {
        params.append('status', filterStatus);
      }
      if (filterSportType) {
        params.append('sportType', filterSportType);
      }
      const response = await axios.get(`http://127.0.0.1:8001/reservation?${params.toString()}`);
      if (response.status === 200) {
        const filteredData = response.data.filter((item: { status: number; }) => item.status !== 3)
          .map((item: any) => ({
            ...item,
            duration: convertDurationToTimeRange(item.duration),
          }));;
        setReservations(filteredData);
        setCurrentPage(1);
      } else {
        message.error('获取预约信息失败');
      }
    } catch (error) {
      message.error('获取预约信息失败，请稍后再试');
    }
  }, [filterDate, filterStatus, filterSportType]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const showDateManageModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // 显示用户详情模态框
  const showUserDetailModal = (userId: number) => {
    setSelectedUserId(userId);
    setDetailModalVisible(true);
  };

  // 模态框中的取消按钮
  const handleCancelDetailModal = () => {
    setDetailModalVisible(false);
  };

  // 前后端连接获取用户详情,拿到数据库当中的用户的信息
  const fetchUserDetails = async (selectedUserId: number) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8001/users/getUser/${selectedUserId}`);
      if (response.status === 200) {
        return response.data.data;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  };

  // 连接前后端中取消预约按钮
  const cancelReservationForAdmin = async (reservationId: number) => {
    try {
      const response = await axios.post(`http://127.0.0.1:8001/reservation/cancelReservationForAdmin/${reservationId}`);
      if (response.data.success) {
        message.success('取消预约成功');
        fetchReservations();
      } else {
        message.error('取消预约失败');
      }
    } catch (error) {
      message.error('取消预约失败，请检查网络或联系管理员');
    }
  };

  // 连接前后端中取消删除按钮
  const deleteReservation = async (reservationId: number) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:8001/reservation/delete/${reservationId}`);
      if (response.status === 200) {
        message.success('删除预约成功');
        fetchReservations();
      } else {
        message.error('删除预约失败');
      }
    } catch (error: any) {
      message.error(`请求错误: ${error.response?.data?.message || '未知错误，请稍后再试'}`);
    }
  };

  const showCancelConfirm = (reservationId: number) => {
    Modal.confirm({
      title: '确认取消这个预约吗？',
      content: '该操作无法撤销',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        cancelReservationForAdmin(reservationId);
      },
    });
  };

  const showDeleteConfirm = (reservationId: number) => {
    Modal.confirm({
      title: '确认删除这个预约吗？',
      content: '该操作无法撤销',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        deleteReservation(reservationId);
      },
    });
  };

  // 日历统计
  const renderCalendarModal = () => {
    return (
      <Modal
        title="日历统计"
        open={isCalendarModalVisible}
        onCancel={() => setIsCalendarModalVisible(false)}
        footer={null}
      >
        <Calendar
          onSelect={async (date, info) => {
            if (info.source === 'date') {
              const dateString = date.format('YYYY-MM-DD');
              try {
                const response = await axios.get(`http://127.0.0.1:8001/reservation/byDate?date=${dateString}`);
                if (response.status === 200 && response.data) {
                  setSelectedDateReservations(response.data.data.timeSlots);
                  setSelectedDateCount(response.data.data.totalCount);
                  setIsDetailModalVisible(true);
                }
              } catch (error) {
                message.error('获取预约信息失败，请稍后再试');
              }
            }
          }}
        />
      </Modal>
    );
  };

  // 日历统计中某一天的预约结果信息
  const renderDateDetailModal = () => {
    return (
      <Modal
        title={`预约总人数：${selectedDateCount} 人`}
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={null}
      >
        <Table
          dataSource={selectedDateReservations}
          columns={[
            {
              title: '预约时间段',
              dataIndex: 'duration',
              key: 'duration',
            },
            { title: '预约人数', dataIndex: 'count', key: 'count' },
          ]}
          rowKey="id"
        />
      </Modal>
    );
  };

  const resetFilters = () => {
    setFilterDate('');
    setFilterStatus('');
    setFilterSportType('');
    fetchReservations();
  };

  useEffect(() => {
    if (detailModalVisible) {
      fetchUserDetails(selectedUserId).then((data) => {
        setuserDetails(data);
      });
    }
  }, [detailModalVisible, selectedUserId]);
  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      render: (_: undefined, __: any, index: number) =>
        1 + index,
    },
    {
      title: '运动类型',
      dataIndex: 'type_name',
      key: 'type_name',
      render: (text: any, record: any) => {
        return (
          <div>
            {record.type_name === 'BASKETBALL' &&
              '篮球'}
            {(record.type_name === 'BADMINTON') &&
              '羽毛球'}
          </div>
        );
      }
    },
    {
      title: '预约时间',
      dataIndex: 'time',
      key: 'time',
      render: (text: dayjs.Dayjs) => dayjs(text).format('YYYY-MM-DD HH:mm'),
      sorter: (a: any, b: any) => dayjs(a.time).unix() - dayjs(b.time).unix(),
    },
    {
      title: '预约时间段',
      dataIndex: 'duration',
      key: 'duration'
    },
    {
      title: '预约用户信息',
      dataIndex: 'user_id',
      key: 'user_id',
      render: (text: any) => (
        <Button onClick={() => showUserDetailModal(text)}>详情</Button>
      ),
    },
    {
      title: (
        <>
          预约状态
          <Button
            size="small"
            style={{ marginLeft: 8 }}
            onClick={() => setIsCalendarModalVisible(true)}
          >
            日历统计
          </Button>

        </>
      ),
      dataIndex: 'status',
      key: 'status',
      render: (text: number) => {
        let statusText = '';
        let statusColor = 'default';
        switch (text) {
          case 1:
            statusText = '预约成功';
            statusColor = 'green';
            break;
          case 2:
            statusText = '取消预约';
            statusColor = 'red';
            break;
          case 3:
            statusText = '预约删除';
            statusColor = 'gray';
            break;
        }
        return <Tag color={statusColor}>{statusText}</Tag>;
      }
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (text: any, record: any) => {
        return (
          <div>
            {record.status === 1 &&
              <Button onClick={() => showCancelConfirm(record.id)}>
                取消预约</Button>}
            {(record.status === 2 || record.status === 3) &&
              <Button onClick={() => showDeleteConfirm(record.id)}>删除预约</Button>}
          </div>
        );
      }
    },
  ];

  // 渲染用户详情模态框
  const renderDetailModal = () => {
    return (
      <Modal
        title="用户信息"
        open={detailModalVisible}
        onCancel={handleCancelDetailModal}
        footer={null}
      >
        {userDetails ? (
          <Descriptions column={1}>
            <Descriptions.Item label="姓名">{userDetails.name}</Descriptions.Item>
            <Descriptions.Item label="身份证号">
              {userDetails.id_number}</Descriptions.Item>
            <Descriptions.Item label="电话">{userDetails.phone}</Descriptions.Item>
            <Descriptions.Item label="是否电工">
              {userDetails.is_electrical_employee ? '是' : '否'}</Descriptions.Item>
            <Descriptions.Item label="职业">{userDetails.occupation}</Descriptions.Item>
          </Descriptions>
        ) : (
          <div>加载中....</div>
        )}
      </Modal>
    );
  };

  return (
    <div>
      <div className='frame'>
        <Layout style={{
          marginTop: 20,
          borderRadius: '10px',
          backgroundColor: 'white',
          flexDirection: 'column',
          position: 'relative',
        }}>
          <Content style={{
            flexDirection: 'column',
          }}>
            <div style={{ marginBottom: '16px' }}>
              <Button onClick={showDateManageModal}>
                日期管理
              </Button>

              <Button
                onClick={() => setIsSettingModalVisible(true)}
                style={{ marginLeft: '10px', marginRight: '30px' }}>
                设置预约人数
              </Button>

              根据日期查询：
              <ConfigProvider locale={locale}></ConfigProvider>
              <DatePicker
                style={{ marginRight: '15px' }}
                value={filterDate ? dayjs(filterDate) : null}
                onChange={(date, dateString) => setFilterDate(dateString as string)} />

              根据预约状态查询：
              <Select
                value={filterStatus}
                style={{ width: 120, marginRight: '15px' }}
                onChange={(value) => setFilterStatus(value)}>
                <Option value="">全部状态</Option>
                <Option value="1">预约成功</Option>
                <Option value="2">取消预约</Option>
              </Select>

              根据运动类型查询：
              <Select
                value={filterSportType}
                style={{ width: 120, marginLeft: '10px', marginRight: '15px' }}
                onChange={(value) => setFilterSportType(value)}
              >
                <Option value="">全部运动</Option>
                <Option value="BADMINTON">羽毛球</Option>
                <Option value="BASKETBALL">篮球</Option>
              </Select>

              <Button onClick={resetFilters} style={{ marginLeft: '10px' }}><RedoOutlined />重置
              </Button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '80vh' }}>
              <Table
                className='reservationTable'
                dataSource={reservations}
                columns={columns}
                rowKey="id"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  flexGrow: 1,
                  overflow: 'hidden'
                }}
                pagination={{
                  current: currentPage,
                  className: 'pagination',
                  pageSize: 10,
                  hideOnSinglePage: false,
                  onChange: (page) => {
                    setCurrentPage(page);
                  },
                  showTotal: (total) => `总共 ${total} 条`
                }}
                footer={() => (
                  <div style={{ height: fillHeight + 'px' }}></div>
                )}
              />
            </div>
          </Content>
        </Layout>
      </div>
      <Modal
        title="日期管理"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={1000}
      >
        <DateManage />
      </Modal>
      <SetReservationModal
        isVisible={isSettingModalVisible}
        onCancel={() => setIsSettingModalVisible(false)}
        onOk={(sportType, availablePeoples) => handleOkSetting(sportType, availablePeoples)}
      />
      {renderDetailModal()}
      {renderCalendarModal()}
      {renderDateDetailModal()}
    </div>
  );
};

export default ReserveManage;
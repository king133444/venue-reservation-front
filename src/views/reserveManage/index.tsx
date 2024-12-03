import './reserveManage.less';
import 'dayjs/locale/zh-cn';

import {
  Button, Calendar, Descriptions,
  Input,
  Layout, message, Modal, Select, Space, Table,
} from 'antd';
import Link from 'antd/es/typography/Link';
import axios from 'axios';
import dayjs from 'dayjs';
dayjs.locale('zh-cn');
// import type { SetStateAction } from 'react';
import { useCallback, useEffect, useState } from 'react';

import DateManage from '../dateManage';
import SetReservationModal from '../reservePeoples';
import CreateVenueTypeModal from './components/createVenueTypeModel';
import ShowUserDetail from './components/showUserDetail';
const { Content } = Layout;

const ReserveManage = () => {
  const [showNextPage, setShowNextPage] = useState(false);
  const [activateKey, setActivateKey] = useState('1');
  const [reservations, setReservations] = useState<any>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSettingModalVisible, setIsSettingModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(0);
  const [userDetails, setuserDetails] = useState<any>([]);
  // const [filterDate, setFilterDate] = useState<string | null>(null);
  // const [filterStatus, setFilterStatus] = useState('');
  // const [filterSportType, setFilterSportType] = useState('');
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
  const [isCreateVenueTypeModalVisible, setIsCreateVenueTypeModalVisible] = useState(false);
  // const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  // const [currentEditReservation, setCurrentEditReservation] = useState(null);

  const showCreateVenueTypeModal = () => {
    setIsCreateVenueTypeModalVisible(true);
  };

  const handleCloseCreateVenueTypeModal = () => {
    setIsCreateVenueTypeModalVisible(false);
  };

  // const showEditModal = (reservation) => {
  //   setCurrentEditReservation(reservation);
  //   setIsEditModalVisible(true);
  // };

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
      // 直接发起请求，不再附加任何过滤参数
      const response = await axios.get('http://127.0.0.1:8001/reservation');
      if (response.status === 200) {
        // 处理响应数据，这里假设您仍然需要对数据进行某种形式的处理
        const processedData = response.data.map((item: any) => ({
          ...item,
          duration: convertDurationToTimeRange(item.duration),
        }));
        setReservations(processedData);
        setCurrentPage(1);
      } else {
        message.error('获取预约信息失败');
      }
    } catch (error) {
      message.error('获取预约信息失败，请稍后再试');
    }
  }, []); // 移除了所有依赖项，因为过滤逻辑已经被删除

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  // const showDateManageModal = () => {
  //   setIsModalVisible(true);
  // };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // 显示用户详情模态框
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const showUserDetailModal = (userId: number, p0?: string) => {
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

  // const resetFilters = () => {
  //   setFilterDate('');
  //   setFilterStatus('');
  //   setFilterSportType('');
  //   fetchReservations();
  // };

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
      render: (_: undefined, __: any, index: number) => 1 + index,
    },
    {
      title: '场馆类型',
      dataIndex: 'type_name',
      key: 'type_name',
      render: (text: any, record: any) => {
        return (
          <div>
            {record.type_name === 'BASKETBALL' && '篮球'}
            {record.type_name === 'BADMINTON' && '羽毛球'}
          </div>
        );
      }
    },
    {
      title: '日期',
      dataIndex: 'time',
      key: 'time',
      width: 200,
      render: (text: dayjs.Dayjs) => dayjs(text).format('YYYY-MM-DD HH:mm'),
      sorter: (a: any, b: any) => dayjs(a.time).unix() - dayjs(b.time).unix(),
    },
    {
      title: '时间段',
      children: [
        {
          title: '上午',
          dataIndex: 'morning',
          key: 'morning',
          // 以下render函数需要根据实际数据结构调整
          render: () => (
            <a
              onClick={() => {
                setShowNextPage(true);
                setActivateKey('1');
              }
              }
            >查看预约详情</a>
          ),
        },
        {
          title: '中午',
          dataIndex: 'noon',
          key: 'noon',
          render: () => (
            <a
              onClick={() => {
                setShowNextPage(true);
                setActivateKey('2');
              }
              }
            >查看预约详情</a>

          ),
        },
        {
          title: '下午',
          dataIndex: 'afternoon',
          key: 'afternoon',
          render: () => (
            <a
              onClick={() => {

                setShowNextPage(true);
                setActivateKey('3');
              }
              }
            >查看预约详情</a>
          ),
        },
        {
          title: '晚上',
          dataIndex: 'evening',
          key: 'evening',
          render: () => (
            <a
              onClick={() => {

                setShowNextPage(true);
                setActivateKey('4');
              }
              }
            >查看预约详情</a>
          ),
        },
      ]
    },
    {
      title: '操作',
      key: 'operation',
      render: (_: any, record: { id: number; }) => {
        return (
          <div>
            <Space>
              <Link onClick={() => ShowUserDetail}>修改</Link>
              {/* <Link onClick={() => showEditModal(record)}>修改</Link> */}
              <Link onClick={() => showDeleteConfirm(record.id)}>删除</Link>
            </Space>

          </div>
        );
      }
    },
  ];

  // 注意：showEditModal, showDetailModal, showEditConfirm, showDeleteConfirm等函数需要您实现，这些函数将处理按钮点击事件。

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
    <>{showNextPage ?
      <ShowUserDetail
        setShow={setShowNextPage}
        activeKey={activateKey}
        setActivateKey={setActivateKey}
      /> : <div>
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
              <div>
                <span>场馆类型：<Input
                  type="text"
                  placeholder='请输入场馆类型'
                  style={{ width: 300, marginRight: '15px' }} /></span>
                <span style={{ marginLeft: '40px' }}>状态：
                  <Select
                    placeholder='请选择日期'
                    style={{ width: 300, marginRight: '15px' }}>
                  </Select></span>
                <Button type="primary" style={{ marginLeft: '10px' }}>查询
                </Button>
                <Button style={{ marginLeft: '10px' }}>重置
                </Button>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '40px',
                marginBottom: '40px'
              }}>
                {/* <SetReservationModal
                  isVisible={isEditModalVisible}
                  onCancel={() => setIsEditModalVisible(false)}
                  onOk={(sportType, availablePeoples) =>
                    handleOkSetting(sportType, availablePeoples)}
                // reservation={currentEditReservation} // 传递当前需要编辑的预约信息
                /> */}
                <CreateVenueTypeModal
                  isVisible={isCreateVenueTypeModalVisible}
                  onClose={handleCloseCreateVenueTypeModal}
                />
                <Button type="primary" onClick={showCreateVenueTypeModal}>
                  新建场馆类型
                </Button>
                <Button type="primary">导出今日预约名单
                </Button>
              </div>
              {/* <div style={{ marginBottom: '16px' }}>
      <Button onClick={showDateManageModal}>
        日期管理
      </Button>

      <Button
        onClick={() => setIsSettingModalVisible(true)}
        style={{ marginLeft: '10px', marginRight: '30px' }}>
        设置预约人数
      </Button>

      根据日期查询：
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
    </div> */}
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
                  )} />
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
          onOk={(sportType, availablePeoples) => handleOkSetting(sportType, availablePeoples)} />
        {renderDetailModal()}
        {renderCalendarModal()}
        {renderDateDetailModal()}
      </div>}</>
  );
};

export default ReserveManage;
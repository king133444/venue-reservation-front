import './reserveManage.less';
import 'dayjs/locale/zh-cn';

import {
  Button,
  DatePicker,
  Descriptions,
  Input,
  Layout,
  message,
  Modal,
  Space,
  Table,
} from 'antd';
import Link from 'antd/es/typography/Link';
import axios from 'axios';
import dayjs from 'dayjs';
dayjs.locale('zh-cn');
import { useCallback, useEffect, useState } from 'react';

import api from '@/api';

import CreateVenueTypeModal from './components/createVenueTypeModel';
import ShowUserDetail from './components/showUserDetail';
import UpdateVenueTypeModal from './components/updateVenueTypeModel';
interface TimeslotDTO {
  available: boolean;
  start: string;
  end: string;
  number: number;
}

interface ReservationInfo {
  id: number;
  venueName: string;
  date: Date;
  isApplicableAllFutureDates: boolean;
  availableDays: number[];
  timeslots: {
    morning: TimeslotDTO;
    lunchtime: TimeslotDTO;
    afternoon: TimeslotDTO;
    evening: TimeslotDTO;
  };
}

const { Content } = Layout;

const ReserveManage = () => {
  const [showNextPage, setShowNextPage] = useState(false);
  const [activateKey, setActivateKey] = useState('1');
  const [reservations, setReservations] = useState<ReservationInfo[]>([]);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(0);
  const [userDetails, setuserDetails] = useState<any>([]);
  const [isCreateVenueTypeModalVisible, setIsCreateVenueTypeModalVisible] = useState(false);
  const [isUpdateVenueTypeModalVisible, setIsUpdateVenueTypeModalVisible] = useState(false);
  const [venueTypeQuery, setVenueTypeQuery] = useState('');
  const [dateQuery, setDateQuery] = useState('');

  const [editData, setEditData] = useState<ReservationInfo>();
  const [queryDetails, setQueryDetails] = useState<any>();
  const handleKeyChanges = (value: string) => {
    setActivateKey(value);
    const newQueryDetails = getQueryDateForTab(value);
    setQueryDetails((pre: any) => ({
      ...pre,
      time: newQueryDetails,
    })); // 更新查询日期
  };
  const getQueryDateForTab = (key: string): string[] => {
    switch (key) {
      case '1':
        return ['08:00-11:00'];
      case '2':
        return ['11:00-13:00'];
      case '3':
        return ['13:00-17:00'];
      case '4':
        return ['17:00-21:00'];
      default:
        return ['08:00-21:00'];
    }
  };
  // 新建场馆类型
  const showCreateVenueTypeModal = () => {
    setIsCreateVenueTypeModalVisible(true);
  };
  const showUpdateVenueTypeModal = (data: ReservationInfo) => {
    setIsUpdateVenueTypeModalVisible(true);
    setEditData(data);
  };

  const handleCloseCreateVenueTypeModal = () => {
    setIsCreateVenueTypeModalVisible(false);
  };
  const handleCloseUpdateVenueTypeModal = () => {
    setIsUpdateVenueTypeModalVisible(false);
  };

  // 获取所有场馆预约配置
  const getReservations = useCallback(async () => {
    try {
      const response: any = await api.queryReservationInfo({});
      const { success, message: info, data } = response;
      if (success) {
        const processedData: ReservationInfo[] = data.venues.map((item: any) => ({
          id: item.id,
          venueName: item.venue_name,
          date: item.date,
          isApplicableAllFutureDates: item.is_applicable_all_future_dates,
          availableDays: item.available_days,
          timeslots: item.timeslots,
        }));
        setReservations(processedData);
        // message.success(info);
      } else {
        message.info(info);
      }
    } catch (error) {
      message.error('获取预约信息失败，请稍后再试');
    }
  }, []);

  useEffect(() => {
    getReservations();
  }, [getReservations]);

  // 根据场馆类型和状态查询
  // const filterReservations = () => {
  //   const filtered = reservations.filter(reservation => {
  //     const matchesVenueType = !venueTypeQuery ||
  //       reservation.venueName.toLowerCase().includes(venueTypeQuery.toLowerCase());
  //     const matchesDate = !dateQuery || dayjs(reservation.date).isSame(dayjs(dateQuery), 'day');
  //     return matchesVenueType && matchesDate;
  //   });
  //   setFilteredReservations(filtered);
  // };

  const handleSearch = async () => {
    // filterReservations();

    try {
      const response: any = await api.queryReservationInfo({
        venue_name: venueTypeQuery,
        date: dateQuery
      });
      const { success, message: info, data } = response;
      if (success) {
        const processedData: ReservationInfo[] = data.venues.map((item: any) => ({
          id: item.id,
          venueName: item.venue_name,
          date: item.date,
          isApplicableAllFutureDates: item.is_applicable_all_future_dates,
          availableDays: item.available_days,
          timeslots: item.timeslots,
        }));
        message.success(info);
        setReservations(processedData);
      } else {
        message.error(info);
      }
    } catch (error) {
      message.error('获取预约信息失败，请稍后再试');
    }

  };
  const handleExport = async () => {
    // filterReservations();

    try {
      const response: any = await api.handleExport({});
      const { success, message: info, data } = response;

      if (success) {

        const arrayBuffer = new Uint8Array(data.data);
        const blob = new Blob([arrayBuffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = '今日预约名单.xlsx'; // 指定下载文件名
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl); // 清除创建的URL
      }
      else {
        message.error(info);
      }
    } catch (error) {
      message.error('导出失败');
    }

  };

  const handleReset = () => {
    setVenueTypeQuery('');
    setDateQuery('');
    getReservations();
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
  const deleteReservation = async (id: number) => {
    try {
      const response: any = await api.deleteReservationInfo({
        id: id
      });

      const { success, message: info } = response;
      if (success) {
        message.success(info);
      } else {
        message.error(info);
      }
    } catch (error: any) {
      message.error('删除失败');
    } finally {
      //  setTimeout(() => {
      getReservations();
      //  }, 1500);
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

  useEffect(() => {
    if (detailModalVisible) {
      fetchUserDetails(selectedUserId).then((data) => {
        setuserDetails(data);
      });
    }
  }, [detailModalVisible, selectedUserId]);

  // 1. 格式化 date
  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    // 使用 toLocaleDateString 生成 YYYY-MM-DD 格式
    // 注意：这种方法的输出可能依赖于浏览器的地区设置，下面的选项是针对大多数情况
    return date.toLocaleDateString('en-CA'); // 'en-CA' 选项会生成 YYYY-MM-DD 格式
  };

  // 2. 转换 timeslot
  const formatTimeslot = (timeslot: { start: any; end: any; }) => {
    return [`${timeslot.start}-${timeslot.end}`]; // 注意：根据您的描述，应该使用 end 而不是 "10:00"
  };
  const showConfirm = () => {
    Modal.confirm({
      title: '确认导出',
      content: '确认是否导出？',
      onOk() {
        handleExport();
      },
      onCancel() {
      },
    });
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      render: (_: undefined, __: any, index: number) => 1 + index,
    },
    {
      title: '场馆类型',
      dataIndex: 'venueName',
      key: 'venue_name',
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: 200,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'), // 格式化日期为年月日
      sorter: (a: any, b: any) => dayjs(a.date).unix() - dayjs(b.date).unix(),
    },
    {
      title: '时间段',
      children: [
        {
          title: '上午',
          dataIndex: ['timeslots', 'morning'],
          key: 'morning',
          render: (timeslot: any, record: any) => (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <span>{timeslot.start && timeslot.end ? `${timeslot.start}-${timeslot.end}` : '暂未开放'}</span>
              {timeslot.available && <a style={{ marginLeft: '10px' }} onClick={() => {
                setShowNextPage(true);
                setActivateKey('1');
                setQueryDetails({
                  id: record.id,
                  date: formatDate(record.date),
                  time: formatTimeslot(timeslot),
                });
              }}>
                查看预约详情
              </a>}
            </div>
          ),
        },
        {
          title: '中午',
          dataIndex: ['timeslots', 'lunchtime'],
          key: 'lunchtime',
          render: (timeslot: any, record: any) => (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <span>{timeslot.start && timeslot.end ? `${timeslot.start}-${timeslot.end}` : '暂未开放'}</span>
              {timeslot.available && <a style={{ marginLeft: '10px' }} onClick={() => {
                setShowNextPage(true);
                setActivateKey('2');
                setQueryDetails({
                  id: record.id,
                  date: formatDate(record.date),
                  time: formatTimeslot(timeslot),
                });
              }}>
                查看预约详情
              </a>}
            </div>
          ),
        },
        {
          title: '下午',
          dataIndex: ['timeslots', 'afternoon'],
          key: 'afternoon',
          render: (timeslot: any, record: any) => (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <span>{timeslot.start && timeslot.end ? `${timeslot.start}-${timeslot.end}` : '暂未开放'}</span>
              {timeslot.available && <a style={{ marginLeft: '10px' }} onClick={() => {
                setShowNextPage(true);
                setActivateKey('3');
                setQueryDetails({
                  id: record.id,
                  date: formatDate(record.date),
                  time: formatTimeslot(timeslot),
                });
              }}>
                查看预约详情
              </a>}
            </div>
          ),
        },
        {
          title: '晚上',
          dataIndex: ['timeslots', 'evening'],
          key: 'evening',
          render: (timeslot: any, record: any) => (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <span>{timeslot.start && timeslot.end ? `${timeslot.start}-${timeslot.end}` : '暂未开放'}</span>
              {timeslot.available && <a style={{ marginLeft: '10px' }} onClick={() => {
                setShowNextPage(true);
                setActivateKey('4');
                setQueryDetails({
                  id: record.id,
                  date: formatDate(record.date),
                  time: formatTimeslot(timeslot),
                });
              }}>
                查看预约详情
              </a>}
            </div>
          ),
        },
      ],
    },
    {
      title: '操作',
      key: 'operation',
      render: (_: any, record: any) => {
        return (
          <div>
            <Space>
              <Link onClick={() => showUpdateVenueTypeModal(record)}>修改</Link>
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
        handleKeyChange={handleKeyChanges}
        queryDate={queryDetails}
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
                  allowClear
                  value={venueTypeQuery} onChange={(e) => setVenueTypeQuery(e.target.value)}
                  type="text"
                  placeholder='请输入场馆类型'
                  style={{ width: 300, marginRight: '15px' }} /></span>
                <span style={{ marginLeft: '40px' }}>状态：
                  <DatePicker
                    value={dateQuery ? dayjs(dateQuery) : null}
                    onChange={(date, dateString) => setDateQuery(dateString as string)} // 使用类型断言
                    style={{ width: 300, marginRight: '15px' }}
                    format="YYYY-MM-DD"
                  />
                </span>
                <Button
                  onClick={handleSearch}
                  type="primary"
                  style={{ marginLeft: '10px' }}>查询
                </Button>
                <Button
                  onClick={handleReset}
                  style={{ marginLeft: '10px' }}>重置
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
                  getInfo={getReservations}
                />
                <UpdateVenueTypeModal
                  editData={editData}
                  isVisible={isUpdateVenueTypeModalVisible}
                  onClose={handleCloseUpdateVenueTypeModal}
                  getInfo={getReservations}
                />
                <Button type="primary" onClick={showCreateVenueTypeModal}>
                  新建场馆类型
                </Button>
                <Button type="primary" onClick={showConfirm}>导出今日预约名单
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
                />
              </div>

            </Content>
          </Layout>
        </div>
        {renderDetailModal()}
      </div>}</>
  );
};

export default ReserveManage;
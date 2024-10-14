import { UploadOutlined } from '@ant-design/icons';
import {
   Button, Card, DatePicker, Form, Input,
   Layout, List, message, Modal, Pagination, Switch, Upload
} from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';

import api from '@/api'; // 确保这里的路径正确指向您的API函数

const { Content } = Layout;

interface Dynamic {
   id: number;
   title: string;
   content: string;
   publish_date: Date;
   image: string | null;
   isVisible: boolean;
}

const VenueDynamics = () => {
   const [dynamics, setDynamics] = useState<Dynamic[]>([]);
   const [loading, setLoading] = useState(false);
   const [isModalVisible, setIsModalVisible] = useState(false);
   const [selectedDynamic, setSelectedDynamic] = useState<Dynamic | null>(null);
   const [isEditMode, setIsEditMode] = useState(false);
   const [imagePreview, setImagePreview] = useState('');
   const [form] = Form.useForm();
   const [currentPage, setCurrentPage] = useState(1);
   const pageSize = 8; // 假设每页显示8条数据
   const total = dynamics.length; // 总数据量
   const [filterDate, setFilterDate] = useState<string | null>(null);
   // 获取当前页的数据
   const currentData = dynamics.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
   );

   // 分页改变时的处理函数
   const handlePageChange = (page: React.SetStateAction<number>) => {
      setCurrentPage(page);
   };

   const fetchDynamics = useCallback(async () => {
      let params = {};
      setLoading(true);
      if (filterDate !== null) {
         params = {
            'date': dayjs(filterDate).format('YYYY-MM-DD')
         };
      };
      try {
         const response: any = await api.GetPosts(params);
         const dynamics = response.data as Dynamic[];
         setDynamics(dynamics);
      } catch (error) {
         message.error('获取场馆动态失败');
      }
      setLoading(false);
   }, [filterDate]); // 依赖于 filterDate

   useEffect(() => {
      fetchDynamics();
   }, [fetchDynamics]); // fetchDynamics 现在是一个依赖

   const showModal = (dynamic: Dynamic | null = null) => {
      setIsEditMode(dynamic !== null);
      setSelectedDynamic(dynamic);
      form.resetFields();
      if (dynamic) {
         form.setFieldsValue({
            ...dynamic,
            publish_date: moment(dynamic.publish_date),
            image: undefined // 清除图片字段
         });
         setImagePreview(dynamic.image ? `data:image/png;base64,${dynamic.image}` : '');
      } else {
         setImagePreview('');
      }
      setIsModalVisible(true);
   };

   const handleCreate = async () => {
      try {
         const values = await form.validateFields();
         const formattedValues = {
            ...values,
            publish_date: values.publish_date,
            // .format("YYYY-MM-DD HH:mm:ss"),
            image: values.image || undefined
         };
         await api.CreatePost(formattedValues);
         message.success('场馆动态创建成功');
         setIsModalVisible(false);
         fetchDynamics();
      } catch (error) {
         message.error('创建操作失败，请检查输入或稍后再试');
      }
   };

   const handleUpdate = async () => {
      if (!selectedDynamic) {
         message.info('没有表单更新');
         return;
      }
      try {
         const values = await form.validateFields();
         const formattedValues = {
            ...values,
            publish_date: values.publish_date,
            image: values.image || undefined
         };
         await api.UpdatePost({ id: selectedDynamic.id, ...formattedValues });
         message.success('场馆动态更新成功');
         setIsModalVisible(false);
         fetchDynamics();
      } catch (error) {
         message.error('更新操作失败，请检查输入或稍后再试');
      }
   };
   const showdDeleteConfirm = (record: any) => {
      Modal.confirm({
         title: '删除',
         content: '删除后，您将无法恢复这个场馆动态。',
         onOk() {
            handleDelete(record);
         }
      });
   };
   const handleDelete = async (id: number) => {
      try {
         const response: any = await api.DeletePost({ id });

         if (response.success) {
            message.success(response.message);
         } else {
            message.error(response.message);
         }
         fetchDynamics();
      } catch (error) {
         message.error('删除失败');
      }
   };

   const handleBeforeUpload = (file: Blob) => {
      const reader = new FileReader();
      reader.onload = () => {
         if (typeof reader.result === 'string') {
            setImagePreview(reader.result); // 设置预览图片，这里保留前缀，因为预览需要

            // 移除"data:image/jpeg;base64,"前缀，只存储纯Base64编码到数据库
            const base64Data = reader.result.split(',')[1];
            form.setFieldsValue({ image: base64Data });
         }
      };
      reader.readAsDataURL(file);
      return false; // 阻止默认上传行为
   };

   const handleVisibilityChange = async (id: number, isVisible: boolean) => {
      setLoading(true);
      try {
         // 替换为您的API调用
         await api.UpdatePost({ id, isVisible });
         message.success('帖子状态更新成功');
         // 更新本地状态以反映更改
         setDynamics(dynamics.map(
            dynamic => dynamic.id === id ? { ...dynamic, isVisible } : dynamic));
      } catch (error) {
         message.error('更新失败，请稍后再试');
      }
      setLoading(false);
   };

   return (
      <>
         <Layout style={{
            marginTop: 20,
            borderRadius: '10px',
            backgroundColor: 'white',
            flexDirection: 'column',
            position: 'relative',
         }}>
            <Content>
               <Button
                  onClick={() => showModal()}
                  style={{ marginBottom: '20px', marginRight: '20px' }}
               >
                  新增动态
               </Button>
               根据日期查询：
               <DatePicker
                  style={{ marginRight: '15px' }}
                  value={filterDate ? dayjs(filterDate) : null}
                  onChange={
                     (
                        date,
                        dateString
                     ) => setFilterDate(date ? (dateString as string) : null)
                  }
               />
               <div>
                  <List
                     style={{ minHeight: '78vh' }}
                     loading={loading}
                     grid={{ gutter: 16, column: 4 }}
                     dataSource={currentData}
                     renderItem={(item, index) => (
                        <List.Item>
                           <Card
                              title={`${index + 1}. ${item.title}`}
                              extra={
                                 <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Switch
                                       checkedChildren="可见"
                                       unCheckedChildren="隐藏"
                                       checked={item.isVisible}
                                       onChange={checked =>
                                          handleVisibilityChange(item.id, checked)}
                                       style={{ marginRight: 8 }}
                                    />
                                    <Button onClick={() => showModal(item)}>编辑</Button>
                                 </div>
                              }
                              actions={[
                                 <Button key="delete"
                                    onClick={() => showdDeleteConfirm(item.id)}>删除</Button>
                              ]}
                           >
                              <div style={{ height: '330px', overflowY: 'auto' }}>
                                 <p>{item.content}</p>
                                 {item.image && (
                                    <img
                                       src={`data:image/png;base64,${item.image}`}
                                       alt="dynamic"
                                       style={{ maxWidth: '100%', maxHeight: '100px' }}
                                    />
                                 )}
                                 <p>
                                    {moment(item.publish_date).format('YYYY-MM-DD HH:mm')}
                                 </p>
                              </div>
                           </Card>
                        </List.Item>
                     )}
                  />
                  <div style={{
                     display: 'flex',
                     justifyContent: 'space-between',
                     alignItems: 'center', // 根据需要调整对齐方式
                     marginTop: '20px', // 为分页器上方提供一些空间
                  }}>
                     <div style={{ width: '80%' }}></div>
                     <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={total}
                        onChange={handlePageChange}
                        showTotal={(total) => `总共 ${total} 条`} // 显示总数
                     />
                  </div>
               </div>
            </Content>
         </Layout>
         <Modal
            title={`${isEditMode ? '编辑' : '新增'}场馆动态`}
            open={isModalVisible}
            onOk={() => (isEditMode ? handleUpdate() : handleCreate())}
            onCancel={() => setIsModalVisible(false)}
         >
            <Form form={form} layout="vertical">
               <Form.Item
                  name="title"
                  label="标题"
                  rules={[{ required: true, message: '请输入标题' }]}>
                  <Input />
               </Form.Item>
               <Form.Item
                  name="content"
                  label="内容"
                  rules={[{ required: true, message: '请输入内容' }]}>
                  <Input.TextArea />
               </Form.Item>
               <Form.Item
                  name="publish_date"
                  label="发布日期"
                  rules={[{ required: true, message: '请选择发布日期' }]}>
                  <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
               </Form.Item>
               <Form.Item label="动态图片" name="image">
                  <Upload
                     showUploadList={false}
                     beforeUpload={handleBeforeUpload}
                     accept="image/*">
                     <Button icon={<UploadOutlined />}>上传图片</Button>
                  </Upload>
                  {imagePreview && (
                     <img
                        src={imagePreview}
                        alt="预览"
                        style={{ maxWidth: '100%', marginTop: 10, maxHeight: '100px' }} />
                  )}
               </Form.Item>
            </Form>
         </Modal>
      </>
   );
};

export default VenueDynamics;

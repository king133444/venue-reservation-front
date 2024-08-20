import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const AuthRoute = ({ children }: any) => {
  const location = useLocation();
  // const accessToken = sessionStorage.getItem('access_token');
  const username = sessionStorage.getItem('username');
  if (!username) {
    // 用户未登录，重定向到登录页面，并保存当前页面的路径，以便登录后跳转回来
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 用户已登录，渲染子组件
  return children;
};

export default AuthRoute;

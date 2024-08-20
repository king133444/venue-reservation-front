import './index.less';

import bg from '@/assets/images/login_bg.jpg';
import logo from '@/assets/images/logo.svg';

import LoginForm from './components/LoginForm';
const Login = () => {
  return (
    <div
      className="login-container"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div className="login-box">
        <div className="login-logo">
          <img className="logo-text" src={logo} />
        </div>
        <div className="login-form">
          <LoginForm />
        </div>
      </div>
		
    </div>

  );
};

export default Login;

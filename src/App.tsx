import { ConfigProvider } from "antd";
import { HashRouter } from "react-router-dom";
import "moment/dist/locale/zh-cn";
import 'dayjs/locale/zh-cn';
import locale from 'antd/locale/zh_CN';
import Router from "@/routers/index";
const App = () => {
  return (
    <HashRouter>
      <ConfigProvider locale={locale}>
        <Router />
      </ConfigProvider>
    </HashRouter>
  );
};

export default App;

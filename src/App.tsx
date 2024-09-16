import 'moment/dist/locale/zh-cn';
import 'dayjs/locale/zh-cn';

import { ConfigProvider } from 'antd';
import locale from 'antd/locale/zh_CN';
import { HashRouter } from 'react-router-dom';

import Router from '@/routers/index';
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

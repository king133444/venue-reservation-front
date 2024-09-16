import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { createRoot } from 'react-dom/client';
import { RecoilRoot } from 'recoil';

import App from '@/App';

// Create a root.
const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

// Initial render: Render an element to the root.
root.render(
	<RecoilRoot>

		<ConfigProvider locale={zhCN}>
			<App />
		</ConfigProvider>
	</RecoilRoot>
);

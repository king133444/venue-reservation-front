import axios, { AxiosResponse } from "axios";

// const ip = 'http://8.130.10.227/'
// const ip = 'http://8.130.10.227'
const ip = "http://127.0.0.1";
// export const baseURL = 'http://' + ip + ':8001'
export const baseURL = ip + ":8001";
const ReqInstance = axios.create({
	baseURL
});

// 拦截器
ReqInstance.interceptors.request.use(
	config => {
		const access_token = sessionStorage.getItem("access_token");
		if (access_token) {
			config.headers = config.headers || {};
			config.headers.common = config.headers.common || {};
			config.headers.common["Authorization"] = `Bearer ${access_token}`;
		}
		return config;
	},
	error => {
		return Promise.reject(error);
	}
);

ReqInstance.interceptors.response.use(
	config => {
		if (config.config.url === "/file/downloadFile" || config.config.url === "/file/downloadFiles") {
			return config;
		}

		const data = config.data;
		if (config.status === 200) {
			return data;
		}

		return config;
	},
	error => {
		const response = error.response;
		const status_code = response && response.data ? response.data.statusCode : 500;
		if (status_code === 401) {
			console.error("会话过期,请重新登录");
			window.location.href = "/login";
		}
		return Promise.reject(error);
	}
);

export function fetchPost(url: string, params: any) {
	return new Promise((resolve, reject) => {
		ReqInstance.post(url, params)
			.then(
				response => {
					resolve(response);
				},
				err => {
					reject(err);
				}
			)
			.catch(error => {
				reject(error);
			});
	});
}

export function uploadFile(url: string, formData: FormData) {
	return new Promise((resolve, reject) => {
		ReqInstance.post(url, formData, {
			headers: {
				"Content-Type": "multipart/form-data"
			}
		})
			.then(response => {
				resolve(response);
			})
			.catch(error => {
				reject(error);
			});
	});
}

export function fetchGet(url: string, params: any) {
	return new Promise((resolve, reject) => {
		ReqInstance.get(url, { params })
			.then(
				response => {
					resolve(response);
				},
				err => {
					reject(err);
				}
			)
			.catch(error => {
				reject(error);
			});
	});
}

export function fetchGet2(url: string, params: any) {
	return new Promise((resolve, reject) => {
		ReqInstance.get(url, { params, responseType: "blob" })
			.then(
				response => {
					resolve(response);
				},
				err => {
					reject(err);
				}
			)
			.catch(error => {
				reject(error);
			});
	});
}

// 添加 fetchPut 方法
export function fetchPut(url: string, params: any): Promise<AxiosResponse<any>> {
	return ReqInstance.put(url, params)
		.then(response => response)
		.catch(error => Promise.reject(error));
}

// 添加 fetchDelete 方法
export function fetchDelete(url: string, params: any = {}) {
	return new Promise((resolve, reject) => {
		// 确保 params 是对象，如果不是，将其转换为对象
		const config = { params: typeof params === "object" ? params : { params } };
		ReqInstance.delete(url, config)
			.then(response => {
				resolve(response);
			})
			.catch(error => {
				reject(error);
			});
	});
}

import axios from "axios";
import storage from "../utils/localstorage";
import { refreshToken } from "./auth";

// config axios
const instance = axios.create({
	baseURL: "http://localhost:3001/api",
	headers: { "Content-Type": "application/json" },
});
/* :::::::::::::: Xử  trước khi gửi request xuống server :::::::::::::: */
instance.interceptors.request.use(
	(config) => {
		/* Bỏ qua check access token với các routes nay */
		const skippingCheckTokenRoutes = [
			"/login",
			"/register",
			"/refresh-token",
			"/forgot-password",
			"/reset-password",
		];
		if (skippingCheckTokenRoutes.indexOf(config.url) >= 0) return config;
		/* Trước khi request xuống server gửi luôn access token trong headers để check */
		const accessToken = instance.getAccessToken();
		if (accessToken) {
			config.headers.token = accessToken;
			return config;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

/* :::::::::::::: Xử lý data sau khi nhận response :::::::::::::: */
instance.interceptors.response.use(
	async (response) => {
		const { data, config } = response;
		const skippingCheckTokenRoutes = [
			"/login",
			"/register",
			"/refresh-token",
			"/forgot-password",
			"/reset-password",
		];
		if (skippingCheckTokenRoutes.indexOf(config.url) >= 0) return data;

		/* ::::::::::: Refresh token ::::::::::: */
		const auth = storage.get("auth")
		if (auth && data.statusCode && data.statusCode === 401) {
			const { accessToken } = await refreshToken(); // create new access token
			console.log('New access token :>> ', accessToken);
			instance.setAccessToken(accessToken);
			return data;
		}
		return data;
	},
	(error) => {
		return Promise.reject(error);
	},
);

/* :::::::::::::: Save access token in localstorage :::::::::::::: */
instance.setAccessToken = (accessToken) => {
	if (accessToken)
		localStorage.setItem("accessToken", accessToken);
};

/* :::::::::::::: Get access token from localstorage :::::::::::::: */
instance.getAccessToken = () => {
	return storage.get("accessToken")
};


export default instance;

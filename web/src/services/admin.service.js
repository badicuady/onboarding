import axios from "axios";
import config from "../config";

class AdminService {
	constructor(authorization) {
		this.authorization = authorization;
	}

	async info() {
		try {
			const callConfig = {
				headers: {
					"Authorization": `Bearer ${this.authorization}`
				}
			};
			const response = await axios.get(`${config.adminApiBase}${config.apiUserInfo}/a`, callConfig);
			return response;
		} catch (error) {
			console.error(error);
		}
	}
}

export default AdminService;
import axios from "axios";
import config from "../config";

class AdminService {
	constructor(authorization) {
		this.authorization = authorization;
		this.config = {
			headers: {
				"Authorization": `Bearer ${this.authorization}`
			}
		};
	}

	async info() {
		try {
			const response = await axios.get(`${config.apiBaseUrl}/${config.apiUserInfoResource}`, this.config);
			return response;
		} catch (error) {
			console.error(error);
		}
	}
}

export default AdminService;
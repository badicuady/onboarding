import axios from "axios";
import config from "../config";

class ApiService {
	async token(email, password) {
		try {
			const rex = new RegExp(config.defaultEmailDomain, "gmi");
			const callData = {
				"grant_type": "password",
				"username": email.replace(rex, "") + config.defaultEmailDomain,
				"password": password,
				"client_id": config.clientId
			};
			const response = await axios.post(`${config.apiBaseUrl}/${config.apiTokenResource}`, callData);
			return response;
		} catch (err) {
			console.error(err);
			return {
				data: { error: err }
			}
		}
	}
}

export default ApiService;
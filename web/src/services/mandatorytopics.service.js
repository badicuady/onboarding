import axios from "axios";
import config from "../config";

class MandatoryTopicsService {
	constructor(authorization) {
		this.authorization = authorization;
		this.config = {
			headers: {
				"Authorization": `Bearer ${this.authorization}`
			}
		};
	}

	async updateUserMandatoryTopics(userId, mandatoryTopicsId, done) {
		try {
			const data = { userId, mandatoryTopicsId, done };
			const url = `${config.apiBaseUrl}/${config.apiMethodPrefix}/user/mandatorytopics`;
			const response = await axios.post(url, data, this.config);
			return response;
		} catch (error) {
			console.error(error);
		}
	}
}

export default MandatoryTopicsService;
import axios from "axios";
import config from "../config";
import AuthService from "./abstract.auth.service.js";

class UsersService extends AuthService {
  constructor(authorization) {
    super(authorization);
  }

  async getUserMandatoryTopics(userId) {
    try {
      const url = `${config.apiBaseUrl}/${config.apiMethodPrefix}/user/mandatorytopics`;
      const response = await axios.get(url, { ...this.config, params: { userId } });
      return response;
    } catch (error) {
      console.error(error);
    }
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

export default UsersService;

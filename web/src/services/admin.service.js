import axios from "axios";
import config from "../config";
import AuthService from "./abstract.auth.service.js";

class AdminService extends AuthService {
  constructor(authorization) {
    super(authorization);
  }

  async info(queryParams) {
    try {
      const response = await axios.get(`${config.apiBaseUrl}/${config.apiUserInfoResource}`, {
        ...this.config,
        params: queryParams || {},
      });
      return response;
    } catch (error) {
      console.error(error);
    }
  }
}

export default AdminService;

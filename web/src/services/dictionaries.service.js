import axios from "axios";
import config from "../config";
import AuthService from "./abstract.auth.service.js";

class DictionariesService extends AuthService {
  constructor(authorization) {
    super(authorization);
  }

  async getDepartments() {
    try {
      const url = `${config.apiBaseUrl}/${config.apiMethodPrefix}/departments`;
      const response = await axios.get(url, { ...this.config });
      return response;
    } catch (error) {
      console.error(error);
    }
  }
}

export default DictionariesService;

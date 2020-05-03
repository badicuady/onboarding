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

  async getMandatoryTopics(forSpecialist, forManager) {
    try {
      const url = `${config.apiBaseUrl}/${config.apiMethodPrefix}/mandatorytopics`;
      const response = await axios.get(url, { ...this.config, params: { forSpecialist, forManager } });
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  async getTimespans() {
    try {
      const url = `${config.apiBaseUrl}/${config.apiMethodPrefix}/timespans`;
      const response = await axios.get(url, { ...this.config });
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  async getResponsibles() {
    try {
      const url = `${config.apiBaseUrl}/${config.apiMethodPrefix}/responsibles`;
      const response = await axios.get(url, { ...this.config });
      return response;
    } catch (error) {
      console.error(error);
    }
  }
}

export default DictionariesService;

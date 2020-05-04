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

  async getUserSpecificTopics(userId) {
    try {
      const url = `${config.apiBaseUrl}/${config.apiMethodPrefix}/user/specifictopics`;
      const response = await axios.get(url, { ...this.config, params: { userId } });
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  async insertUserSpecificTopics(
    userId,
    specificTopicName,
    specificTopicMaterials,
    timespanId,
    responsibleId,
    done,
    type
  ) {
    try {
      const data = {
        userId,
        specificTopicName,
        specificTopicMaterials,
        timespanId,
        responsibleId,
        done,
        type,
      };
      const url = `${config.apiBaseUrl}/${config.apiMethodPrefix}/user/specifictopics`;
      const response = await axios.post(url, data, this.config);
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  async updateUserSpecificTopics(userId, specificTopicId, done) {
    try {
      const data = {
        userId,
        done,
      };
      const url = `${config.apiBaseUrl}/${config.apiMethodPrefix}/user/specifictopics/${specificTopicId}`;
      const response = await axios.patch(url, data, this.config);
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  async deleteUserSpecificTopics(userId, specificTopicId) {
    try {
      const data = {
        userId: userId,
      };
      const url = `${config.apiBaseUrl}/${config.apiMethodPrefix}/user/specifictopics/${specificTopicId}`;
      const response = await axios.delete(url, { ...this.config, data: data });
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  async getUserFeedback(userId) {
    try {
      const url = `${config.apiBaseUrl}/${config.apiMethodPrefix}/user/feedback`;
      const response = await axios.get(url, { ...this.config, params: { userId } });
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  async upsertUserFeedback(userId, period, type, userType, feedback) {
    try {
      const data = {
        userId,
        userType,
        feedback,
        period,
        type,
      };
      const url = `${config.apiBaseUrl}/${config.apiMethodPrefix}/user/feedback`;
      const response = await axios.post(url, data, this.config);
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  async getUserObjectives(userId) {
    try {
      const url = `${config.apiBaseUrl}/${config.apiMethodPrefix}/user/objectives`;
      const response = await axios.get(url, { ...this.config, params: { userId } });
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  async insertUserObjectives(userId, description, deadline, responsible, type) {
    try {
      const data = {
        userId,
        description,
        deadline,
        responsible,
        type,
      };
      const url = `${config.apiBaseUrl}/${config.apiMethodPrefix}/user/objectives`;
      const response = await axios.post(url, data, this.config);
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  async deleteUserObjectives(userId, objectiveId) {
    try {
      const data = {
        userId: userId,
      };
      const url = `${config.apiBaseUrl}/${config.apiMethodPrefix}/user/objectives/${objectiveId}`;
      const response = await axios.delete(url, { ...this.config, data: data });
      return response;
    } catch (error) {
      console.error(error);
    }
  }
}

export default UsersService;

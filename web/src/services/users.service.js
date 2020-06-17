import axios from "axios";
import config from "../config";
import AuthService from "./abstract.auth.service.js";
import savingStore from "../services/saving.service.js";

axios.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    savingStore.saving();
    return config;
  },
  (error) => {
    // Do something with request error
    savingStore.error();
    console.error(error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    savingStore.saved();
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    savingStore.error();
    console.error(error);
    return Promise.reject(error);
  }
);

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

  async updateUserMandatoryTopics(userId, alteringUserId, mandatoryTopicsId, done) {
    try {
      const data = { userId, alteringUserId, mandatoryTopicsId, done };
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
	alteringUserId,
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
        alteringUserId,
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

  async updateUserSpecificTopics(userId, alteringUserId, specificTopicId, done) {
    try {
      const data = {
        userId,
        alteringUserId,
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

  async upsertUserFeedback(userId, alteringUserId, period, type, userType, feedback) {
    try {
      const data = {
        userId,
        alteringUserId,
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

  async insertUserObjectives(userId, alteringUserId, description, deadline, responsible, type) {
    try {
      const data = {
        userId,
        alteringUserId,
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

  async getUserReview(userId) {
    try {
      const url = `${config.apiBaseUrl}/${config.apiMethodPrefix}/user/review`;
      const response = await axios.get(url, { ...this.config, params: { userId } });
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  async upsertUserReview(
    userId,
    alteringUserId,
    date,
    performance,
    concerns,
    summary,
    objectivesMet,
    trainingsMet,
    period
  ) {
    try {
      const data = {
        userId,
        alteringUserId,
        date,
        performance,
        concerns,
        summary,
        objectivesMet: objectivesMet === true ? 1 : 0,
        trainingsMet: trainingsMet === true ? 1 : 0,
        period,
      };
      const url = `${config.apiBaseUrl}/${config.apiMethodPrefix}/user/review`;
      const response = await axios.post(url, data, this.config);
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  async getUserRequiredActions(userRequiredActionsId) {
    try {
      const url = `${config.apiBaseUrl}/${config.apiMethodPrefix}/user/review/requiredactions`;
      const response = await axios.get(url, { ...this.config, params: { userRequiredActionsId } });
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  async upsertUserRequiredActions(userId, alteringUserId, action, date, type, userRequiredActionsId) {
    try {
      const data = {
        userId,
        alteringUserId,
        action,
        date,
        type,
        userRequiredActionsId,
      };
      const url = `${config.apiBaseUrl}/${config.apiMethodPrefix}/user/review/requiredactions`;
      const response = await axios.post(url, data, this.config);
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  async deleteUserRequiredActions(userId, userRequiredActionsId) {
    try {
      const data = {
        userId: userId,
      };
      const url = `${config.apiBaseUrl}/${config.apiMethodPrefix}/user/review/requiredactions/${userRequiredActionsId}`;
      const response = await axios.delete(url, { ...this.config, data: data });
      return response;
    } catch (error) {
      console.error(error);
    }
  }
}

export default UsersService;

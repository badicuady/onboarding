import { stores } from "@sapper/app";
import axios from "axios";
import config from "../config";

class SessionService {
  constructor() {
    const { session } = stores();
    this.session = session;
    this.sessionUnsubscribe = null;
  }

  async update(data) {
	if (!globalThis.window) { return; }
    this.session.update((vals) => ({ ...vals, ...data }));
    try {
      const response = await axios.post(`${config.baseUrl}${config.sessionSaveUrl}`, data);
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  subscribe(fn) {
    this.sessionUnsubscribe = this.session.subscribe(fn);
  }

  unsubscribe() {
    if (this.sessionUnsubscribe) {
      this.sessionUnsubscribe();
    }
  }
}

export default SessionService;

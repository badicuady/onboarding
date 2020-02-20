import { stores } from "@sapper/app";
import config from "../config";

class SessionService {
	constructor() {
		const { session } = stores();
		this.session = session;
		this.sessionUnsubscribe = null;
	}

	async update(data) {
		this.session.update(vals => ({ ...vals, ...data }));
		const response = await fetch(`${config.baseUrl}${config.sessionSaveUrl}`, {
			method: "POST",
			cache: "no-cache",
			credentials: "same-origin",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(data)
		});
		const json = await response.json();
		return json;
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
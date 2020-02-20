const config = {
	baseUrl: "http://web.onboarding.com:3000",
	sessionSaveUrl: "/utils/session",
	loginPage: "https://sampleoneqa.ipsos.com/#/login",
	loginRedirect: "/auth.html",
	loginParams: {
		response_type: "token",
		realm: "onboarding-realm",
		client_id: "onboarding-web-api-client"
	}
};

Object.defineProperty(config.loginParams, 'state', {
	get() { return `0.${Date.now()}`; },
	enumerable: true
});

export default {
	...config,
	loginParams: {
		...config.loginParams,
		redirect_uri: `${encodeURIComponent(config.baseUrl + config.loginRedirect)}`
	}
}
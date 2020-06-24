let port = globalThis.process
  ? globalThis.process.env.PORT
  : globalThis.window
  ? globalThis.window.location.port
  : 4123;

let env = globalThis.process
  ? globalThis.process.env.ENV
  : "dev";

const milliseconds = {
  sec: 1000,
  sec10: 10 * 1000,
  sec30: 30 * 1000,
  min: 60 * 1000,
  min10: 10 * 60 * 1000,
  min30: 30 * 60 * 1000,
  hour: 60 * 60 * 1000,
  hour6: 6 * 60 * 60 * 1000,
  hour12: 12 * 60 * 60 * 1000,
  day: 24 * 60 * 60 * 1000,
  day2: 2 * 24 * 60 * 60 * 1000,
  day3: 3 * 24 * 60 * 60 * 1000,
  week: 7 * 24 * 60 * 60 * 1000,
};

const envConfig = {
  dev: {
    baseUrl: `http://web.onboarding.com:${port}`,
    apiBaseUrl: "http://api.onboarding.com:3123",
  },
  localdocker: {
    baseUrl: `http://web.onboarding.com:${port}`,
    apiBaseUrl: "http://api.onboarding.com:3123",
  },
  docker: {
    baseUrl: `https://onboardingtest.ipsosinteractive.com`,
    apiBaseUrl: "https://onboardingapitest.ipsosinteractive.com",
  },
};

const config = {
  useLogin: true,
  clientId: "onboarding-web-app",
  sessionSaveUrl: "/utils/session",
  apiTokenResource: "token",
  apiUserInfoResource: "api/users/info",
  apiMethodPrefix: "api",
  hrGroupName: "RSG-RO-HR_learn_dev_M",
  loginSegment: "login",
  loginRedirect: "/auth.html",
  loginParams: {
    response_type: "token",
    realm: "onboarding-realm",
    client_id: "onboarding-web-api-client",
  },
  defaultEmailDomain: "@ipsos.com",
  tabsBgClassColor: "bg-ipsos-blue",
  iconsClassColor: "text-ipsos-purple",
  buttonClassColor: "btn-info",
  milliseconds,
  timeSpans: {
    sec: () => new Date(Date.now() + milliseconds.sec),
    sec10: () => new Date(Date.now() + milliseconds.sec10),
    sec30: () => new Date(Date.now() + milliseconds.sec30),
    min: () => new Date(Date.now() + milliseconds.min),
    mins10: () => new Date(Date.now() + milliseconds.min10),
    mins30: () => new Date(Date.now() + milliseconds.min30),
    hour: () => new Date(Date.now() + milliseconds.hour),
    hour6: () => new Date(Date.now() + milliseconds.hour6),
    hour12: () => new Date(Date.now() + milliseconds.hour12),
    day: () => new Date(Date.now() + milliseconds.day),
    day2: () => new Date(Date.now() + milliseconds.day2),
    day3: () => new Date(Date.now() + milliseconds.day3),
    week: () => new Date(Date.now() + milliseconds.week),
  },
  preventEvent: (e) => {
    e.stopPropagation();
    e.stopImmediatePropagation();
    e.preventDefault();
    return false;
  },
  preventDefault: (e) => {
    e.preventDefault();
    return false;
  },
  preventPropagation: (e) => {
    e.stopPropagation();
    e.stopImmediatePropagation();
    return false;
  },
};

Object.defineProperty(config.loginParams, "state", {
  get() {
    return `0.${Date.now()}`;
  },
  enumerable: true,
});

export default {
  ...config,
  ...envConfig[env],
  loginParams: {
    ...config.loginParams,
    redirect_uri: `${encodeURIComponent(config.baseUrl + config.loginRedirect)}`,
  },
};

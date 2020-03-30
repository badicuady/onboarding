let port = globalThis.process ? globalThis.process.env.PORT : globalThis.window ? globalThis.window.location.port : 4123;

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
  week: 7 * 24 * 60 * 60 * 1000
};

const config = {
  useLogin: true,
  testUser: {
    companyId: "OTX",
    employeeId: "ABadicu",
    departmentId: 1,
    departmentName: "Engineering",
    mangerId: 586,
    isAssignmentManager: false,
    isSurveyCreatorUser: false,
    employeeDirectoryLink: "https://employeedirectory.ipsos.com/PhotoHandler.ashx?Filename=~/Photos/BADICU-3257073.jpg",
    employeeDirectoryId: 3257073,
    securityGroupId: 0,
    isEnabled: false,
    isApproved: false,
    adminNotes: null,
    userId: 655,
    name: "ABadicu",
    fullName: "Badicu, Adrian",
    firstName: "Adrian",
    lastName: "Badicu",
    type: "admin",
    roles: {
      names: ["Admin"]
    },
    createDate: "2011-09-12T03:53:00.000",
    lastUpdateDate: "2011-12-22T06:16:00.000",
    email: "adrian.badicu@ipsos.com",
    alertsEmail: "adrian.badicu@ipsos.com",
    passwordChangeDate: "2012-10-19T08:20:00.000",
    timeZoneId: 47,
    timeZoneOffset: "10:00:00",
    groups: [
      "'' OR ''1''=''1'' --",
      "Access",
      "Coding",
      "Cortex Team",
      "DemoAdmin",
      "Direct",
      "DP",
      "ExpireUsers",
      "IIS Media Production",
      "IIS Quotation",
      "IIS-PM",
      "IIS-Scripting",
      "LiveStream",
      "ManageUserAccess",
      "Metropolis",
      "Moderators",
      "ProjectManager",
      "RSX",
      "Scripting",
      "testgroup"
    ],
    impersonatorUserId: 0
  },
  clientId: "onboarding-web-app", 
  baseUrl: `http://web.onboarding.com:${port}`,
  sessionSaveUrl: "/utils/session",
  apiBaseUrl: "http://api.onboarding.com:3123",
  apiTokenResource: "token",
  apiUserInfoResource: "user/info",
  apiMethodPrefix: "api",
  hrGroupName: "RSG-RO-HR_learn_dev_M",

  loginSegment: "login",
  loginPage: "https://sampleoneqa.ipsos.com/#/login",
  loginRedirect: "/auth.html",
  loginParams: {
    response_type: "token",
    realm: "onboarding-realm",
    client_id: "onboarding-web-api-client"
  },
  defaultEmailDomain: "@ipsos.com",  
  
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
    week: () => new Date(Date.now() + milliseconds.week)
  },
  profileImageReplace: "PhotoHandler\\.ashx\\?Filename=~\\/",
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
  enumerable: true
});

export default {
  ...config,
  loginParams: {
    ...config.loginParams,
    redirect_uri: `${encodeURIComponent(config.baseUrl + config.loginRedirect)}`
  }
};

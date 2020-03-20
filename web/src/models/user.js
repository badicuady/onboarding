import config from "../config";

const addProperties = _this => {
  let _employeeDirectoryLink = "";
  Object.defineProperties(_this, {
    userInfo: { configurable: true, enumerable: true, writable: true, value: "" },
	groups: { configurable: true, enumerable: true, writable: true, value: "" },
	phone: { configurable: true, enumerable: true, writable: true, value: "" },
	name: { configurable: true, enumerable: true, writable: true, value: "" },
	mail: { configurable: true, enumerable: true, writable: true, value: "" },
	guid: { configurable: true, enumerable: true, writable: true, value: "" },
	dn: { configurable: true, enumerable: true, writable: true, value: "" },
	title: { configurable: true, enumerable: true, writable: true, value: "" },
	description: { configurable: true, enumerable: true, writable: true, value: "" },
	postalCode: { configurable: true, enumerable: true, writable: true, value: "" },
	physicalDeliveryOfficeName: { configurable: true, enumerable: true, writable: true, value: "" },
	telephoneNumber: { configurable: true, enumerable: true, writable: true, value: "" },
	givenName: { configurable: true, enumerable: true, writable: true, value: "" },
	displayName: { configurable: true, enumerable: true, writable: true, value: "" },
	co: { configurable: true, enumerable: true, writable: true, value: "" },
	department: { configurable: true, enumerable: true, writable: true, value: "" },
	company: { configurable: true, enumerable: true, writable: true, value: "" },
	streetAddress: { configurable: true, enumerable: true, writable: true, value: "" },
	directReports: { configurable: true, enumerable: true, writable: true, value: "" },
	employeeID: { configurable: true, enumerable: true, writable: true, value: "" },
	userPrincipalName: { configurable: true, enumerable: true, writable: true, value: "" },
	manager: { configurable: true, enumerable: true, writable: true, value: "" },
	mailNickname: { configurable: true, enumerable: true, writable: true, value: "" },
    employeeDirectoryLink: {
      configurable: true,
      enumerable: true,
      get: () => _employeeDirectoryLink,
      set: value => {
        _employeeDirectoryLink = value && value.replace(_linkRex, "");
      }
    }
  });
};

class User {
  constructor(user) {
    addProperties(this);
    this.copyFrom(user);
  }

  copyFrom(user) {
    if (user) {
      for (const ndx in user) {
        if (this.hasOwnProperty(ndx)) {
          this[ndx] = user[ndx];
        }
      }
    }
  }
}

export default User;

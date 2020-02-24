import config from "../config";

const addProperties = _this => {
  const _linkRex = new RegExp(config.profileImageReplace, "gim");
  let _employeeDirectoryLink = "";
  Object.defineProperties(_this, {
    firstName: {
      configurable: true,
      enumerable: true,
      writable: true,
      value: ""
    },
    fullName: {
      configurable: true,
      enumerable: true,
      writable: true,
      value: ""
    },
    email: {
      configurable: true,
      enumerable: true,
      writable: true,
      value: ""
    },
    departmentName: {
      configurable: true,
      enumerable: true,
      writable: true,
      value: ""
    },
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

import GenericModel from "./genericModel";

export enum UserRole {
  Admin = 1,
  HR = 2,
  IT = 3,
  Employee = 4
}

export interface IUserModel {
  firstName: string;
  lastName?: string;
  userName?: string;
  domain?: string;
  password?: string;
  role?: UserRole;
}

export default class UserModel extends GenericModel {
  private _firstName: string = "";
  private _lastName: string = "";
  private _userName: string = "";
  private _domain: string = "";
  private _password: string = "";
  private _role: UserRole = UserRole.Employee;

  constructor(firstName: string | IUserModel, lastName?: string, userName?: string, password?: string, domain?: string, role?: UserRole) {
    super();
    const model: IUserModel = typeof firstName === "object" ? firstName : { firstName, lastName, userName, password, domain, role };
    this._setup(model);
  }

  get firstName() {
    return this._firstName;
  }
  set firstName(firstName) {
    this._firstName = firstName;
  }

  get lastName() {
    return this._lastName;
  }
  set lastName(lastName) {
    this._lastName = lastName;
  }

  get userName() {
    return this._userName;
  }
  set userName(userName) {
    this._userName = userName;
  }

  get domain() {
    return this._domain;
  }
  set domain(domain) {
    this._domain = domain;
  }

  get password() {
    return this._password;
  }
  set password(password) {
    this._password = password;
  }

  get role() {
    return this._role;
  }
  set role(role) {
    this._role = role;
  }

  _setup(model: IUserModel) {
    if (!this._validate(model)) {
      throw new Error(`The model is not valid: «${model}»`);
    }
    this._firstName = model.firstName;
    this._lastName = model.lastName || "";
    this._userName = model.userName || "";
    this._domain = model.domain || "";
    this._password = model.password || "";
    this._role = model.role || UserRole.Employee;
  }
}

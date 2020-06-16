import { IGenericModel, GenericModel } from "..";

export enum UserRole {
  Admin = 1,
  HR = 2,
  IT = 3,
  Employee = 4,
}

export interface IUser {
  id?: number;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  userName?: string;
}

export interface IUserModel extends IGenericModel, IUser {}

export interface IActiveDirectoryUserModel extends IGenericModel {
  name?: string;
  givenName?: string;
  mailNickname?: string;
}

export default class UserModel extends GenericModel implements IUserModel {
  //private static _privateFields: WeakMap<any, any> = new WeakMap();

  private _firstName: string = "";
  private _lastName: string = "";
  private _userName: string = "";
  private _domain: string | null = "";
  private _password: string | null = "";
  private _role: UserRole = UserRole.Employee;

  constructor(userModel: IUserModel | IActiveDirectoryUserModel) {
    super();

    if (userModel && (<IActiveDirectoryUserModel>userModel).givenName) {
      this._setupActiveDirectoryModel(<IActiveDirectoryUserModel>userModel);
    }

    if (userModel && (<IUserModel>userModel).firstName) {
      this.setup(<IUserModel>userModel);
    }
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

  _setupActiveDirectoryModel(model: IActiveDirectoryUserModel) {
    this._firstName = model.givenName || "";
    this._lastName = model.name?.replace(model?.givenName || "", "").trim() || "";
    this._userName = model.mailNickname || "";
    this._domain = null;
    this._password = null;
    this._role = UserRole.Employee;
  }

  setup(model: IUserModel) {
    if (!this.validate(model)) {
      throw new Error(`The model is not valid: «${model}»`);
    }
    this._firstName = model.firstName || "";
    this._lastName = model.lastName || "";
    this._userName = model.userName || "";
    this._role = model.role || UserRole.Employee;
  }
}

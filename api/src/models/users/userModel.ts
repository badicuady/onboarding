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
  departmentId?: number | null;
  startDate?: Date | null;
}

export interface IUserModel extends IGenericModel, IUser {}

export interface IActiveDirectoryUserModel extends IGenericModel {
  name?: string;
  givenName?: string;
  mailNickname?: string;
}

export default class UserModel extends GenericModel implements IUserModel {
  //private static _privateFields: WeakMap<any, any> = new WeakMap();

  private _id?: number;
  private _firstName: string = "";
  private _lastName: string = "";
  private _userName: string = "";
  private _role: UserRole = UserRole.Employee;
  private _departmentId?: number | null = null;
  private _startDate?: Date | null = null;

  constructor(userModel: IUserModel | IActiveDirectoryUserModel) {
    super();

    if (userModel && (<IActiveDirectoryUserModel>userModel).givenName) {
      this._setupActiveDirectoryModel(<IActiveDirectoryUserModel>userModel);
    }

    if (userModel && ((<IUserModel>userModel).firstName || (<IUserModel>userModel).userName)) {
      this.setup(<IUserModel>userModel);
    }
  }

  get id() {
    return this._id;
  }
  set id(id) {
    this._id = id;
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

  get role() {
    return this._role;
  }
  set role(role) {
    this._role = role;
  }

  get departmentId() {
    return this._departmentId;
  }
  set departmentId(departmentId) {
    this._departmentId = departmentId;
  }

  get startDate() {
    return this._startDate;
  }
  set startDate(startDate) {
    this._startDate = startDate;
  }

  _setupActiveDirectoryModel(model: IActiveDirectoryUserModel) {
    this._firstName = model.givenName || "";
    this._lastName = model.name?.replace(model?.givenName || "", "").trim() || "";
    this._userName = model.mailNickname || "";
    this._role = UserRole.Employee;
    this._departmentId = null;
    this._startDate = null;
  }

  setup(model: IUserModel) {
    if (!this.validate(model)) {
      throw new Error(`The model is not valid: «${model}»`);
	}
	this._id = model.id;
    this._firstName = model.firstName || "";
    this._lastName = model.lastName || "";
    this._userName = model.userName || "";
    this._role = model.role || UserRole.Employee;
    this._departmentId = model.departmentId || null;
    this._startDate = model.startDate || null;
  }
}

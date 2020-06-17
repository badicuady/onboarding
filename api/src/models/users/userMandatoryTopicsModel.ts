import { IGenericModel, GenericModel } from "..";

export interface IUserMandatoryTopics {
  id?: number;
  done?: boolean;
  mandatoryTopicsId?: number;
  userId?: number;
  alteringUserId?: number;
  link?: string;
}

export interface IUserMandatoryTopicsModel extends IGenericModel, IUserMandatoryTopics {}

export default class UserMandatoryTopicsModel extends GenericModel implements IUserMandatoryTopicsModel {
  //private static _privateFields: WeakMap<any, any> = new WeakMap();

  private _mandatoryTopicsId: number = 0;
  private _userId: number = 0;
  private _alteringUserId: number = 0;
  private _done: boolean = false;
  private _link: string = "";

  constructor(userMandatoryTopicsModel: IUserMandatoryTopicsModel) {
    super();

    if (userMandatoryTopicsModel) {
      this.setup(userMandatoryTopicsModel);
    }
  }

  get mandatoryTopicsId() {
    return this._mandatoryTopicsId;
  }
  set mandatoryTopicsId(mandatoryTopicsId) {
    this._mandatoryTopicsId = mandatoryTopicsId;
  }

  get userId() {
    return this._userId;
  }
  set userId(userId) {
    this._userId = userId;
  }

  get alteringUserId() {
    return this._alteringUserId;
  }
  set alteringUserId(alteringUserId) {
    this._alteringUserId = alteringUserId;
  }

  get done() {
    return this._done;
  }
  set done(done) {
    this._done = done;
  }

  get link() {
    return this._link;
  }
  set link(link) {
    this._link = link;
  }

  setup(model: IUserMandatoryTopicsModel) {
    if (!this.validate(model)) {
      throw new Error(`The model is not valid: «${model}»`);
    }
    this._mandatoryTopicsId = model.mandatoryTopicsId || 0;
    this._userId = model.userId || 0;
    this._alteringUserId = model.alteringUserId || 0;
    this._done = model.done || false;
    this._link = model.link || "";
  }
}

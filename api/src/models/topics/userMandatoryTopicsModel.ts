import GenericModel, { IGenericModel } from "../genericModel";

export interface IUserMandatoryTopicsModel extends IGenericModel {
  mandatoryTopicsId?: number;
  userId?: number;
  done?: boolean;
}

export default class UserMandatoryTopicsModel extends GenericModel implements IUserMandatoryTopicsModel {
  //private static _privateFields: WeakMap<any, any> = new WeakMap();
  
  private _mandatoryTopicsId: number = 0;
  private _userId:number = 0;
  private _done:boolean = false;
  
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

  get done() {
    return this._done;
  }
  set done(done) {
    this._done = done;
  }

  setup(model: IUserMandatoryTopicsModel) {
    if (!this.validate(model)) {
      throw new Error(`The model is not valid: «${model}»`);
    }
    this._mandatoryTopicsId = model.mandatoryTopicsId || 0;
    this._userId = model.userId || 0;
    this._done = model.done || false;
  }
}

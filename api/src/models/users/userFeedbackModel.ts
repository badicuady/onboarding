import { IGenericModel, GenericModel } from "..";

export interface IUserFeedback {
  id?: number;
  feedback?: string;
  userId?: number;
  userType?: number;
  type?: number;
  period?: number;
  alteringUserId?: number;
}

export interface IUserFeedbackModel extends IGenericModel, IUserFeedback {}

export default class UserFeedbackModel extends GenericModel implements IUserFeedbackModel {
  //private static _privateFields: WeakMap<any, any> = new WeakMap();

  private _feedback: string = "";
  private _userId: number = 0;
  private _alteringUserId: number = 0;
  private _userType: number = 0;
  private _type: number = 0;
  private _period: number = 0;

  constructor(userFeedbackModel: IUserFeedback) {
    super();

    if (userFeedbackModel) {
      this.setup(userFeedbackModel);
    }
  }

  get feedback() {
    return this._feedback;
  }
  set feedback(feedback) {
    this._feedback = feedback;
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

  get userType() {
    return this._userType;
  }
  set userType(userType) {
    this._userType = userType;
  }

  get type() {
    return this._type;
  }
  set type(type) {
    this._type = type;
  }

  get period() {
    return this._period;
  }
  set period(period) {
    this._period = period;
  }

  setup(model: IUserFeedback) {
    if (!this.validate(model)) {
      throw new Error(`The model is not valid: «${model}»`);
    }
    this._feedback = model.feedback || "";
    this._period = model.period || 0;
    this._type = model.type || 0;
    this._userType = model.userType || 0;
    this._userId = model.userId || 0;
  }
}

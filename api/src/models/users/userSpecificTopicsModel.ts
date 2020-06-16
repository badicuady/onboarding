import { IGenericModel, GenericModel } from "..";

export interface IUserSpecificTopics {
  id?: number;
  userId?: number;
  alteringUserId?: number;
  specificTopicName?: string;
  specificTopicMaterials?: string;
  timespanId?: number;
  responsibleId?: number;
  done?: boolean;
  type?: number;
}

export interface IUserSpecificTopicsModel extends IGenericModel, IUserSpecificTopics {}

export default class UserMandatoryTopicsModel extends GenericModel implements IUserSpecificTopicsModel {
  //private static _privateFields: WeakMap<any, any> = new WeakMap();

  private _userId?: number = 0;
  private _alteringUserId?: number = 0;
  private _id?: number = 0;
  private _specificTopicName?: string = "";
  private _specificTopicMaterials?: string = "";
  private _timespanId?: number = 0;
  private _responsibleId?: number = 0;
  private _done: boolean = false;
  private _type?: number = 0;

  constructor(userSpecificTopicsModel: IUserSpecificTopicsModel) {
    super();

    if (userSpecificTopicsModel) {
      this.setup(userSpecificTopicsModel);
    }
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

  get id() {
    return this._id;
  }
  set id(id) {
    this._id = id;
  }

  get specificTopicName() {
    return this._specificTopicName;
  }
  set specificTopicName(specificTopicName) {
    this._specificTopicName = specificTopicName;
  }

  get specificTopicMaterials() {
    return this._specificTopicMaterials;
  }
  set specificTopicMaterials(specificTopicMaterials) {
    this._specificTopicMaterials = specificTopicMaterials;
  }

  get timespanId() {
    return this._timespanId;
  }
  set timespanId(timespanId) {
    this._timespanId = timespanId;
  }

  get responsibleId() {
    return this._responsibleId;
  }
  set responsibleId(responsibleId) {
    this._responsibleId = responsibleId;
  }

  get done() {
    return this._done;
  }
  set done(done) {
    this._done = done;
  }

  get type() {
    return this._type;
  }
  set type(type) {
    this._type = type;
  }

  setup(model: IUserSpecificTopicsModel) {
    if (!this.validate(model)) {
      throw new Error(`The model is not valid: «${model}»`);
    }
	this._userId = model.userId || 0;
	this._alteringUserId = model.alteringUserId || 0;
    this._id = model.id || 0;
    this._specificTopicName = model.specificTopicName || "";
    this._specificTopicMaterials = model.specificTopicMaterials || "";
    this._timespanId = model.timespanId || 0;
    this._responsibleId = model.responsibleId || 0;
    this._done = model.done || false;
    this._type = model.type || 1;
  }
}

import { IGenericModel, GenericModel } from "..";

export interface IUserRequiredActions {
  id?: number;
  action?: string;
  date?: Date;
  type?: number;
  alteringUserId?: number;
  userId?: number;
  userRequiredActionsId?: number;
}

export interface IUserRequiredActionsModel extends IGenericModel, IUserRequiredActions {}

const UserRequiredActionsModel = () => {
  /**
   * Implementing the private pattern
   */
  const _privateFields: WeakMap<IUserRequiredActions, IUserRequiredActions> = new WeakMap();

  return class UserRequiredActionsModel extends GenericModel implements IUserRequiredActionsModel {
    constructor(userRequiredActionsModel: IUserRequiredActions) {
      super();
      _privateFields.set(this, {});
      if (userRequiredActionsModel) {
        this.setup(userRequiredActionsModel);
      }
    }

    get id(): number | undefined {
      return _privateFields.get(this)?.id;
    }
    set id(id) {
      _privateFields.set(this, { ..._privateFields.get(this), id });
    }

    get action(): string | undefined {
      return _privateFields.get(this)?.action;
    }
    set action(action) {
      _privateFields.set(this, { ..._privateFields.get(this), action });
    }

    get date(): Date | undefined {
      return _privateFields.get(this)?.date;
    }
    set date(date) {
      _privateFields.set(this, { ..._privateFields.get(this), date });
    }

    get type(): number | undefined {
      return _privateFields.get(this)?.type;
    }
    set type(type) {
      _privateFields.set(this, { ..._privateFields.get(this), type });
    }

    get userId(): number | undefined {
      return _privateFields.get(this)?.userId;
    }
    set userId(userId) {
      _privateFields.set(this, { ..._privateFields.get(this), userId });
    }

    get alteringUserId(): number | undefined {
      return _privateFields.get(this)?.alteringUserId;
    }
    set alteringUserId(alteringUserId) {
      _privateFields.set(this, { ..._privateFields.get(this), alteringUserId });
    }

    get userRequiredActionsId(): number | undefined {
      return _privateFields.get(this)?.userRequiredActionsId;
    }
    set userRequiredActionsId(userRequiredActionsId) {
      _privateFields.set(this, { ..._privateFields.get(this), userRequiredActionsId });
    }

    setup(model: IUserRequiredActions) {
      if (!this.validate(model)) {
        throw new Error(`The model is not valid: «${model}»`);
      }
      _privateFields.set(this, {
        id: model.id || 0,
        date: model.date || new Date(),
        action: model.action || "",
        type: model.type || 1,
        userId: model.userId || 0,
        alteringUserId: model.alteringUserId || 0,
        userRequiredActionsId: model.userRequiredActionsId || 0,
      });
    }
  };
};

export default UserRequiredActionsModel();

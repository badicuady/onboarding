import { IGenericModel, GenericModel } from "..";

export interface IUserObjectives {
  id?: number;
  description?: string;
  deadline?: Date;
  responsible?: string;
  type?: number;
  userId?: number;
  alteringUserId?: number;
}

export interface IUserObjectivesModel extends IGenericModel, IUserObjectives {}

const UserObjectivesModel = () => {
  /**
   * Implementing the private pattern
   */
  const _privateFields: WeakMap<IUserObjectives, IUserObjectives> = new WeakMap();

  return class UserObjectiveModel extends GenericModel implements IUserObjectivesModel {
    constructor(userObjectiveModel: IUserObjectives) {
      super();
      _privateFields.set(this, {});
      if (userObjectiveModel) {
        this.setup(userObjectiveModel);
      }
    }

    get description(): string | undefined {
      return _privateFields.get(this)?.description;
    }
    set description(description) {
      _privateFields.set(this, { ..._privateFields.get(this), description });
    }

    get deadline(): Date | undefined {
      return _privateFields.get(this)?.deadline;
    }
    set deadline(deadline) {
      _privateFields.set(this, { ..._privateFields.get(this), deadline });
    }

    get responsible(): string | undefined {
      return _privateFields.get(this)?.responsible;
    }
    set responsible(responsible) {
      _privateFields.set(this, { ..._privateFields.get(this), responsible });
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

    get id(): number | undefined {
      return _privateFields.get(this)?.id;
    }
    set id(id) {
      _privateFields.set(this, { ..._privateFields.get(this), id });
    }

    setup(model: IUserObjectives) {
      if (!this.validate(model)) {
        throw new Error(`The model is not valid: «${model}»`);
      }
      _privateFields.set(this, {
        deadline: model.deadline || new Date(Date.now() + 30 * 24 * 3600 * 1000),
        description: model.description || "",
        responsible: model.responsible || "",
        userId: model.userId || 0,
        alteringUserId: model.alteringUserId || 0,
        id: model.id || 0,
        type: model.type || 0,
      });
    }
  };
};

export default UserObjectivesModel();

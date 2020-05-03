import { IGenericModel, GenericModel } from "..";

export interface IUserReview {
  id?: number;
  date?: Date;
  performance?: string;
  concerns?: string;
  summary?: string;
  userId?: number;
  alteringUserId?: number;
  objectivesMet?: boolean;
  trainingsMet?: boolean;
}

export interface IUserReviewModel extends IGenericModel, IUserReview {}

const UserReviewModel = () => {
  /**
   * Implementing the private pattern
   */
  const _privateFields: WeakMap<IUserReview, IUserReview> = new WeakMap();

  return class UserReviewModel extends GenericModel implements IUserReviewModel {
    constructor(userObjectiveModel: IUserReview) {
      super();
      _privateFields.set(this, {});
      if (userObjectiveModel) {
        this.setup(userObjectiveModel);
      }
    }

    get id(): number | undefined {
      return _privateFields.get(this)?.id;
    }
    set id(id) {
      _privateFields.set(this, { ..._privateFields.get(this), id });
    }

    get date(): Date | undefined {
      return _privateFields.get(this)?.date;
    }
    set date(date) {
      _privateFields.set(this, { ..._privateFields.get(this), date });
    }

    get performance(): string | undefined {
      return _privateFields.get(this)?.performance;
    }
    set performance(performance) {
      _privateFields.set(this, { ..._privateFields.get(this), performance });
    }

    get concerns(): string | undefined {
      return _privateFields.get(this)?.concerns;
    }
    set concerns(concerns) {
      _privateFields.set(this, { ..._privateFields.get(this), concerns });
    }

    get summary(): string | undefined {
      return _privateFields.get(this)?.summary;
    }
    set summary(summary) {
      _privateFields.set(this, { ..._privateFields.get(this), summary });
    }

    get alteringUserId(): number | undefined {
      return _privateFields.get(this)?.alteringUserId;
    }
    set alteringUserId(alteringUserId) {
      _privateFields.set(this, { ..._privateFields.get(this), alteringUserId });
    }

    get userId(): number | undefined {
      return _privateFields.get(this)?.userId;
    }
    set userId(userId) {
      _privateFields.set(this, { ..._privateFields.get(this), userId });
    }

    get objectivesMet(): boolean | undefined {
      return _privateFields.get(this)?.objectivesMet;
    }
    set objectivesMet(objectivesMet) {
      _privateFields.set(this, { ..._privateFields.get(this), objectivesMet });
    }

    get trainingsMet(): boolean | undefined {
      return _privateFields.get(this)?.objectivesMet;
    }
    set trainingsMet(trainingsMet) {
      _privateFields.set(this, { ..._privateFields.get(this), trainingsMet });
    }

    setup(model: IUserReview) {
      if (!this.validate(model)) {
        throw new Error(`The model is not valid: «${model}»`);
      }
      _privateFields.set(this, {
        date: model.date || new Date(),
        performance: model.performance || "",
        concerns: model.concerns || "",
        summary: model.summary || "",
        userId: model.userId || 0,
        alteringUserId: model.alteringUserId || 0,
        objectivesMet: model.objectivesMet || false,
        trainingsMet: model.trainingsMet || false
      });
    }
  };
};

export default UserReviewModel();

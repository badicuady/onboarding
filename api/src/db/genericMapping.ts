import { Sequelize, SyncOptions, Model, WhereOptions } from "sequelize";
import { app, argv } from "../config";
import { DBClient } from "./index";
import { IGenericModel } from  "../models";

export interface AbstractType<T> extends Function { prototype: T; }

export interface Type<T> extends Function { new (...args: any[]): T; }

export class GenericDatabase extends Model<any, any> { }

export class GenericMapping {
  protected _sequelize: Sequelize;

  constructor() {
    this._sequelize = DBClient.instance(app[argv.env].db);
    this.initialize();
  }

  initialize():void {
    throw new Error("Override method [initialize]!");
  }

  sync(options:SyncOptions | undefined):void {
    throw new Error("Override method [sync]!");
  }

  associations():void {
	throw new Error("Override method «associations»!");
  }

  async genericCreate(dbModel: typeof GenericDatabase, model: IGenericModel, where: WhereOptions): Promise<[GenericDatabase, boolean]> {
    const plainObjectModel = model.toPlainObject && model.toPlainObject();

    let instance, wasCreated;
    [instance, wasCreated] = await dbModel.findOrCreate({
      where,
      defaults: plainObjectModel
    });

    if (!wasCreated) {
      const [rowsUpdated, allInstances] = await dbModel.update(plainObjectModel, {
        where,
        limit: 1,
        returning: true
      });
      instance =
        rowsUpdated === 1 && allInstances && allInstances.length
          ? allInstances[0]
          : instance;
    }
    return [instance, wasCreated];
  }
}

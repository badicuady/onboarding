import Flatted from "flatted";
import { Utilities } from "./utilities";
import { GenericModel, IGenericModel } from "../../models";

class Extensions {
  static toQueryUri(obj: { [ndx: string]: string }): string {
    return Object.entries(obj)
      .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
      .join("&");
  }

  static toSimplePlainObject(obj: any) {
    return Flatted.parse(Flatted.stringify(obj));
  }

  static toPlainObject(obj: any) {
    if (typeof obj === "object") {
      const plainObject: { [index: string]: any } = {};
      const proto = Object.getPrototypeOf(obj);
      const props = Object.getOwnPropertyNames(proto);
      props.forEach((key) => {
        const description = Object.getOwnPropertyDescriptor(proto, key);
        if (description && typeof description.get === "function") {
          const value = description.get.apply(obj);
          if (!!value || value === false) {
            plainObject[key] = value;
          }
        }
      });
      return plainObject;
    }
    return obj;
  }

  static async asyncForEach(array: Array<any>, callback: Function): Promise<any> {
    return await Utilities.asyncForEach(array, callback);
  }

  static updateObjectWithModel(dbModel: { [key: string]: any }, model: IGenericModel, safe: boolean = true): void {
    const keys = Object.keys(model.toPlainObject && model.toPlainObject());
    if (keys && keys.length > 0) {
      keys.forEach((key) => {
        if (model[key] !== undefined) {
          if (safe) {
            dbModel[key] = model[key] !== undefined ? model[key] : dbModel[key];
          } else {
            dbModel[key] = model[key];
          }
        }
      });
    }
  }
}

export default Extensions;

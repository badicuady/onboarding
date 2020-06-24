import Flatted from "flatted";
import { Utilities, PlainSimpleObject, PlainGenericObject } from "./utilities";
import { IGenericModel } from "../../models";

class Extensions {
  static toQueryUri(obj: PlainSimpleObject): string {
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

  static updateObjectWithModel(dbModel: PlainGenericObject, model: IGenericModel, safe: boolean = true): void {
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

  static filterObjectByKeyNameExclude(raw: PlainGenericObject, excluded: string[]): PlainGenericObject {
    return Object.keys(raw)
      .filter((key) => !excluded.includes(key))
      .reduce((obj:PlainGenericObject, key:string) => {
        obj[key] = raw[key];
        return obj;
      }, {});
  }
}

export default Extensions;

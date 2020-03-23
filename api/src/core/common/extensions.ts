import Flatted from "flatted";
import { Utilities } from "./utilities";

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
      props.forEach(key => {
        const description = Object.getOwnPropertyDescriptor(proto, key);
        if (description && typeof description.get === "function") {
          const value = description.get.apply(obj);
          if (value) {
            plainObject[key] = value;
          }
        }
      });
      return plainObject;
    }
    return obj;
  }

  static async AsyncForEach(array:Array<any>, callback:Function): Promise<any> {
	  await Utilities.AsyncForEach(array, callback);
  }
}

export default Extensions;

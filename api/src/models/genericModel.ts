import Extensions from "../core/common/extensions";

export interface IGenericModel {
  toPlainObject?(): any;
  setup?(model: any): void;
  validate?(model: any): boolean;
}

abstract class GenericModel implements IGenericModel {
  toPlainObject() {
    return Extensions.toPlainObject(this);
  }

  abstract setup(model: any): void;

  validate(model: any): boolean {
    if (!model) {
      throw new Error("The model must not be null");
    }
    const modelKeys = Object.keys(model);
    const proto = Object.getPrototypeOf(this);
    return modelKeys.reduce((result, key) => {
      const description = Object.getOwnPropertyDescriptor(proto, key);
      const existence = description && (typeof description.get === "function" || typeof description.set === "function");
      if (!existence) {
        throw new Error(`The model does not contain key: «${key}»!`);
      }
      return result && existence;
    }, true);
  }
}

export default GenericModel;

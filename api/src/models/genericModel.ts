import Extensions from "../core/utils/extensions";

class GenericModel {
  toPlainObject() {
    return Extensions.toPlainObject(this);
  }

  _setup(model: any) {
    throw new Error("Override method «_setup»!");
  }

  _validate(model: any) {
    if (!model) {
      throw new Error("The model must not be null");
    }
    const modelKeys = Object.keys(model);
    const proto = Object.getPrototypeOf(this);
    return modelKeys.reduce((result, key) => {
      const descr = Object.getOwnPropertyDescriptor(proto, key);
      const existence = descr && (typeof descr.get === "function" || typeof descr.set === "function");
      if (!existence) {
        throw new Error(`The model does not contain key: «${key}»!`);
      }
      return result && existence;
    }, true);
  }
}

export default GenericModel;

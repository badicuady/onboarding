import Flatted from 'flatted';

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
        const descr = Object.getOwnPropertyDescriptor(proto, key);
        if (descr && typeof descr.get === "function") {
          const value = descr.get.apply(obj);
          if (value) {
            plainObject[key] = value;
          }
        }
      });
      return plainObject;
    }
    return obj;
  }
}

export default Extensions;
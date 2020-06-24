type PlainGenericObject = { [key: string]: any };
type PlainSimpleObject = { [key: string]: string };

class Utilities {
  static async asyncForEach(array: Array<any>, callback: Function): Promise<any> {
    const len: number = array.length;
    for (let index = 0; index < len; ++index) {
      await callback(array[index], index, array);
    }
  }
}

export { Utilities, PlainSimpleObject, PlainGenericObject };
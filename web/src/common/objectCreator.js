class DefinitionType {
  IsC(val) {
    return (val & DefinitionType.C) === DefinitionType.C;
  }
  IsE(val) {
    return (val & DefinitionType.E) === DefinitionType.E;
  }
  IsW(val) {
    return (val & DefinitionType.W) === DefinitionType.W;
  }
}

Object.defineProperties(DefinitionType, {
  N: { value: 0, enumerable: true }, // None
  C: { value: 0x01, enumerable: true }, // Configurable
  E: { value: 0x02, enumerable: true }, // Enumerable
  W: { value: 0x04, enumerable: true }, // Writable
  A: { value: 0x01 | 0x02 | 0x04, enumerable: true } //All
});

class ObjectCreator {
  constructor() {
    this.definitionType = new DefinitionType();
  }

  createObjectProperty(obj, name, definition, value, getter, setter) {
    obj = obj || {};
    const def = this.createDefinitions(definition);
    if (value || value === null) {
      def.value = value;
    }
    if (getter) {
      def.get = getter;
    }
    if (setter) {
      def.set = setter;
    }
    Object.defineProperty(obj, name, def);
    return obj;
  }

  createDefinitions(definitionType) {
    definitionType = definitionType || DefinitionType.N;
    return {
      configurable: this.definitionType.IsC(definitionType),
      enumerable: this.definitionType.IsE(definitionType),
      writable: this.definitionType.IsW(definitionType)
    };
  }
}
const objectCreator = new ObjectCreator();

export default objectCreator;
export { DefinitionType };

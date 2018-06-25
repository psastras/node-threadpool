/**
 * @module Serialize
 */
export const serialize = (object: any): string => {
  const replacer = (_: string, value: any) => {
    if (typeof value === "function") {
      return value.toString();
    }
    return value;
  };
  return JSON.stringify(object, replacer, 2);
};

export const deserialize = <T>(serialized: string): T => {
  const reviver = (_: string, value: any) => {
    if (typeof value === "string" && value.indexOf("function ") === 0) {
      const functionTemplate = `(${value}).call(this)`;
      return new Function(functionTemplate);
    }
    return value;
  };
  return JSON.parse(serialized, reviver);
};

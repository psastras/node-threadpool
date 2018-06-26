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

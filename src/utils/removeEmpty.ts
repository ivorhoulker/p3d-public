import pickBy from "lodash.pickby"
export const removeEmpty = <T extends object>(obj: T) => {
    return pickBy(obj, v => v !== "") as Partial<T>
  };
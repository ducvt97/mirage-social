import type { Error } from "../interfaces";
import type { FormError } from "#ui/types";

export const transformErrorObject = (errorObj?: Error): FormError[] => {
  const errorArray: FormError[] = [];

  if (!errorObj) {
    return errorArray;
  }

  for (const key in errorObj) {
    errorArray.push({
      path: key,
      message: errorObj[key],
    });
  }

  return errorArray;
};

export const debounce = (callback: Function, delay: number) => {
  let timer: any;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback();
    }, delay);
  };
};

export const removeLineBreaks = (str: string) => {
  return str.replace(/^[\n\r]+|[\n\r]+$/g, "");
};

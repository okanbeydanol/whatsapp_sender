import {debounce, DebouncedFunc} from 'lodash';
export const debounceFunc = <T extends (...args: any) => any>(
  func: T,
  wait?: number,
): Promise<DebouncedFunc<T>> => {
  return new Promise(async resolve => {
    const debounceR = await debounce(func, wait);
    resolve(debounceR);
  });
};

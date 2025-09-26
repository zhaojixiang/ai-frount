// import * as Big from 'big.js';
import { Big } from 'big.js';

// 配置（可选：设置小数精度和舍入方式）
Big.DP = 2; // 默认小数点后保留 2 位
Big.RM = Big.roundHalfUp; // 四舍五入

/**
 * 加法
 */
export const add = (a: number | string, b: number | string): string => {
  return new Big(a).plus(b).toString();
};

/**
 * 减法
 */
export const subtract = (a: number | string, b: number | string): string => {
  return new Big(a).minus(b).toString();
};

/**
 * 乘法
 */
export const multiply = (a: number | string, b: number | string): string => {
  return new Big(a).times(b).toString();
};

/**
 * 除法
 */
export const divide = (a: number | string, b: number | string): string => {
  if (b === '0' || b === 0) throw new Error('除数不能为 0');
  return new Big(a).div(b).toString();
};

/**
 * 幂运算
 */
export const pow = (a: number | string, n: number): string => {
  return new Big(a).pow(n).toString();
};

/**
 * 开平方（big.js 没有内置 sqrt，这里手动实现）
 */
export const sqrt = (value: number | string): string => {
  const x = new Big(value);
  if (x.lt(0)) throw new Error('不能对负数开方');

  let guess = x.div(2);
  const two = new Big(2);

  // 牛顿迭代法求平方根
  for (let i = 0; i < 50; i++) {
    guess = guess.plus(x.div(guess)).div(two);
  }
  return guess.toString();
};

/**
 * 绝对值
 */
export const abs = (value: number | string): string => {
  return new Big(value).abs().toString();
};

import type { BigNumber } from 'mathjs';
import { all, create } from 'mathjs';

// 创建 mathjs 实例
const math = create(all, { number: 'BigNumber', precision: 64 });

// 定义函数的输入类型
type Numeric = number | string;

// 数学运算封装
const calculate = {
  add: (a: Numeric, b: Numeric): number => {
    const result = math.add(math.bignumber(a), math.bignumber(b));
    return math.number(result as BigNumber) as number; // 显式断言为 BigNumber
  },
  subtract: (a: Numeric, b: Numeric): number => {
    const result = math.subtract(math.bignumber(a), math.bignumber(b));
    return math.number(result as BigNumber) as number; // 显式断言为 BigNumber
  },
  multiply: (a: Numeric, b: Numeric): number => {
    const result = math.multiply(math.bignumber(a), math.bignumber(b));
    return math.number(result as BigNumber) as number; // 显式断言为 BigNumber
  },
  divide: (a: Numeric, b: Numeric): number => {
    const result = math.divide(math.bignumber(a), math.bignumber(b));
    return math.number(result as BigNumber) as number; // 显式断言为 BigNumber
  }
};

export default calculate;

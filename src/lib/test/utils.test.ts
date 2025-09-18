import { abs, add, divide, multiply, pow, sqrt, subtract } from '../utils/mathUtils';

describe('mathUtils', () => {
  describe('add', () => {
    test('should add two positive numbers correctly', () => {
      expect(add(1, 2)).toBe('3');
      expect(add('1.1', '2.2')).toBe('3.3');
    });

    test('should add negative numbers correctly', () => {
      expect(add(-1, -2)).toBe('-3');
      expect(add('-1.5', '2.5')).toBe('1');
    });

    test('should handle string and number inputs', () => {
      expect(add('10', 5)).toBe('15');
      expect(add(5, '2.5')).toBe('7.5');
    });
  });

  describe('subtract', () => {
    test('should subtract two positive numbers correctly', () => {
      expect(subtract(5, 3)).toBe('2');
      expect(subtract('5.5', '2.2')).toBe('3.3');
    });

    test('should subtract negative numbers correctly', () => {
      expect(subtract(-1, -2)).toBe('1');
      expect(subtract('1.5', '2.5')).toBe('-1');
    });
  });

  describe('multiply', () => {
    test('should multiply two positive numbers correctly', () => {
      expect(multiply(3, 4)).toBe('12');
      expect(multiply('1.5', '2')).toBe('3');
    });

    test('should multiply with negative numbers correctly', () => {
      expect(multiply(-3, 4)).toBe('-12');
      expect(multiply('-1.5', '-2')).toBe('3');
    });
  });

  describe('divide', () => {
    test('should divide two positive numbers correctly', () => {
      expect(divide(8, 2)).toBe('4');
      expect(divide('9.9', '3')).toBe('3.3');
    });

    test('should divide with decimal numbers correctly', () => {
      expect(divide('10.5', '2')).toBe('5.25');
    });

    test('should throw error when dividing by zero', () => {
      expect(() => divide(5, 0)).toThrow('除数不能为 0');
      expect(() => divide('10', '0')).toThrow('除数不能为 0');
    });
  });

  describe('pow', () => {
    test('should calculate power correctly', () => {
      expect(pow(2, 3)).toBe('8');
      expect(pow('3', 2)).toBe('9');
    });

    test('should handle negative exponents', () => {
      expect(pow(2, -2)).toBe('0.25');
    });

    test('should handle decimal base', () => {
      expect(pow('1.5', 2)).toBe('2.25');
    });
  });

  describe('sqrt', () => {
    test('should calculate square root correctly', () => {
      expect(sqrt(4)).toBe('2');
      expect(sqrt('9')).toBe('3');
    });

    test('should handle decimal numbers', () => {
      expect(sqrt('2.25')).toBe('1.5');
    });

    test('should throw error when calculating square root of negative number', () => {
      expect(() => sqrt(-4)).toThrow('不能对负数开方');
      expect(() => sqrt('-9')).toThrow('不能对负数开方');
    });
  });

  describe('abs', () => {
    test('should calculate absolute value correctly', () => {
      expect(abs(-5)).toBe('5');
      expect(abs('7')).toBe('7');
      expect(abs('-3.5')).toBe('3.5');
    });

    test('should handle zero', () => {
      expect(abs(0)).toBe('0');
      expect(abs('0')).toBe('0');
    });
  });
});

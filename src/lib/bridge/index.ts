import JsBridge from '@woulsl-app/js-bridge';

import Os from '@/lib/os';

class BridgeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BridgeError';
  }
}

// 定义只能通过 call 调用的 bridge 方法列表
const bridgeList = ['getDeviceInfo', 'shareToPlatform', 'shareMiniProgram', 'menuShare'];

function initBridge() {
  if (Os?.app) {
    const bridge: any = new JsBridge();
    if (bridge.canUseBridge()) {
      // 为每个在 bridgeList 中的方法创建直接调用的包装函数
      bridgeList.forEach((methodName) => {
        if (!bridge[methodName] && bridge.call) {
          bridge[methodName] = function (data?: any, callback?: any) {
            return bridge.call(methodName, data, callback);
          };
        }
      });
      return bridge;
    }
  }

  // 返回一个代理对象，在调用方法时才报错
  return new Proxy(
    {},
    {
      get(_, prop) {
        if (prop === 'canUseBridge') {
          return () => false;
        }

        // 对于 bridgeList 中的方法，返回一个函数，调用时抛出错误
        if (typeof prop === 'string' && bridgeList.includes(prop)) {
          return function () {
            throw new BridgeError(`Bridge is not available: cannot call method '${prop}'`);
          };
        }

        // 对于其他方法，也抛出错误
        return function () {
          throw new BridgeError(`Bridge is not available: cannot call method '${String(prop)}'`);
        };
      }
    }
  );
}

const bridge = initBridge();

export default bridge;
export { BridgeError };

/**
 * 初始化JOJO全局变量
 * @returns
 */
const initJOJO = async () => {
  if (!window.JOJO) window.JOJO = { Os: {} };

  // 异步加载模块
  const [os, utils, request, showPage, loading, toast] = await Promise.all([
    import('../os'),
    import('../utils/index'),
    import('../request').catch(() => null),
    import('../showPage').catch(() => null),
    import('../loading').catch(() => null),
    import('../toast').catch(() => null)
  ]);

  Object.assign(window.JOJO, {
    Os: { ...window.JOJO.Os, ...os.default },
    utils,
    request: request?.default,
    showPage: showPage?.default,
    loading: loading?.default,
    toast: toast?.default
  });

  return window.JOJO;
};

initJOJO();

/**
 * 初始化JOJO全局变量
 * @returns
 */
export const initJOJO = async () => {
  if (!window.JOJO) window.JOJO = { Os: {} };

  // 异步加载模块
  const [os, utils, request, showPage, loading, toast, bridge, popup] = await Promise.all([
    import('./os'),
    import('./utils/index'),
    import('./request').catch(() => null),
    import('./showPage').catch(() => null),
    import('./loading').catch(() => null),
    import('./toast').catch(() => null),
    import('./bridge').catch(() => null),
    import('./popup').catch(() => null)
  ]);

  Object.assign(window.JOJO, {
    Os: { ...window.JOJO.Os, ...os.default },
    Utils: utils?.default,
    request: request?.default,
    showPage: showPage?.default,
    loading: loading?.default,
    toast: toast?.default,
    bridge: bridge?.default,
    popup: popup?.default
  });

  return window.JOJO;
};

// initJOJO();

export default (envName: 'dev' | 'fat' | 'uat') => {
  console.log(envName);

  return {
    // '/api': {
    //   target: `https://api.${envName}.tinman.cn`,
    //   changeOrigin: true
    // }
  };
};

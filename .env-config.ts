/*
 * @Author: ZHENG
 * @Date: 2022-04-30 08:41:04
 * @LastEditors: ZHENG
 * @LastEditTime: 2022-05-24 19:02:06
 * @FilePath: \20220524\.env-config.ts
 * @Description:
 */
/** 请求环境配置 */
type ServiceEnv = Record<EnvType, EnvConfig>;

/** 环境配置 */
const serviceEnvConfig: ServiceEnv = {
  dev: {
    url: 'http://120.79.129.174:8081',
    proxy: '/api'
  },
  test: {
    url: 'http://192.168.3.233:8081',
    proxy: '/api'
  },
  prod: {
    url: 'http://192.168.3.234:8081',
    proxy: '/api'
  }
};

/**
 * 获取环境配置
 * @param env 环境描述
 */
export function getEnvConfig(env: ImportMetaEnv) {
  const { VITE_ENV_TYPE = 'dev' } = env;

  const envConfig = serviceEnvConfig[VITE_ENV_TYPE];

  return envConfig;
}
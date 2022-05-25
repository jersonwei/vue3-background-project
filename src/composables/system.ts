/*
 * @Author: ZHENG
 * @Date: 2022-05-16 15:06:20
 * @LastEditors: ZHENG
 * @LastEditTime: 2022-05-23 11:29:36
 * @FilePath: \work\src\composables\system.ts
 * @Description:
 */
import UAParser from 'ua-parser-js';
import { useAuthStore } from '@/store';
import { isArray, isString } from '@/utils';

interface AppInfo {
  /** 项目名称 */
  name: string;
  /** 项目标题 */
  title: string;
  /** 项目描述 */
  desc: string;
}

/** 项目信息 */
export function useAppInfo(): AppInfo {
  const { VITE_APP_NAME: name, VITE_APP_TITLE: title, VITE_APP_DESC: desc } = import.meta.env;

  return {
    name,
    title,
    desc
  };
}

/** 获取设备信息 */
export function useDeviceInfo() {
  const parser = new UAParser();
  const result = parser.getResult();
  return result;
}

/** 权限判断 */
export function usePermission() {
  const auth = useAuthStore();

  function hasPermission(permission: Auth.RoleType | Auth.RoleType[]) {
    const { userRole } = auth.userInfo;

    let has = userRole === 'teacher';
    if (!has) {
      if (isArray(permission)) {
        has = (permission as Auth.RoleType[]).includes(userRole);
      }
      if (isString(permission)) {
        has = (permission as Auth.RoleType) === userRole;
      }
    }
    return has;
  }

  return {
    hasPermission
  };
}
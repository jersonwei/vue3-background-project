import { h } from 'vue';

/*
 * @Author: ZHENG
 * @Date: 2022-04-30 15:51:30
 * @LastEditors: ZHENG
 * @LastEditTime: 2022-05-24 15:16:11
 * @FilePath: \work\src\views\course\courseMark\columns.ts
 * @Description:
 */
export const columns = [
  {
    title: '序号',
    key: 'tableId',
    width: 80,
    render(row, index) {
      return h('h1', index + 1);
    }
  },
  {
    title: '课程名称',
    key: 'courseName',
    width: 100
  },
  {
    title: '授课班级',
    key: 'className',
    width: 100
  }
];

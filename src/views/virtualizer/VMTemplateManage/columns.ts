/*
 * @Author: ZHENG
 * @Date: 2022-04-30 15:51:30
 * @LastEditors: ZHENG
 * @LastEditTime: 2022-06-08 15:01:36
 * @FilePath: \work\src\views\virtualizer\VMTemplateManage\columns.ts
 * @Description:
 */
import { h, ref } from 'vue';
import { NTag, NSwitch, NAvatar } from 'naive-ui';
import { updateCourseStatusByCourseId } from '@/service';
import { format } from 'date-fns';

export const columns = [
  {
    title: '序号',
    key: 'tableId',
    width: 50,
    render(row, index) {
      return h('h1', index + 1);
    }
  },
  {
    title: '虚拟机名称',
    key: 'courseName',
    width: 120
  },

  {
    title: '虚拟机类型',
    key: 'courseCategoryName',
    width: 100
  },
	{
    title: '虚拟机模板',
    key: 'courseCategoryName',
    width: 100
  },
  // {
  //   title: '试验状态',
  //   key: 'statusName',
  //   width: 100,
  //   render(row: { id: number,status: number }) {
  //     return h(NSwitch, {
  //       value: row.status === 1,
  //       onUpdateValue: async value => {
  //         row.status = row.status === 1 ? 0 : 1;
  //         const params = {
  //           CourseId: row.id,
  //           status: row.status
  //         };
  //         const result = await updateCourse(params);
	// 				if(!result){
	// 					row.status = row.status === 1 ? 0 : 1;
	// 				}
  //       }
  //     });
  //   }
  // },

  {
    title: '创建人',
    key: 'createrName',
    width: 80
  },
  {
    title: '创建日期',
    key: 'createTime',
    width: 100,
		render(row: { createTime: string }) {
				const date = new Date(row.createTime);
        const tags = format(date, 'yyyy-MM-dd')
        return tags;
    }
  }
];
/**
 * @author: ZHENG
 * @description: 上下架
 * @param {*} params
 * @return {*}
 */
const updateCourse = async params => {
  const courseResult = await updateCourseStatusByCourseId(params);
  if (!courseResult.error) {
    window.$message?.success(`${params.status === 1 ? '上架' : '下架'}操作成功`);
    return true;
  }
  return false;
};

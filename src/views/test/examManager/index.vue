<!--
 * @Author: ZHENG
 * @Date: 2022-04-30 14:33:21
 * @LastEditors: ZHENG
 * @LastEditTime: 2022-06-01 15:18:42
 * @FilePath: \work\src\views\test\examManager\index.vue
 * @Description:
-->
<template>
  <n-card class="relative" :bordered="false">
    <FormPro @register="register" @submit="handleSubmit" @reset="reloadTable">
      <template #courseCategorySlot="{ model, field }">
        <n-select v-model:value="model[field]" placeholder="请选择所属类别" :options="courseCategoryOptions" />
      </template>
      <template #majorIdSlot="{ model, field }">
        <n-cascader
          v-model:value="model[field]"
          clearable
          placeholder="请选择所属专业"
          :options="cascaderOptions"
          :check-strategy="'all'"
          :show-path="true"
          remote
          :on-load="handleLoad"
        />
      </template>
      <template #statusSlot="{ model, field }">
        <n-select v-model:value="model[field]" placeholder="请选择课程状态" :options="courseStatusOptions" />
      </template>
    </FormPro>
    <TablePro
      ref="actionRef"
      :columns="columns"
      :request="loadDataTable"
      :row-key="row => row.id"
      :action-column="actionColumn"
      :scroll-x="2200"
    >
      <template #tableTitle>
        <n-button type="primary" @click="addTable">
          <template #icon>
            <n-icon>
              <PlusOutlined />
            </n-icon>
          </template>
          新建试卷
        </n-button>
      </template>
    </TablePro>
  </n-card>
</template>

<script lang="ts" setup>
import { h, reactive, ref } from 'vue';
import { CascaderOption, useMessage } from 'naive-ui';
import { PlusOutlined } from '@vicons/antd';
import { useRouterPush } from '@/composables';
import { getPaperManagerList } from '@/service';
import { getUserInfo } from '@/utils';
import { TablePro, TableAction } from '@/components/TablePro';
import { FormPro, useForm } from '@/components/FormPro';
import { columns } from './columns';
import { schemas } from './schemas';
import { getCourseCategoryOptions, getCollegeLegistOptions, getStatusOptions, getChildren } from './getOptions';

// 获取用户信息
const { userRole } = getUserInfo();



const message = useMessage();
const formData = ref({});
const actionColumn = reactive({
  // Table操作列
  width: 200,
  title: '操作',
  key: 'action',
  fixed: 'right',
  render(record: Recordable<any>) {
    return h(TableAction as any, {
      style: 'button',
      actions: [
        {
          label: '删除',
          icon: 'ic:outline-delete-outline',
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          onClick: handleDelete.bind(null, record)
        },
        {
          label: '编辑',
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          onClick: handleEdit.bind(null, record)
        },

        {
          label: '预览',
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          onClick: handleDetail.bind(null, record)
        }
      ]
    });
  }
});

// 院系和所属类别的下拉查询逻辑
const courseCategoryOptions = ref([]);
const cascaderOptions = ref([]);
const courseStatusOptions = ref([]);

const getOption = async () => {
  courseCategoryOptions.value = await getCourseCategoryOptions();
  cascaderOptions.value = await getCollegeLegistOptions();
  courseStatusOptions.value = await getStatusOptions();
};
getOption();
const handleLoad = (option: CascaderOption) => {
  return new Promise<void>(resolve => {
    window.setTimeout(() => {
      cascaderOptions.value.children = getChildren(option);
      resolve();
    }, 1000);
  });
};

// , {}
const [register] = useForm({
  // 查询FORM
  gridProps: { cols: '1 s:1 m:2 l:3 xl:4 2xl:4' },
  labelWidth: 80,
  schemas
});
/**
 * @author: ZHENG
 * @description: 表格
 */
// table查询
const loadDataTable = async (res: any) => {
  const Param = {
    pageSize: res.size,
    current: res.current
  };
  const result = await getPaperManagerList({ ...formData.value, ...Param });
  return result.data;
};
/**
 * @author: ZHENG
 * @description: 刷新， 重置
 */
const reloadTable = () => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  actionRef.value.reload();
};
// 查询
const handleSubmit = (values: Recordable) => {
  formData.value = values;
  reloadTable();
};

// 删除逻辑
const delModalRef = ref();
const delData = ref<number>(0); // 删除数据的ID
const delText = ref(''); // 删除的文字
// eslint-disable-next-line consistent-return
const handleDelete = (record: Recordable) => {
  if (record.status === '0') {
    return message.error('只有关闭状态试卷才能删除');
  }
  delText.value = record.courseName;
  delData.value = record.id;
  delModalRef.value.showDelModal = true;
};

// 新建和编辑弹窗
const addOrEditModalRef = ref();
// 新建
const addTable = () => {
  addOrEditModalRef.value.showModalFn();
};

/**
 * @author: ZHENG
 * @description: 编辑
 * @param {*} record
 * @return {*}
 */
const handleEdit = (record: Recordable) => {
  addOrEditModalRef.value.editModalFn(record);
};

// 跳转详情页功能
const actionRef = ref(); // 表格
const updateData = ref();
// 定时上架功能
const updateModalRef = ref();
const handUpdateStatus = (record: Recordable) => {
  updateData.value = record;
  console.log(updateData.value);
  updateModalRef.value.showUpdateModal = true;
};

const { routerPush } = useRouterPush();

/**
 * @author: ZHENG
 * @description: 跳转课程预览
 * @param {*} record
 * @return {*}
 */
const handleDetail = (record: Recordable) => {
  courseStore.setCourseInfo(record.id);
  routerPush({ name: 'course_courseDetail', query: { id: record.id } });
};

/**
 * @author: ZHENG
 * @description: 跳转课程信息\配置
 * @param {*} record
 * @return {*}
 */
const handleConfig = (record: Recordable) => {
  courseStore.setCourseInfo(record.id);
  console.log(record.id);
  routerPush({ name: 'course_courseInfo' });
};
</script>
<style scoped></style>
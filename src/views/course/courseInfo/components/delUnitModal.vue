<!--
 * @Author: ZHENG
 * @Date: 2022-05-13 18:02:53
 * @LastEditors: ZHENG
 * @LastEditTime: 2022-06-08 16:32:10
 * @FilePath: \work\src\views\course\courseInfo\components\delUnitModal.vue
 * @Description:
-->
<!--
 * @Author: ZHENG
 * @Date: 2022-05-12 17:34:13
 * @LastEditors: ZHENG
 * @LastEditTime: 2022-05-13 15:33:47
 * @FilePath: \e-class-admin\src\views\course\courseMgt\components\delModal.vue
 * @Description:
-->
<template>
  <n-modal
    v-model:show="showModal"
    :mask-closable="false"
    preset="dialog"
    type="error"
    title="确认"
    :content="`确认删除课时${delData.delText}`"
    positive-text="确认"
    negative-text="取消"
    @positive-click="onPositiveClick"
  />
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { useMessage } from 'naive-ui';
import { deleteUnit } from '@/service';

const message = useMessage();
const showModal = ref(false);
const delData = reactive({
  delText: '',
  delUnitId: 0
});
const showDelModal = from => {
  delData.delText = from.label;
  delData.delUnitId = from.unitId;
  showModal.value = true;
};
const emit = defineEmits(['reset']);
defineExpose({ showDelModal });

// 删除表格值
// eslint-disable-next-line consistent-return
const onPositiveClick = async () => {
  if (!delData) {
    return message.error('删除数据异常');
  }
  const param = {
    unitId: delData.delUnitId
  };
  const result = await deleteUnit(param);
  if (!result.error) {
    message.success('删除数据成功');
  }
  emit('reset');
};
</script>

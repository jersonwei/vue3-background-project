<!--
 * @Author: ZHENG
 * @Date: 2022-05-12 17:34:13
 * @LastEditors: ZHENG
 * @LastEditTime: 2022-05-18 08:49:05
 * @FilePath: \work\src\views\course\courseMgt\components\delModal.vue
 * @Description:
-->
<template>
  <n-modal
    v-model:show="showDelModal"
    :mask-closable="false"
    preset="dialog"
    type="error"
    title="确认"
    :content="`确认删除课程${delText}`"
    positive-text="确认"
    negative-text="取消"
    @positive-click="onPositiveClick"
  />
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { useMessage } from "naive-ui";
import { deleteCourse } from "@/service";

const message = useMessage();
const showDelModal = ref(false);
interface Props {
  delData: number;
  delText: string;
}
const props = withDefaults(defineProps<Props>(), {
  delData: 0,
  delText: "",
});
const emits = defineEmits(["reloadTable"]);

defineExpose({ showDelModal });

// 删除表格值
// eslint-disable-next-line consistent-return
const onPositiveClick = async () => {
  if (!props.delData) {
    return message.error("删除数据异常");
  }
  const param = {
    id: props.delData,
  };
  const result = await deleteCourse(param);
  if (!result.error) {
    message.success("删除课程成功");
  }
  emits("reloadTable");
};
</script>

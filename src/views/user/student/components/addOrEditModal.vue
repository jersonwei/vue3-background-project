<template>
  <n-modal
    ref="newModalRef"
    v-model:show="showModal"
    :mask-closable="false"
    style="width: 800px"
    :show-icon="false"
    preset="dialog"
    :title="`${addOrEdit ? '新建' : '编辑'}学生`"
  >
    <n-scrollbar ref="scrollRef" style="max-height: 750px">
      <!-- :rules="rules" -->
      <n-form
        ref="formRef"
        :rules="rules"
        :model="formParams"
        label-placement="left"
        :label-width="80"
        class="m-2 py-4"
      >
        <n-grid :cols="2" :x-gap="24">
          <n-form-item-gi label="姓名" path="userName">
            <n-input
              v-model:value="formParams.userName"
              placeholder="请输入姓名"
            ></n-input>
          </n-form-item-gi>
          <n-form-item-gi label="学号" path="stunu">
            <n-input v-model:value="formParams.stunu" placeholder="请输入学号"></n-input>
          </n-form-item-gi>
          <n-form-item-gi label="性别" path="sexList">
            <n-select
              v-model:value="formParams.sex"
              clearable
              placeholder="请选择性别"
              :options="sex"
            ></n-select>
          </n-form-item-gi>
          <n-form-item-gi label="院系" path="collegeList">
            <n-select
              v-model:value="formParams.collegeId"
              :options="form.collegeId"
              clearable
              placeholder="请选择院系"
            ></n-select>
          </n-form-item-gi>
          <n-form-item-gi label="专业" path="majorList">
            <n-select
              v-model:value="formParams.majorId"
              :options="form.majorId"
              clearable
              placeholder="请选择专业"
            ></n-select>
          </n-form-item-gi>
          <n-form-item-gi label="班级" path="classList">
            <n-cascader
              v-model:value="formParams.majorId"
              clearable
              placeholder="请选择所属专业"
              :options="cascaderOptions"
              :check-strategy="'child'"
              :show-path="true"
              remote
              :on-load="handleLoad"
            />
            <!-- <n-select
              v-model:value="formParams.classId"
              :options="form.classId"
              clearable
              placeholder="请选择班级"
            ></n-select> -->
          </n-form-item-gi>
          <n-form-item-gi label="手机号" path="phone">
            <n-input
              v-model:value="formParams.phone"
              placeholder="请输入手机号"
            ></n-input>
          </n-form-item-gi>
          <n-form-item-gi label="邮箱" path="email">
            <n-input v-model:value="formParams.email" placeholder="请输入邮箱"></n-input>
          </n-form-item-gi>
          <n-form-item-gi label="身份证号" path="idCard">
            <n-input
              v-model:value="formParams.idCard"
              placeholder="请输入身份证号"
            ></n-input>
          </n-form-item-gi>
          <n-form-item-gi label="入学时间" path="startTime">
            <!-- <n-date-picker v-model:value="formParams.startTime" type="date" clearable /> -->
            <n-input v-model:value="formParams.startTime"></n-input>
          </n-form-item-gi>
          <n-form-item-gi label="地址" path="address" :span="24">
            <CitySelector
              data-type="pcas"
              check-strategy="child"
              @update:value="onSelectItem"
            />
            <n-input
              v-model:value="formParams.address"
              placeholder="请输入地址详情"
            ></n-input>
            <!-- <div><VDistpicker></VDistpicker></div> -->
            <!-- <n-select v-model:value="formParams.address"></n-select> -->
          </n-form-item-gi>
        </n-grid>
      </n-form>
    </n-scrollbar>
    <template #action>
      <n-space>
        <!-- <n-button @click="() => ((showModal = false), (showForm = null))">取消</n-button> -->
        <n-button @click="() => (showModal = false)">取消</n-button>
        <n-button type="info" :loading="formBtnLoading" @click="confirmForm"
          >确定</n-button
        >
      </n-space>
    </template>
  </n-modal>
</template>
<script lang="ts" setup>
import { reactive, ref } from "vue";
import { CascaderOption, useMessage } from "naive-ui";
import {
  REGEXP_NAME,
  REGEXP_NUMBER,
  REGEXP_EMAIL,
  REGEXP_PHONE,
  REGEXP_IDCARD,
} from "@/config";
// import { useDebounceFn } from "@vueuse/core";
// import { useAuthStore } from "@/store";
import { addStudent, putStudent } from "@/service";
import { deafultFormParams } from "@/utils";
import {
  getSexOptions,
  getClassListOptions,
  getCollegeLegistOptions,
  getMajorListOptions,
  getChildren,
} from "../getOptions";
// 选择省市区
const currentItem = ref({});
function onSelectItem(item: any) {
  currentItem.value = item;
  // formParams.address = JSON.stringify(currentItem);
}
const showModal = ref(false);
const addOrEdit = ref(false); // true 新增，false修改
const formBtnLoading = ref(false);
const formRef = ref(); // 表单双向绑定
const message = useMessage(); // 轻提示
const sexOptions = ref();
const cascaderOptions = ref([]);
const getOptions = async () => {
  sexOptions.value = await getSexOptions();
  cascaderOptions.value = await getCollegeLegistOptions();
};
getOptions();
const handleLoad = (option: CascaderOption) => {
  return new Promise<void>((resolve) => {
    cascaderOptions.value.children = getChildren(option);
    resolve();
  });
};

let Form = new FormData();
const emits = defineEmits(["reloadTable"]);
const formParams = reactive({
  userName: "",
  stunu: "",
  sex: "",
  classId: "", // 班级
  // majorId: "", // 专业
  // collegeId: "", // 学院
  phone: "",
  email: "",
  idCard: "",
  // startTime: Date.now(),
  startTime: "",
  address: "",
});

// 下拉
const sex = ref([
  { value: 1, label: "男" },
  { value: 0, label: "女" },
]);
// 获取院系 专业  班级 下拉框的值
const stuDepartmentIdOptions = ref([]);
const stuMajorIdOptions = ref([]);
const stuClassIdOptions = ref([]);
const getOption = async () => {
  stuDepartmentIdOptions.value = await getCollegeLegistOptions();
  stuClassIdOptions.value = await getClassListOptions();
  stuMajorIdOptions.value = await getMajorListOptions();
};
getOption();

const showModalFn = () => {
  deafultFormParams(formParams);
  Form = new FormData();
  addOrEdit.value = true;
  showModal.value = true;
};
const editID = ref();
const editModalFn = (record) => {
  Form = new FormData();
  editID.value = record.id;
  const formData = {
    userName: record.userName,
    stunu: record.stunu,
    sex: record.sex,
    classId: record.classId, // 班级
    phone: record.phone,
    email: record.email,
    idCard: record.idCard,
    startTime: record.startTime,
    address: record.address,
  };
  Object.assign(formParams, formData);
  addOrEdit.value = false;
  showModal.value = true;
};
// 新增修改的Form
const rules = {
  userName: [
    {
      required: true,
      trigger: ["blur", "change"],
      message: "请输入姓名",
    },
    { pattern: REGEXP_NAME, message: "请输入正确的姓名", trigger: ["blur", "change"] },
  ],
  stunu: [
    {
      required: true,
      trigger: ["blur", "change"],
      message: "请输入正确的学号",
    },
    { pattern: REGEXP_NUMBER, trigger: ["blur", "change"], message: "请输入正确的学号" },
  ],
  sex: { required: true, trigger: ["blur", "change"], message: "请选择性别" },
  collegeId: { required: true, trigger: ["blur", "change"], message: "请选择院系" },
  majorId: { required: true, trigger: ["blur", "change"], message: "请选择专业" },
  classId: { required: true, trigger: ["blur", "change"], message: "请选择班级" },
  phone: [
    {
      required: true,
      trigger: ["blur", "change"],
      message: "请输入手机号码",
    },
    { pattern: REGEXP_PHONE, message: "手机号格式有误", trigger: ["blur", "change"] },
  ],
  email: [
    {
      required: true,
      trigger: ["blur", "change"],
      message: "请输入正确的邮箱",
    },
    { pattern: REGEXP_EMAIL, message: "请输入正确的邮箱", trigger: ["blur", "change"] },
  ],
  idCard: [
    {
      required: true,
      trigger: ["blur", "change"],
      message: "请输入正确的身份证号",
    },
    {
      pattern: REGEXP_IDCARD,
      message: "请输入正确的身份证号",
      trigger: ["blur", "change"],
    },
  ],
  startTime: { required: true, trigger: ["blur", "change"], message: "请选择入学日期" },
  address: { required: true, trigger: ["blur", "change"], message: "请填写地址" },
};

const form = reactive({
  classId: [],
  majorId: [],
  collegeId: [],
});

const getList = async () => {
  form.classId = await getClassListOptions();
  form.collegeId = await getCollegeLegistOptions();
  form.majorId = await getMajorListOptions();
};
getList();
const confirmForm = (e: { preventDefault: () => void }) => {
  e.preventDefault();
  formBtnLoading.value = true;
  formRef.value.validate((errors: any) => {
    if (!errors) {
      setTimeout(async () => {
        if (addOrEdit.value === true) {
          Form.append("userName", formParams.userName);
          Form.append("stunu", formParams.stunu);
          Form.append("sex", formParams.sex);
          Form.append("classId", formParams.classId);
          Form.append("collegeId", formParams.collegeId);
          Form.append("phone", formParams.phone);
          Form.append("email", formParams.email);
          Form.append("address", formParams.address);
          Form.append("idCard", formParams.idCard);
          Form.append("startTime", formParams.startTime);
          const result = await addStudent(Form);
          if (!result.error) {
            message.success("新建成功");
          }
          // const { userId } = auth.userInfo;
          // Form.append("lecturer", userId);
          // const result = await addStudent(Form);
          // if (!result.error) {
          //   message.success(`新建成功`);
          // }
        }
        if (addOrEdit.value === false) {
          Form.append("userName", formParams.userName);
          Form.append("stunu", formParams.stunu);
          Form.append("sex", formParams.sex);
          Form.append("classId", formParams.classId);
          Form.append("collegeId", formParams.collegeId);
          Form.append("phone", formParams.phone);
          Form.append("email", formParams.email);
          Form.append("address", formParams.address);
          Form.append("idCard", formParams.idCard);
          Form.append("startTime", formParams.startTime);
          const result = await putStudent(Form);
          console.log(result);
          if (!result.error) {
            message.success(`修改成功`);
          }
        }
        emits("reloadTable");
        showModal.value = false;
      });
      // showForm.value = null;
    } else {
      message.error("请填写完整信息");
    }
    formBtnLoading.value = false;
  });
};
defineExpose({ showModalFn, editModalFn });
</script>

<style></style>

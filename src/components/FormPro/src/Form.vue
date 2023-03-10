<template>
  <n-form v-bind="getBindValue" ref="formElRef" :model="formModel">
    <n-grid v-bind="getGrid">
      <n-gi v-for="schema in getSchema" v-bind="schema.giProps" :key="schema.field">
        <n-form-item :label="schema.label" :path="schema.field">
          <!--标签名右侧温馨提示-->
          <template v-if="schema.labelMessage" #label>
            {{ schema.label }}
            <n-tooltip trigger="hover" :style="schema.labelMessageStyle">
              <template #trigger>
                <n-icon size="18" class="cursor-pointer text-gray-400">
                  <QuestionCircleOutlined />
                </n-icon>
              </template>
              {{ schema.labelMessage }}
            </n-tooltip>
          </template>

          <!--判断插槽-->
          <template v-if="schema.slot">
            <slot
              :name="schema.slot"
              :model="formModel"
              :field="schema.field"
              :value="formModel[schema.field]"
            ></slot>
          </template>

          <!--NCheckbox-->
          <template v-else-if="schema.component === 'NCheckbox'">
            <n-checkbox-group v-model:value="formModel[schema.field]">
              <n-space>
                <n-checkbox
                  v-for="item in schema?.componentProps?.options"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                />
              </n-space>
            </n-checkbox-group>
          </template>

          <!--NRadioGroup-->
          <template v-else-if="schema.component === 'NRadioGroup'">
            <n-radio-group v-model:value="formModel[schema.field]">
              <n-space>
                <n-radio
                  v-for="item in schema?.componentProps?.options"
                  :key="item.value"
                  :value="item.value"
                >
                  {{ item.label }}
                </n-radio>
              </n-space>
            </n-radio-group>
          </template>
          <!--NInputNumber-->
          <template v-else-if="schema.component === 'NInputNumber'">
            <n-input-number
              v-model:value="formModel[schema.field]"
              :class="{ isFull: schema.isFull != false && getProps.isFull }"
              v-bind="getComponentProps(schema)"
            />
          </template>

          <!--NSelect-->
          <template v-else-if="schema.component === 'NSelect'">
            <n-select
              v-model:value="formModel[schema.field]"
              :class="{ isFull: schema.isFull != false && getProps.isFull }"
              v-bind="getComponentProps(schema)"
            />
          </template>

          <!--NDatePicker-->
          <template v-else-if="schema.component === 'NDatePicker'">
            <n-date-picker
              v-model:value="formModel[schema.field]"
              :class="{ isFull: schema.isFull != false && getProps.isFull }"
              v-bind="getComponentProps(schema)"
            />
          </template>
          <!--NTimePicker-->
          <template v-else-if="schema.component === 'NTimePicker'">
            <n-time-picker
              v-model:value="formModel[schema.field]"
              :class="{ isFull: schema.isFull != false && getProps.isFull }"
              v-bind="getComponentProps(schema)"
            />
          </template>
          <!-- 2022-5-10 级联需求 -->
          <!-- <template v-else-if="schema.component === 'NCascader'">
            <n-cascader
              v-model:value="formModel[schema.field]"
              placeholder="没啥用的值"
              v-bind="getComponentProps(schema)"
              :check-strategy="'all'"
              :show-path="true"
              remote
              :on-load="handleLoad"
            />
          </template> -->
          <!--NInput-->
          <template v-else>
            <n-input
              v-model:value="formModel[schema.field]"
              :class="{ isFull: schema.isFull != false && getProps.isFull }"
              v-bind="getComponentProps(schema)"
            />
          </template>
          <!--动态渲染表单组件 不知道为啥不能用-->
          <!-- <component
            v-else
            v-bind="getComponentProps(schema)"
            :is="schema.component"
            v-model:value="formModel[schema.field]"
            :class="{ isFull: schema.isFull != false && getProps.isFull }"
          /> -->
          <!--组件后面的内容-->
          <template v-if="schema.suffix">
            <slot
              :name="schema.suffix"
              :model="formModel"
              :field="schema.field"
              :value="formModel[schema.field]"
            ></slot>
          </template>
        </n-form-item>
      </n-gi>
      <!--提交 重置 展开 收起 按钮-->
      <n-gi
        v-if="getProps.showActionButtonGroup"
        :span="isInline ? '' : 24"
        :suffix="isInline ? true : false"
        #="{ overflow }"
      >
        <n-space
          align="center"
          :justify="isInline ? 'end' : 'start'"
          :style="{ 'margin-left': `${isInline ? 12 : getProps.labelWidth}px` }"
        >
          <n-button
            v-if="getProps.showSubmitButton"
            v-bind="getSubmitBtnOptions"
            :loading="loadingSub"
            @click="handleSubmit"
            >{{ getProps.submitButtonText }}</n-button
          >
          <n-button
            v-if="getProps.showResetButton"
            v-bind="getResetBtnOptions"
            @click="resetFields"
            >{{ getProps.resetButtonText }}</n-button
          >
          <n-button
            v-if="isInline && getProps.showAdvancedButton"
            type="primary"
            text
            icon-placement="right"
            @click="unfoldToggle"
          >
            <template #icon>
              <n-icon v-if="overflow" size="14" class="unfold-icon">
                <DownOutlined />
              </n-icon>
              <n-icon v-else size="14" class="unfold-icon">
                <UpOutlined />
              </n-icon>
            </template>
            {{ overflow ? "展开" : "收起" }}
          </n-button>
        </n-space>
      </n-gi>
    </n-grid>
  </n-form>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed, unref, onMounted, watch } from "vue";
import type { Ref } from "vue";
import { DownOutlined, UpOutlined, QuestionCircleOutlined } from "@vicons/antd";
import type { GridProps } from "naive-ui/lib/grid";
import { usePermission } from "@/composables";
import { deepMerge, isArray } from "@/utils";
import { createPlaceholderMessage } from "./helper";
import { useFormEvents } from "./hooks/useFormEvents";
import { useFormValues } from "./hooks/useFormValues";
import { basicProps } from "./props";
import type { FormSchema, FormProps, FormActionType } from "./types/form";

export default defineComponent({
  name: "BasicUpload",
  components: { DownOutlined, UpOutlined, QuestionCircleOutlined },
  props: {
    ...basicProps,
  },
  emits: ["reset", "submit", "register"],
  setup(props, { emit, attrs }) {
    const defaultFormModel = ref<Recordable>({});
    const formModel = reactive<Recordable>({});
    const propsRef = ref<Partial<FormProps>>({});
    const schemaRef = ref<Nullable<FormSchema[]>>(null);
    const formElRef = ref<Nullable<FormActionType>>(null);
    const gridCollapsed = ref(true);
    const loadingSub = ref(false);
    const isUpdateDefaultRef = ref(false);

    const getSubmitBtnOptions = computed(() => {
      return {
        size: props.size,
        type: "primary",
        ...props.submitButtonOptions,
      };
    });

    const getResetBtnOptions = computed(() => {
      return {
        size: props.size,
        type: "default",
        ...props.resetButtonOptions,
      };
    });

    function getComponentProps(schema) {
      const compProps = schema.componentProps ?? {};
      const { component } = schema;
      return {
        clearable: true,
        placeholder: createPlaceholderMessage(unref(component)),
        ...compProps,
      };
    }

    const getProps = computed(
      (): FormProps => {
        const formProps = { ...props, ...unref(propsRef) } as FormProps;
        const rulesObj: any = {
          rules: {},
        };
        const schemas: any = formProps.schemas || [];
        schemas.forEach((item) => {
          if (item.rules && isArray(item.rules)) {
            rulesObj.rules[item.field] = item.rules;
          }
        });
        return { ...formProps, ...unref(rulesObj) };
      }
    );

    const isInline = computed(() => {
      const { layout } = unref(getProps);
      return layout === "inline";
    });

    const getGrid = computed(
      (): GridProps => {
        const { gridProps } = unref(getProps);
        return {
          ...gridProps,
          collapsed: isInline.value ? gridCollapsed.value : false,
          responsive: "screen",
        };
      }
    );

    const getBindValue = computed(
      () => ({ ...attrs, ...props, ...unref(getProps) } as Recordable)
    );

    const getSchema = computed((): FormSchema[] => {
      const { hasPermission } = usePermission();
      const schemas: FormSchema[] = unref(schemaRef) || (unref(getProps).schemas as any);
      // eslint-disable-next-line no-restricted-syntax
      // for (const schema of schemas) {

      // }
      schemas.forEach((schema, index) => {
        const { defaultValue } = schema;
        if (schema.auth && hasPermission(schema.auth[0])) {
          schemas.splice(index, 1);
        }
        // handle date type
        // dateItemType.includes(component as string)
        if (defaultValue) {
          schema.defaultValue = defaultValue;
        }
      });

      return schemas as FormSchema[];
    });

    const { handleFormValues, initDefault } = useFormValues({
      getProps,
      defaultFormModel,
      getSchema,
      formModel,
    });

    const {
      handleSubmit,
      validate,
      resetFields,
      getFieldsValue,
      clearValidate,
      setFieldsValue,
    } = useFormEvents({
      emit,
      getProps,
      formModel,
      getSchema,
      formElRef: formElRef as Ref<FormActionType>,
      defaultFormModel,
      loadingSub,
      handleFormValues,
    });

    function unfoldToggle() {
      gridCollapsed.value = !gridCollapsed.value;
    }

    async function setProps(formProps: Partial<FormProps>): Promise<void> {
      propsRef.value = deepMerge(unref(propsRef) || {}, formProps);
    }

    const formActionType: Partial<FormActionType> = {
      getFieldsValue,
      setFieldsValue,
      resetFields,
      validate,
      clearValidate,
      setProps,
      submit: handleSubmit,
    };

    watch(
      () => getSchema.value,
      (schema) => {
        if (unref(isUpdateDefaultRef)) {
          return;
        }
        if (schema?.length) {
          initDefault();
          isUpdateDefaultRef.value = true;
        }
      }
    );

    onMounted(() => {
      initDefault();
      emit("register", formActionType);
    });

    return {
      formElRef,
      formModel,
      getGrid,
      getProps,
      getBindValue,
      getSchema,
      getSubmitBtnOptions,
      getResetBtnOptions,
      handleSubmit,
      resetFields,
      loadingSub,
      isInline,
      getComponentProps,
      unfoldToggle,
    };
  },
});
</script>

<style lang="scss" scoped>
.isFull {
  width: 100%;
  justify-content: flex-start;
}

.unfold-icon {
  display: flex;
  align-items: center;
  height: 100%;
  margin-left: -3px;
}
</style>

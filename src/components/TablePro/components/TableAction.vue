<template>
  <div class="tableAction">
    <div class="flex items-center justify-center">
      <template v-for="(action, index) in getActions" :key="`${index}-${action.label}`">
        <n-button v-bind="action" class="mx-2">{{ action.label }}</n-button>
      </template>
      <n-dropdown
        v-if="dropDownActions && getDropdownList.length"
        trigger="hover"
        :options="getDropdownList"
        @select="select"
      >
        <slot name="more"></slot>
        <n-button
          v-if="!$slots.more"
          v-bind="getMoreProps"
          class="mx-2"
          icon-placement="right"
        >
          <div class="flex items-center">
            <span>更多</span>
            <n-icon size="14" class="ml-1">
              <DownOutlined />
            </n-icon>
          </div>
          <!--          <template #icon>-->
          <!--            -->
          <!--          </template>-->
        </n-button>
      </n-dropdown>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, toRaw } from "vue";
import { DownOutlined } from "@vicons/antd";
import { usePermission } from "@/composables";
import { isBoolean, isFunction } from "@/utils";
import { ActionItem } from "@/components/TablePro";

export default defineComponent({
  name: "TableAction",
  components: { DownOutlined },
  props: {
    actions: {
      type: Array as PropType<ActionItem[]>,
      default: null,
      required: true,
    },
    dropDownActions: {
      type: Array as PropType<ActionItem[]>,
      default: null,
    },
    style: {
      type: String as PropType<String>,
      default: "button",
    },
    select: {
      type: Function as PropType<Function>,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      default: () => {},
    },
  },
  setup(props) {
    const { hasPermission, hasBtnPermission } = usePermission();
    // eslint-disable-next-line no-nested-ternary
    const actionType =
      props.style === "button"
        ? "default"
        : props.style === "text"
        ? "primary"
        : "default";
    // eslint-disable-next-line no-nested-ternary
    const actionText =
      props.style === "button" ? undefined : props.style === "text" ? true : undefined;

    const getMoreProps = computed(() => {
      return {
        text: actionText,
        type: actionType,
        size: "small",
      };
    });

    const getDropdownList = computed(() => {
      return (toRaw(props.dropDownActions) || [])
        .filter((action) => {
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          return hasPermission(action.auth) && isIfShow(action);
        })
        .map((action) => {
          const { popConfirm } = action;
          return {
            size: "small",
            text: actionText,
            type: actionType,
            ...action,
            ...popConfirm,
            onConfirm: popConfirm?.confirm,
            onCancel: popConfirm?.cancel,
          };
        });
    });

    function isIfShow(action: ActionItem): boolean {
      const { ifShow } = action;

      // eslint-disable-next-line @typescript-eslint/no-shadow
      let isIfShow = true;

      if (isBoolean(ifShow)) {
        isIfShow = ifShow;
      }
      if (isFunction(ifShow)) {
        isIfShow = ifShow(action);
      }
      return isIfShow;
    }

    const getActions = computed(() => {
      return (toRaw(props.actions) || [])
        .filter((action) => {
          return hasBtnPermission(action.auth) && isIfShow(action);
        })
        .map((action) => {
          const { popConfirm } = action;
          // 需要展示什么风格，自己修改一下参数
          return {
            size: "small",
            text: actionText,
            type: actionType,
            ...action,
            ...(popConfirm || {}),
            onConfirm: popConfirm?.confirm,
            onCancel: popConfirm?.cancel,
            enable: !!popConfirm,
          };
        });
    });

    return {
      getActions,
      getDropdownList,
      getMoreProps,
    };
  },
});
</script>

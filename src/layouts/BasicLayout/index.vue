<!--
 * @Author: ZHENG
 * @Date: 2022-05-16 15:06:20
 * @LastEditors: ZHENG
 * @LastEditTime: 2022-06-09 09:29:02
 * @FilePath: \work\src\layouts\BasicLayout\index.vue
 * @Description:
-->
<template>
  <admin-layout
    :mode="mode"
    :min-width="theme.layout.minWidth"
    :fixed-header-and-tab="theme.fixedHeaderAndTab"
    :header-height="theme.header.height"
    :tab-visible="theme.tab.visible"
    :tab-height="theme.tab.height"
    :sider-visible="siderVisible"
    :sider-width="siderWidth"
    :sider-collapsed-width="siderCollapsedWidth"
    :sider-collapse="app.siderCollapse"
    :add-main-overflow-hidden="addMainOverflowHidden"
    :fixed-footer="theme.footer.fixed"
  >
    <template #header>
      <global-header v-bind="headerProps" />
    </template>
    <template #tab>
      <global-tab />
    </template>
    <template #sider>
      <global-sider />
    </template>
    <global-content @hide-main-overflow="setAddMainOverflowHidden" />
    <template #footer>
      <global-footer />
    </template>
  </admin-layout>
  <setting-drawer />
</template>

<script setup lang="ts">
import AdminLayout from "@soybeanjs/vue-admin-layout";
import { useAppStore, useThemeStore } from "@/store";
import { useBoolean } from "@/hooks";
import { useBasicLayout } from "@/composables";
import {
  SettingDrawer,
  GlobalHeader,
  GlobalTab,
  GlobalSider,
  GlobalContent,
  GlobalFooter,
} from "../common";

const app = useAppStore();
const theme = useThemeStore();

const {
  mode,
  headerProps,
  siderVisible,
  siderWidth,
  siderCollapsedWidth,
} = useBasicLayout();
const { bool: addMainOverflowHidden, setBool: setAddMainOverflowHidden } = useBoolean();
</script>
<style scoped></style>

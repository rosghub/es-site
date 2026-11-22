<script setup lang="ts">
import DefaultTheme from "vitepress/theme";
import DocsSupportAssistantIsland from "./DocsSupportAssistantIsland.vue";

const { Layout } = DefaultTheme;
</script>

<template>
  <Layout>
    <template #layout-bottom>
      <DocsSupportAssistantIsland />
    </template>
  </Layout>
</template>

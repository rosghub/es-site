<script setup lang="ts">
import { onMounted, watch } from "vue";
import { useRoute } from "vitepress";
import DefaultTheme from "vitepress/theme";
import DocsSupportAssistantIsland from "./DocsSupportAssistantIsland.vue";

declare const __ES_SITE_PREVIEW__: boolean;

const { Layout } = DefaultTheme;
const route = useRoute();

// The site has no page at "/", because the web app serves it on the live site.
// In es-site previews only, send that address to the landing page preview
// instead of showing the 404 page. Live builds leave "/" alone.
function redirectPreviewHome() {
  if (__ES_SITE_PREVIEW__ && route.path === "/") {
    window.location.replace("/paint-estimate-app");
  }
}

onMounted(() => {
  redirectPreviewHome();
  watch(() => route.path, redirectPreviewHome);
});
</script>

<template>
  <Layout>
    <template #layout-bottom>
      <DocsSupportAssistantIsland />
    </template>
  </Layout>
</template>

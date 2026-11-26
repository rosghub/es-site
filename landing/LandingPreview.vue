<script setup lang="ts">
// Mounts the React landing page for the es-site preview. The live page is
// rendered by the web app, not by this component.
import { onBeforeUnmount, onMounted, ref } from "vue";

const containerRef = ref<HTMLElement | null>(null);
let root: { unmount: () => void } | null = null;
let isMounted = false;

onMounted(async () => {
  isMounted = true;
  const [{ createElement }, { createRoot }, { default: LandingPage }, { default: WaitlistFormPreview }] =
    await Promise.all([
      import("react"),
      import("react-dom/client"),
      import("./LandingPage"),
      import("./WaitlistFormPreview"),
    ]);

  if (!isMounted || !containerRef.value) {
    return;
  }

  root = createRoot(containerRef.value);
  root.render(createElement(LandingPage, { WaitlistForm: WaitlistFormPreview }));
});

onBeforeUnmount(() => {
  isMounted = false;
  root?.unmount();
  root = null;
});
</script>

<template>
  <!-- vp-raw makes links in the page load normally instead of through the
       VitePress router, the same as on the live site. -->
  <div ref="containerRef" class="vp-raw landing-preview" />
</template>

<style>
/* The web app's base styles set this, and VitePress sets a fixed 24px.
   Match the app so text in the preview takes the same space. */
.landing-preview {
  line-height: 1.5;
}
</style>

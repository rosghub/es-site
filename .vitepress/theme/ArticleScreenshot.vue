<script setup lang="ts">
import { computed } from "vue";

// Screenshots live in public/screenshots, so article pages pass them as props
// instead of markdown images that VitePress would try to bundle.
const props = defineProps<{
  src: string;
  alt: string;
}>();

const sizes = "(max-width: 640px) 70vw, 288px";

const srcSet = computed(() => {
  if (!props.src.startsWith("/screenshots/") || !props.src.endsWith(".png")) {
    return undefined;
  }

  const basePath = props.src.slice(0, -".png".length);
  const variants = [288, 576, 864, 1152]
    .map((width) => `${basePath}_${width}w.png ${width}w`);

  return [...variants, `${props.src} 1440w`].join(", ");
});
</script>

<template>
  <figure class="article-screenshot">
    <img
      :src="src"
      :srcset="srcSet"
      :sizes="sizes"
      :alt="alt"
      loading="lazy"
    >
  </figure>
</template>

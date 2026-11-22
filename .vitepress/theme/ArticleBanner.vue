<script setup lang="ts">
import { computed } from "vue";

// Banners live in the React app's public directory with width variants from
// scripts/generate-screenshot-srcset.sh, the same as the product page banners.
const props = defineProps<{
  src: string;
  alt: string;
  width: number;
  height: number;
}>();

const sizes = "(max-width: 768px) 100vw, 688px";

const srcSet = computed(() => {
  if (!props.src.endsWith(".png")) {
    return undefined;
  }

  const basePath = props.src.slice(0, -".png".length);
  const variants = [288, 576, 864, 1152]
    .filter((variantWidth) => variantWidth < props.width)
    .map((variantWidth) => `${basePath}_${variantWidth}w.png ${variantWidth}w`);

  return [...variants, `${props.src} ${props.width}w`].join(", ");
});
</script>

<template>
  <figure class="article-banner">
    <img
      :src="src"
      :srcset="srcSet"
      :sizes="sizes"
      :alt="alt"
      :width="width"
      :height="height"
    >
  </figure>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useData } from "vitepress";

const { frontmatter } = useData();

// Dates are YYYY-MM-DD strings. Format them in UTC so the server render and
// the browser agree on the day.
function formatDate(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  return new Date(`${value}T00:00:00Z`).toLocaleDateString("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const published = computed(() => formatDate(frontmatter.value.date));
const updated = computed(() =>
  frontmatter.value.updated && frontmatter.value.updated !== frontmatter.value.date
    ? formatDate(frontmatter.value.updated)
    : undefined
);
</script>

<template>
  <div class="article-byline">
    <p class="article-byline__author">
      Written with {{ frontmatter.author }}, EstimateSync's co-founder and a
      painter with 15 years of estimating.
    </p>
    <p v-if="published" class="article-byline__dates">
      <time :datetime="frontmatter.date">{{ published }}</time>
      <template v-if="updated">
        · Updated <time :datetime="frontmatter.updated">{{ updated }}</time>
      </template>
    </p>
  </div>
</template>

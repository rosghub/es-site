<script setup lang="ts">
import { useData } from "vitepress";

const { frontmatter } = useData();
</script>

<template>
  <figure class="article-quote">
    <blockquote>
      <p><slot /></p>
    </blockquote>
    <figcaption>{{ frontmatter.author }}</figcaption>
  </figure>
</template>

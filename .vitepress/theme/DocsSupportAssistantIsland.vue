<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vitepress";

type DocsSupportAssistantRoot = {
  render: (route: string) => void;
  unmount: () => void;
};

const containerRef = ref<HTMLElement | null>(null);
const route = useRoute();
const router = useRouter();
let assistantRoot: DocsSupportAssistantRoot | null = null;
let isMounted = false;
let assistantModulePromise:
  | Promise<typeof import("@docs-support-assistant")>
  | null = null;

function normalizeRoutePath(routePath: string): string {
  return routePath.split(/[?#]/)[0] || "/";
}

function isSupportRoute(routePath: string): boolean {
  return (
    routePath.startsWith("/docs/guide/") ||
    routePath.startsWith("/docs/reference/")
  );
}

function loadAssistantModule() {
  assistantModulePromise ??= import(
    "@docs-support-assistant"
  );
  return assistantModulePromise;
}

async function syncAssistant(routePath: string) {
  const currentRoute = normalizeRoutePath(routePath);

  if (!isMounted || !isSupportRoute(currentRoute)) {
    assistantRoot?.unmount();
    assistantRoot = null;
    return;
  }

  if (assistantRoot) {
    assistantRoot.render(currentRoute);
    return;
  }

  await nextTick();

  if (!isMounted || !containerRef.value) {
    return;
  }

  const { mountDocsSupportAssistant } = await loadAssistantModule();
  const latestRoute = normalizeRoutePath(route.path);

  if (!isMounted || !containerRef.value || !isSupportRoute(latestRoute)) {
    return;
  }

  assistantRoot = mountDocsSupportAssistant(
    containerRef.value,
    latestRoute,
    {
      onNavigateSupportRoute: (href) => {
        if (isSupportRoute(normalizeRoutePath(href))) {
          void router.go(href);
          return;
        }

        window.location.assign(href);
      },
    }
  );
}

onMounted(() => {
  isMounted = true;
  void syncAssistant(route.path);
});

watch(
  () => route.path,
  (routePath) => {
    void syncAssistant(routePath);
  }
);

onBeforeUnmount(() => {
  isMounted = false;
  assistantRoot?.unmount();
  assistantRoot = null;
});
</script>

<template>
  <div ref="containerRef" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useData } from "vitepress";

type ProductHero = {
  lead?: string | string[];
  image?: string;
  imageAlt?: string;
};

type ProductBanner = {
  image?: string;
  imageAlt?: string;
  sourceWidth?: number;
};

type ProductSection = {
  heading?: string;
  body?: string | string[];
  bullets?: string[];
  image?: string;
  imageAlt?: string;
  imagePosition?: "left" | "right";
};

type ProductLink = {
  label?: string;
  href?: string;
  description?: string;
};

type ProductFrontmatter = {
  banner?: ProductBanner;
  hero?: ProductHero;
  sections?: ProductSection[];
  relatedLinks?: ProductLink[];
};

const { frontmatter } = useData();

const product = computed<ProductFrontmatter>(() => frontmatter.value.product ?? {});
const banner = computed(() => product.value.banner ?? {});
const hero = computed(() => product.value.hero ?? {});
const title = computed(() => String(frontmatter.value.title ?? "EstimateSync"));
const heroLead = computed(() => asTextArray(hero.value.lead));
const sections = computed(() => {
  return Array.isArray(product.value.sections) ? product.value.sections : [];
});
const relatedLinks = computed(() => {
  return Array.isArray(product.value.relatedLinks) ? product.value.relatedLinks : [];
});
const bannerSrcSet = computed(() => buildBannerSrcSet(banner.value.image, banner.value.sourceWidth));
const phoneScreenshotSizes =
  "(max-width: 600px) 240px, (max-width: 960px) 260px, " +
  "(max-width: 1152px) 288px, (max-width: 1440px) 25vw, 360px";

function asTextArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  }

  if (typeof value === "string" && value.trim().length > 0) {
    return [value];
  }

  return [];
}

function imageAlt(value: string | undefined, fallback: string): string {
  return value && value.trim().length > 0 ? value : fallback;
}

function buildBannerSrcSet(imagePath?: string, sourceWidth?: number): string | undefined {
  if (
    !imagePath?.endsWith(".png") ||
    typeof sourceWidth !== "number" ||
    !Number.isFinite(sourceWidth) ||
    sourceWidth <= 0
  ) {
    return undefined;
  }

  const basePath = imagePath.slice(0, -".png".length);
  const variantWidths = [288, 576, 864, 1152].filter((width) => width < sourceWidth);
  const variants = variantWidths.map((width) => `${basePath}_${width}w.png ${width}w`);

  return [...variants, `${imagePath} ${sourceWidth}w`].join(", ");
}

function buildPhoneScreenshotSrcSet(imagePath?: string): string | undefined {
  if (!imagePath?.startsWith("/screenshots/") || !imagePath.endsWith(".png")) {
    return undefined;
  }

  const basePath = imagePath.slice(0, -".png".length);
  const variants = [288, 576, 864, 1152]
    .map((width) => `${basePath}_${width}w.png ${width}w`);

  return [...variants, `${imagePath} 1440w`].join(", ");
}

function sectionClass(section: ProductSection) {
  return {
    "product-showcase__feature--image-left": section.image && section.imagePosition === "left",
    "product-showcase__feature--no-image": !section.image,
  };
}

const browserScreenshotPaths = new Set<string>();

function isMobileImage(imagePath?: string): boolean {
  if (!imagePath) return false;
  return !browserScreenshotPaths.has(imagePath.toLowerCase());
}
</script>

<template>
  <main class="product-showcase" :class="{ 'product-showcase--has-banner': banner.image }">
    <!-- Decorative background elements -->
    <div class="product-showcase__decor-grid"></div>
    <div class="product-showcase__decor-blob-1"></div>
    <div class="product-showcase__decor-blob-2"></div>
    <div class="product-showcase__decor-blob-3"></div>

    <section v-if="banner.image" class="product-showcase__banner">
      <img
        :src="banner.image"
        :srcset="bannerSrcSet"
        sizes="100vw"
        :alt="imageAlt(banner.imageAlt, title)"
      >
    </section>

    <!-- Hero Section -->
    <section class="product-showcase__hero">
      <div class="product-showcase__hero-copy">
        <h1>{{ title }}</h1>
        <p
          v-for="paragraph in heroLead"
          :key="paragraph"
          class="product-showcase__lead"
        >
          {{ paragraph }}
        </p>
      </div>

      <div v-if="hero.image" class="product-showcase__media-container hero-media">
        <!-- Ambient Blur Glow Behind Device -->
        <div class="product-showcase__glow"></div>
        
        <!-- Mobile Phone Frame Mockup (Subtle) -->
        <div v-if="isMobileImage(hero.image)" class="phone-mockup">
          <div class="phone-frame">
            <div class="phone-screen">
              <img
                :src="hero.image"
                :srcset="buildPhoneScreenshotSrcSet(hero.image)"
                :sizes="phoneScreenshotSizes"
                :alt="imageAlt(hero.imageAlt, title)"
                class="product-showcase__screenshot"
              >
            </div>
          </div>
        </div>

        <!-- Browser Frame Mockup (Subtle) -->
        <div v-else class="browser-mockup">
          <div class="browser-chrome">
            <div class="browser-dots">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </div>
          </div>
          <div class="browser-screen">
            <img
              :src="hero.image"
              :alt="imageAlt(hero.imageAlt, title)"
              class="product-showcase__screenshot"
            >
          </div>
        </div>
      </div>
    </section>

    <!-- Features Sections -->
    <section
      v-for="section in sections"
      :key="section.heading"
      class="product-showcase__feature"
      :class="sectionClass(section)"
    >
      <div class="product-showcase__feature-copy">
        <h2>{{ section.heading }}</h2>
        <p v-for="paragraph in asTextArray(section.body)" :key="paragraph">
          {{ paragraph }}
        </p>
        <ul v-if="asTextArray(section.bullets).length > 0" class="product-showcase__bullets">
          <li v-for="bullet in asTextArray(section.bullets)" :key="bullet" class="product-showcase__bullet-item">
            <span class="product-showcase__bullet-icon" aria-hidden="true">✓</span>
            <span class="product-showcase__bullet-text">{{ bullet }}</span>
          </li>
        </ul>
      </div>

      <div v-if="section.image" class="product-showcase__media-container feature-media">
        <!-- Ambient Blur Glow Behind Device -->
        <div class="product-showcase__glow"></div>
        
        <!-- Mobile Phone Frame Mockup (Subtle) -->
        <div v-if="isMobileImage(section.image)" class="phone-mockup">
          <div class="phone-frame">
            <div class="phone-screen">
              <img
                :src="section.image"
                :srcset="buildPhoneScreenshotSrcSet(section.image)"
                :sizes="phoneScreenshotSizes"
                :alt="imageAlt(section.imageAlt, section.heading ?? title)"
                class="product-showcase__screenshot"
              >
            </div>
          </div>
        </div>

        <!-- Browser Frame Mockup (Subtle) -->
        <div v-else class="browser-mockup">
          <div class="browser-chrome">
            <div class="browser-dots">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </div>
          </div>
          <div class="browser-screen">
            <img
              :src="section.image"
              :alt="imageAlt(section.imageAlt, section.heading ?? title)"
              class="product-showcase__screenshot"
            >
          </div>
        </div>
      </div>
    </section>

    <!-- Related Links Section -->
    <section v-if="relatedLinks.length > 0" class="product-showcase__related">
      <h2>Related Resources</h2>
      <div class="product-showcase__related-grid">
        <a
          v-for="link in relatedLinks"
          :key="link.href"
          :href="link.href"
          class="product-showcase__related-card"
        >
          <div class="product-showcase__related-card-content">
            <span class="product-showcase__related-card-title">{{ link.label }}</span>
            <span class="product-showcase__related-card-desc">{{ link.description ?? "Read more" }}</span>
          </div>
          <span class="product-showcase__related-card-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z" clip-rule="evenodd" />
            </svg>
          </span>
        </a>
      </div>
    </section>
  </main>
</template>

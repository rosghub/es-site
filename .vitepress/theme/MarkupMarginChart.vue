<script setup lang="ts">
import { computed } from "vue";

// One price bar split into cost and profit. Two brackets under it show the
// same profit measured against the cost (markup) and the price (margin).
const props = withDefaults(
  defineProps<{
    cost?: number;
    markupPercent?: number;
  }>(),
  { cost: 1000, markupPercent: 25 }
);

const profit = computed(() => (props.cost * props.markupPercent) / 100);
const price = computed(() => props.cost + profit.value);
const marginPercent = computed(() => (profit.value / price.value) * 100);
const costShare = computed(() => `${(props.cost / price.value) * 100}%`);

function money(value: number): string {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function percent(value: number): string {
  return `${value.toLocaleString("en-US", { maximumFractionDigits: 1 })}%`;
}
</script>

<template>
  <figure class="markup-chart">
    <div class="markup-chart__bar" aria-hidden="true">
      <span class="markup-chart__cost" :style="{ width: costShare }">
        Cost {{ money(cost) }}
      </span>
      <span class="markup-chart__profit">
        {{ money(profit) }}
      </span>
    </div>
    <div class="markup-chart__span" :style="{ width: costShare }">
      <strong>Markup {{ percent(markupPercent) }}</strong>
      = {{ money(profit) }} profit ÷ {{ money(cost) }} cost
    </div>
    <div class="markup-chart__span">
      <strong>Margin {{ percent(marginPercent) }}</strong>
      = {{ money(profit) }} profit ÷ {{ money(price) }} price
    </div>
  </figure>
</template>

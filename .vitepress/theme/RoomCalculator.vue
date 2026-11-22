<script setup lang="ts">
import { computed, reactive } from "vue";
import { roomMath } from "./roomMath";

// Starts on the article's example room so the results match the text.
const room = reactive({
  length: 23,
  width: 10,
  height: 9,
  coats: 2,
  spreadRate: 350,
});

const result = computed(() =>
  roomMath(
    Number(room.length),
    Number(room.width),
    Number(room.height),
    Number(room.coats),
    Number(room.spreadRate)
  )
);

const fields = [
  { key: "length", label: "Length (ft)", step: "0.5", min: "0" },
  { key: "width", label: "Width (ft)", step: "0.5", min: "0" },
  { key: "height", label: "Height (ft)", step: "0.5", min: "0" },
  { key: "coats", label: "Coats", step: "1", min: "1" },
  { key: "spreadRate", label: "Spread rate (sq ft/gal)", step: "25", min: "0" },
] as const;

function format(value: number): string {
  return value.toLocaleString("en-US", { maximumFractionDigits: 1 });
}

function gallonLabel(count: number): string {
  return count === 1 ? "1 gallon" : `${count} gallons`;
}
</script>

<template>
  <section class="room-calculator" aria-labelledby="room-calculator-title">
    <p id="room-calculator-title" class="room-calculator__title">Try it on your own room</p>
    <div class="room-calculator__inputs">
      <label v-for="field in fields" :key="field.key" class="room-calculator__field">
        <span>{{ field.label }}</span>
        <input
          v-model="room[field.key]"
          type="number"
          inputmode="decimal"
          :step="field.step"
          :min="field.min"
        >
      </label>
    </div>
    <dl class="room-calculator__results" aria-live="polite">
      <div>
        <dt>Perimeter</dt>
        <dd>{{ format(result.perimeter) }} ft</dd>
      </div>
      <div>
        <dt>Wall area</dt>
        <dd>{{ format(result.wallArea) }} sq ft</dd>
      </div>
      <div>
        <dt>Ceiling area</dt>
        <dd>{{ format(result.ceilingArea) }} sq ft</dd>
      </div>
      <div>
        <dt>Wall paint</dt>
        <dd>{{ gallonLabel(result.wallGallons) }}</dd>
      </div>
      <div>
        <dt>Ceiling paint</dt>
        <dd>{{ gallonLabel(result.ceilingGallons) }}</dd>
      </div>
    </dl>
    <p class="room-calculator__note">
      Uses the same coats for walls and ceiling and rounds paint up to whole
      gallons. Doors and windows aren't subtracted.
    </p>
  </section>
</template>

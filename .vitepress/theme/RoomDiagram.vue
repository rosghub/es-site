<script setup lang="ts">
import { computed } from "vue";
import { roomMath } from "./roomMath";

// Draws the room as an unfolded box: the ceiling, with the four walls laid
// out below it as one strip whose length is the perimeter. Everything is to
// scale, so the strip shows why wall area is perimeter times height.
const props = withDefaults(
  defineProps<{
    length?: number;
    width?: number;
    height?: number;
  }>(),
  { length: 23, width: 10, height: 9 }
);

const room = computed(() => roomMath(props.length, props.width, props.height, 1, 1));
const walls = computed(() => [props.length, props.width, props.length, props.width]);
const ceilingShare = computed(() => `${(props.length / room.value.perimeter) * 100}%`);
</script>

<template>
  <figure class="room-diagram">
    <div class="room-diagram__net" aria-hidden="true">
      <span class="room-diagram__side-label">{{ width }} ft</span>
      <div
        class="room-diagram__ceiling"
        :style="{ width: ceilingShare, aspectRatio: `${length} / ${width}` }"
      >
        <span>Ceiling</span>
        <strong>{{ room.ceilingArea }} sq ft</strong>
      </div>

      <span class="room-diagram__side-label">{{ height }} ft</span>
      <div
        class="room-diagram__walls"
        :style="{ aspectRatio: `${room.perimeter} / ${height}` }"
      >
        <span v-for="(wall, index) in walls" :key="index" :style="{ flexGrow: wall }">
          {{ wall }} ft
        </span>
      </div>

      <span />
      <div class="room-diagram__perimeter">{{ room.perimeter }} ft perimeter</div>
    </div>
    <figcaption>
      Unfold the four walls into one strip. It's {{ room.perimeter }} ft long
      and {{ height }} ft tall, so the walls are {{ room.perimeter }} ×
      {{ height }} = {{ room.wallArea }} sq ft. The ceiling is {{ length }} ×
      {{ width }} = {{ room.ceilingArea }} sq ft.
    </figcaption>
  </figure>
</template>

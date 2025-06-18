<script setup>
import IconPlay from './icons/IconPlay.vue'
import IconPause from './icons/IconPause.vue'
import IconNext from './icons/IconNext.vue'
import IconPrev from './icons/IconPrev.vue'

// This component receives the playing state as a prop
defineProps({
  isPlaying: Boolean,
})

// It emits events for the parent to handle playback logic
const emit = defineEmits(['toggle-play', 'next', 'prev'])
</script>

<template>
  <div class="player-controls">
    <!-- Previous button -->
    <button @click="emit('prev')"><IconPrev /></button>
    <!-- Play/Pause button -->
    <button @click="emit('toggle-play')">
      <IconPause v-if="isPlaying" />
      <IconPlay v-else />
    </button>
    <!-- Next button -->
    <button @click="emit('next')"><IconNext /></button>
  </div>
</template>

<style scoped>
.player-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    background-color: var(--color-background-soft);
    border-top: 1px solid var(--color-border);
}

.player-controls button {
    background: none;
    border: none;
    cursor: pointer;
    margin: 0 1.5rem;
}

.player-controls svg {
    width: 36px;
    height: 36px;
    color: var(--color-text);
    transition: color 0.3s;
}

.player-controls button:hover svg {
    color: hsla(160, 100%, 37%, 1);
}
</style>

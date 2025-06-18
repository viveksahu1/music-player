<script setup>
// This component receives the playlist array as a prop
defineProps({
  playlist: Array
})
// It emits a 'play-song' event when a list item is clicked
const emit = defineEmits(['play-song'])
</script>

<template>
  <div class="playlist">
    <h2>Playlist</h2>
    <ul>
      <!-- Loop through the playlist and display each song -->
      <li 
        v-for="song in playlist" 
        :key="song.id" 
        @click="emit('play-song', song)"
      >
        <strong>{{ song.title }}</strong>
        <span>{{ song.artist }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.playlist {
    padding: 1rem;
}

.playlist h2 {
    font-size: 1.5rem;
    font-weight: 600;
    padding: 0.5rem;
    color: var(--color-heading);
}

.playlist ul {
    list-style: none;
    padding: 0;
}

.playlist li {
    display: flex;
    flex-direction: column;
    padding: 1rem 0.75rem;
    border-bottom: 1px solid var(--color-border);
    cursor: pointer;
    transition: background-color 0.3s;
}

.playlist li:hover {
    background-color: hsla(160, 100%, 37%, 0.2);
}

.playlist li strong {
    font-weight: 500;
    color: var(--color-heading);
}
.playlist li span {
    font-size: 0.9rem;
    color: var(--color-text);
}
</style>

<script setup>
// This component receives the currently playing song as a prop
defineProps({
  currentSong: Object
})

// Handles errors if an album art image fails to load
const onImgError = (event) => {
    event.target.src = 'https://placehold.co/300x300/282828/f8f8f8?text=Music';
}
</script>

<template>
  <div class="now-playing">
    <!-- Album art display -->
    <div class="album-art">
      <img :src="currentSong.albumArt" alt="Album Art" @error="onImgError" />
    </div>
    <!-- Song title and artist info -->
    <div class="song-info">
      <h2>{{ currentSong.title }}</h2>
      <p>{{ currentSong.artist }}</p>
    </div>
  </div>
</template>

<style scoped>
.now-playing {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    text-align: center;
}

.album-art img {
    width: 280px;
    height: 280px;
    border-radius: 12px;
    margin-bottom: 1.5rem;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    object-fit: cover;
}
        
.song-info h2 {
    font-size: 1.8rem;
    font-weight: 600;
    color: var(--color-heading);
    margin-bottom: 0.5rem;
}

.song-info p {
    font-size: 1.1rem;
    color: var(--color-text);
}
</style>

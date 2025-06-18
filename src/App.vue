<script>
import { ref, onMounted } from 'vue';
import NowPlaying from './components/NowPlaying.vue';
import Playlist from './components/Playlist.vue';
import PlayerControls from './components/PlayerControls.vue';

export default {
  components: {
    NowPlaying,
    Playlist,
    PlayerControls
  },
  setup() {
    // --- IMPORTANT: YOUR SPOTIFY CREDENTIALS ---
    const spotifyClientId = ref('ff5e142633504fa7a0e591acf9f2941b');
    const spotifyClientSecret = ref('8c17118d6a0f447fb04b9a866379fe2');

    // Reactive state for the application
    const playlist = ref([]);
    const currentSongIndex = ref(0);
    const currentSong = ref(null);
    const isPlaying = ref(false);
    const audio = ref(null);

    // --- Spotify API Logic ---

    // 1. Get an access token from Spotify
    const getSpotifyToken = async () => {
      try {
        const response = await fetch('/api/accounts/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(spotifyClientId.value + ':' + spotifyClientSecret.value)
          },
          body: 'grant_type=client_credentials'
        });

        // --- FIX ---
        // Added more detailed error handling to show the specific message from Spotify.
        if (!response.ok) {
          const errorBody = await response.json().catch(() => ({ error_description: 'Could not parse error response from Spotify.' }));
          throw new Error(`Spotify token request failed: ${response.status} ${response.statusText} - ${errorBody.error_description}`);
        }

        const data = await response.json();
        return data.access_token;
      } catch (error) {
        console.error('Full authentication error:', error);
        alert(`Authentication with Spotify failed. Please check the browser console for more details. \n\nError: ${error.message}`);
        return null;
      }
    };

    // 2. Fetch data for multiple albums and build the playlist
    const fetchSpotifyData = async (token) => {
        const albumIds = '382ObEPsp2rxGrnsizN5TX,1A2GTWGtFfWp7KSQTwWOyo,2noRn2Aes5aoNVsU6iWThc';
        try {
            const response = await fetch(`/api/web/v1/albums?ids=${albumIds}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error(`Fetching albums failed with status: ${response.status}`);
            
            const data = await response.json();

            if (data && Array.isArray(data.albums)) {
                const allTracks = [];
                data.albums.forEach(album => {
                    if (album && album.tracks && Array.isArray(album.tracks.items)) {
                        album.tracks.items.forEach(track => {
                            if (track && track.preview_url) {
                                allTracks.push({
                                    id: track.id,
                                    title: track.name,
                                    artist: track.artists.map(artist => artist.name).join(', '),
                                    albumArt: album.images[0]?.url || 'https://via.placeholder.com/300',
                                    src: track.preview_url
                                });
                            }
                        });
                    }
                });
                playlist.value = allTracks;
            } else {
                 console.error('API did not return a valid albums array:', data)
            }
        } catch(error) {
             console.error('Error fetching Spotify data:', error);
        }
    };

    // On component mount, authenticate and fetch the data
    onMounted(async () => {
      if (spotifyClientId.value === 'YOUR_SPOTIFY_CLIENT_ID' || spotifyClientSecret.value === 'YOUR_SPOTIFY_CLIENT_SECRET') {
        alert('Please add your Spotify API credentials to src/App.vue');
        return;
      }
      const token = await getSpotifyToken();
      if (token) {
        await fetchSpotifyData(token);
        if (playlist.value.length > 0) {
            currentSong.value = playlist.value[0];
            currentSongIndex.value = 0;
        }
      }
    });

    // --- Audio Playback Logic ---

    const playSong = (song) => {
      currentSong.value = song
      currentSongIndex.value = playlist.value.findIndex(s => s.id === song.id)
      if (audio.value) {
        audio.value.src = song.src
        audio.value.play()
        isPlaying.value = true
      }
    }

    const togglePlay = () => {
        if (!audio.value) return;
        if (audio.value.paused) {
            audio.value.play()
            isPlaying.value = true
        } else {
            audio.value.pause()
            isPlaying.value = false
        }
    }

    const playNext = () => {
        if (playlist.value.length === 0) return;
        currentSongIndex.value = (currentSongIndex.value + 1) % playlist.value.length
        playSong(playlist.value[currentSongIndex.value])
    }

    const playPrev = () => {
        if (playlist.value.length === 0) return;
        currentSongIndex.value = (currentSongIndex.value - 1 + playlist.value.length) % playlist.value.length
        playSong(playlist.value[currentSongIndex.value])
    }

    return {
      playlist,
      currentSong,
      isPlaying,
      audio,
      playSong,
      togglePlay,
      playNext,
      playPrev
    }
  }
}
</script>

<template>
  <div id="music-webapp">
    <aside class="sidebar">
      <Playlist :playlist="playlist" @play-song="playSong" />
    </aside>

    <main class="main-content">
      <NowPlaying v-if="currentSong" :currentSong="currentSong" />
      <div v-else class="loading">
        <p>Loading your music...</p>
      </div>
      <PlayerControls 
        :isPlaying="isPlaying"
        @toggle-play="togglePlay"
        @next="playNext"
        @prev="playPrev"
      />
    </main>
    
    <audio ref="audio" v-if="currentSong" :src="currentSong.src" @ended="playNext"></audio>
  </div>
</template>

<style scoped>
#music-webapp {
  display: flex;
  height: 100vh;
  background-color: var(--color-background);
  overflow: hidden;
}

.sidebar {
  width: 350px;
  background-color: var(--color-background-soft);
  overflow-y: auto;
  border-right: 1px solid var(--color-border);
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.loading {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>

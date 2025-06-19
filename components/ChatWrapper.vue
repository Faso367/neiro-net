<template>
  <div class="chat-wrapper">
    <div class="chat-header">
      <div class="module-title">{{ moduleTitle }}</div>
      <div class="element-title">{{ elementTitle }}</div>
    </div>

    <div v-if="!recording" class="paused-overlay"
        @click="toggleRecording"
        aria-label="Продолжить"
        :style="{
          boxShadow: `0 0 ${20 + volumeLevel * 100}px rgba(255, 165, 0, ${Math.min(volumeLevel * 5, 0.7)})`
        }"
      >
        <svg viewBox="0 0 100 100" class="play-icon">
          <polygon points="30,20 80,50 30,80" fill="black" />
        </svg>
    </div>

    <div class="chat-content" ref="chatContent">
      <MessageList :messages="messages" />
    </div>

    <ControlsPanel
      :recording="recording"
      :volume="volumeLevel"
      @toggle="toggleRecording"
      @back="$emit('back')"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import ControlsPanel from './chat/ControlsPanel.vue';
import MessageList from './chat/MessageList.vue';

interface Msg {
  sender: 'client' | 'user';
  text: string;
  loading?: boolean;
}

interface ContextDialogService {
  dialogId: string;
}

interface ContectDialogServiceData {
  data: ContextDialogService;
}

const props = defineProps<{
  moduleId: number;
  elementId: number;
  moduleTitle: string;
  moduleDesc: string;
  elementTitle: string;
}>()

const messages = ref<Msg[]>([]);
const recording = ref(false);
const sending = ref(false);
const playing = ref(false);
const forceStop = ref(false);
const volumeLevel = ref(0);

let mediaRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];

let audioContext: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let sourceNode: MediaStreamAudioSourceNode | null = null;
let stream: MediaStream | null = null;

let silenceTimeout: number | null = null;
let checkSilenceInterval: number | null = null;

let contextDialogService: ContectDialogServiceData | null = null;

const { $keycloak } = useNuxtApp()

const chatContent = ref<HTMLElement | null>(null);

const VOLUME_THRESHOLD = 0.03;
const SILENCE_DELAY = 2000;

function appendMessage(text: string, sender: 'client' | 'user') {
  messages.value.push({ sender, text });
}

const checkSilence = () => {
  console.log('[voice-core] checkSilence called');

  if (!recording.value || !analyser || sending.value || playing.value) return;

  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteTimeDomainData(dataArray);

  let sum = 0;
  for (let i = 0; i < dataArray.length; i++) {
    const val = (dataArray[i] - 128) / 128;
    sum += val * val;
  }
  const volume = Math.sqrt(sum / dataArray.length);

  volumeLevel.value = volume;

  console.log('[voice-core] volume:', volume);

  if (volume > VOLUME_THRESHOLD) {
    if (!mediaRecorder || mediaRecorder.state === 'inactive') {
      startRecording();
    }

    if (silenceTimeout) {
      clearTimeout(silenceTimeout);
      silenceTimeout = null;
    }
  } else {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      if (!silenceTimeout) {
        silenceTimeout = window.setTimeout(() => {
          console.log('[voice-core] silence → stopRecording');
          stopRecording();
        }, SILENCE_DELAY);
      }
    }
  }
};

async function startAudioProcessing() {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: false,
      noiseSuppression: false,
      autoGainControl: false,
    }
  });

  audioContext = new AudioContext();

  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }

  console.log('[voice-core] audioContext.state =', audioContext.state);

  analyser = audioContext.createAnalyser();
  sourceNode = audioContext.createMediaStreamSource(stream);
  sourceNode.connect(analyser);
  analyser.fftSize = 2048;

  checkSilenceInterval = window.setInterval(checkSilence, 100);
}

function stopAudioProcessing() {
  if (checkSilenceInterval) {
    clearInterval(checkSilenceInterval);
    checkSilenceInterval = null;
  }

  if (silenceTimeout) {
    clearTimeout(silenceTimeout);
    silenceTimeout = null;
  }

  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }

  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }

  analyser = null;
  sourceNode = null;
}

function startRecording() {
  console.log('[voice-core] startRecording');
  if (!stream) return;

  mediaRecorder = new MediaRecorder(stream);
  audioChunks = [];

  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) audioChunks.push(e.data);
  };

  mediaRecorder.onstop = async () => {
    if (forceStop.value) {
      console.log('[voice-core] force stop → skip sendAudio');
      sending.value = false;
      forceStop.value = false;
      return;
    }

    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
    sending.value = true;
    await sendAudio(audioBlob);
    sending.value = false;
  };

  mediaRecorder.start();
}

function stopRecording() {
  console.log('[voice-core] stopRecording');
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    mediaRecorder.stop();
    sending.value = true;

    volumeLevel.value = 0;
  }
}

async function toggleRecording() {
  console.log(`[voice-core] toggleRecording → ${!recording.value ? 'START' : 'STOP'}`);

  if (!recording.value) {
    await startAudioProcessing();
    recording.value = true;
  } else {
    forceStop.value = true;
    stopRecording();
    stopAudioProcessing();
    recording.value = false;
  }
}

async function sendAudio(blob: Blob) {
  console.log('[voice-core] Sending audio...');

  const formData = new FormData();

  console.log(`contextDialogService: ${contextDialogService}`)
  console.log(contextDialogService)
  formData.append('threadId', contextDialogService?.data.dialogId || '');
  formData.append('roleMessage', 'User');
  formData.append('audioFile', blob, 'voice.m4a');

  const endpoint = 'http://89.169.178.112:8090/api/v1/chat/voice';

  const loadingMsg: Msg = { sender: 'user', text: '', loading: true };
  messages.value.push(loadingMsg);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Authorization': `Bearer ${$keycloak.token}`
      },
      body: formData,
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const result = await response.json();

    loadingMsg.loading = false;
    loadingMsg.text = result.data.transcription ?? '...';

    if (result.data.response) {
      appendMessage(result.data.response, 'client');
    }

    if (result.data.audioUrl) {
      console.log('[voice-core] Playing audio from:', result.data.audioUrl);
      const audio = new Audio(result.data.audioUrl);
      playing.value = true;

      audio.onended = () => {
        console.log('[voice-core] audio playback ended');
        playing.value = false;
      };

      audio.play().catch(err => {
        console.warn('[voice-core] Failed to play assistant audio:', err);
        playing.value = false;
      });
    }
  } catch (err) {
    loadingMsg.loading = false;
    loadingMsg.text = 'Ошибка отправки аудио';
    console.error('[voice-core] error:', err);
  } finally {
    messages.value = messages.value.filter(item => !item.loading)
  }
}

watch(messages, () => {
  requestAnimationFrame(() => {
    if (chatContent.value) {
      chatContent.value.scrollTop = chatContent.value.scrollHeight;
    }
  });
});

onMounted(() => {
  console.log('[voice-core] Mounted, waiting for first toggle');

  const id = 1; 

  const createHistory = async () => {
    try {
      const response = await $fetch(`http://89.169.178.112:8090/api/v1/history-context/${id}:createHistory`, {
        method: 'POST',
        headers: {
          'Accept': '*/*',
          'Authorization': `Bearer ${$keycloak.token}`
        },
        body: {}
      });

      contextDialogService = response;
      console.log('[voice-core] History created:', response);
    } catch (error) {
      console.error('[voice-core] Error creating history:', error);
    }
  };

  createHistory();
});

onBeforeUnmount(() => {
  stopRecording();
  stopAudioProcessing();
});
</script>

<style scoped>
.chat-wrapper {
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  height: 96vh;
  width: 96vh;
  margin: 0 auto;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 16px 0 #e6e6e6;
  padding: 0 8px;
}

.chat-header {
  width: 100%;
  padding: 12px 0 0 0;
  margin-bottom: 8px;
}
.module-title {
  font-size: 1rem;
  font-weight: 500;
  color: #222;
  margin-bottom: 2px;
  padding: 0;
}
.element-title {
  font-size: 0.95rem;
  color: #888;
  margin-bottom: 0;
  padding: 0;
}

.chat-content {
    width: 100%;
  height: 100%;
  /*flex: 1;*/
  overflow-y: auto;
}

/*html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}*/

.paused-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 96vw;
  height: 96vh;
  background: rgba(255, 255, 255, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.play-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  width: 120px;
  height: 120px;
}

.action-btn {
  transition: box-shadow 0.2s ease-out;
}

.play-icon {
  width: 100%;
  height: 100%;
}
</style>
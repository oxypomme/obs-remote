<template>
  <v-card class="mx-auto">
    <div class="d-flex justify-center align-baseline">
      <v-btn-toggle :model-value="toggle" multiple style="gap: 0.5rem">
        <v-btn icon="mdi-twitch" @click="toggleStream"> </v-btn>
        <v-btn icon="mdi-checkbox-blank-circle" @click="toggleRecord"> </v-btn>
        <v-btn icon="mdi-heart" @click="toggleReplay"> </v-btn>
        <v-btn icon="mdi-camera" @click="toggleCamera"> </v-btn>
      </v-btn-toggle>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { useSocketStore } from "@/store/socket";
import { computed, onMounted, ref } from "vue";

const store = useSocketStore();

const isStreaming = ref(false);
const isRecording = ref(false);
const isReplayOn = ref(false);
const isCameraOn = ref(false);

const toggle = computed(() =>
  [isStreaming, isRecording, isReplayOn, isCameraOn]
    .map((v, i) => ({ i, v: v.value }))
    .filter(({ v }) => v)
    .map(({ i }) => i)
);

const toggleStream = async () => {
  if (store.socket) {
    const { outputActive } = await store.socket.call("ToggleStream");
    isStreaming.value = outputActive;
  }
};

const toggleRecord = async () => {
  if (store.socket) {
    await store.socket.call("ToggleRecord");
    isRecording.value = !isRecording.value;
  }
};

const toggleReplay = async () => {
  if (store.socket) {
    const { outputActive } = await store.socket.call("ToggleReplayBuffer");
    isReplayOn.value = outputActive;
  }
};

const toggleCamera = async () => {
  if (store.socket) {
    const { outputActive } = await store.socket.call("ToggleVirtualCam");
    isCameraOn.value = outputActive;
  }
};

const getAllInfos = () => {
  if (store.socket) {
    store.socket.call("GetStreamStatus").then(({ outputActive }) => {
      isStreaming.value = outputActive;
    });
    store.socket.call("GetRecordStatus").then(({ outputActive }) => {
      isRecording.value = outputActive;
    });
    store.socket.call("GetReplayBufferStatus").then(({ outputActive }) => {
      isReplayOn.value = outputActive;
    });
    store.socket.call("GetVirtualCamStatus").then(({ outputActive }) => {
      isCameraOn.value = outputActive;
    });
  }
};

onMounted(() => {
  getAllInfos();
});
</script>

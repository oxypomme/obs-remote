<template>
  <v-card>
    <v-img :src="src" cover> </v-img>
    <v-overlay
      v-model="isLoading"
      contained
      class="align-center justify-center"
    >
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-overlay>
  </v-card>
</template>

<script setup lang="ts">
import { useSocketStore } from "@/store/socket";
import { onBeforeUnmount, onMounted, ref } from "vue";

const scene = ref("");
const src = ref("");
const interval = ref(0);
const isLoading = ref(true);

const store = useSocketStore();

const getCurrentSceneScreen = async () => {
  if (store.socket) {
    const { imageData } = await store.socket.call("GetSourceScreenshot", {
      sourceName: scene.value,
      imageFormat: "webp",
    });
    src.value = imageData;
  }
};

const onCurrentSceneChange = ({ sceneName }: { sceneName: string }) => {
  scene.value = sceneName;

  // Fetch every 100ms
  if (interval.value) {
    clearInterval(interval.value);
  }
  getCurrentSceneScreen().then(() => (isLoading.value = false));
  interval.value = setInterval(getCurrentSceneScreen, 100);
};

const beforeCurrentSceneChange = () => {
  if (interval.value) {
    clearInterval(interval.value);
  }
  isLoading.value = true;
};

const getCurrentScene = async () => {
  if (store.socket) {
    const { currentProgramSceneName } = await store.socket.call(
      "GetCurrentProgramScene"
    );
    onCurrentSceneChange({ sceneName: currentProgramSceneName });
  }
};

const addListenters = () => {
  if (store.socket) {
    store.socket.on("CurrentProgramSceneChanged", onCurrentSceneChange);
    store.socket.on("SceneTransitionStarted", beforeCurrentSceneChange);
  }
};

const removeListeners = () => {
  if (store.socket) {
    store.socket.off("CurrentProgramSceneChanged", onCurrentSceneChange);
    store.socket.off("SceneTransitionStarted", beforeCurrentSceneChange);
  }
};

onMounted(() => {
  getCurrentScene();
  addListenters();
});

onBeforeUnmount(() => {
  removeListeners();
});
</script>

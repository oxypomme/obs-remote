<template>
  <v-card class="mx-auto">
    <v-list>
      <v-list-subheader>Scenes</v-list-subheader>
      <v-list-item
        v-for="(item, i) in items"
        :key="i"
        :value="item.sceneIndex"
        :active="item.sceneName === selected"
        @click="changeScene(item.sceneName)"
      >
        <v-list-item-title v-text="item.sceneName"></v-list-item-title>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { useSocketStore } from "@/store/socket";
import { onBeforeUnmount, onMounted, ref } from "vue";

const store = useSocketStore();

type OBSScene = {
  sceneName: string;
  sceneIndex: number;
};

const items = ref<OBSScene[]>([]);
// const selected = ref<number>(-1);
const selected = ref<string>("");

const changeScene = async (sceneName: string) => {
  if (store.socket) {
    await store.socket.call("SetCurrentProgramScene", {
      sceneName,
    });
  }
};

const getScenes = async () => {
  if (store.socket) {
    const scenesList = await store.socket.call("GetSceneList");
    selected.value = scenesList.currentProgramSceneName;

    items.value = (scenesList.scenes as OBSScene[]).sort(
      (a, b) => b.sceneIndex - a.sceneIndex
    );
  }
};

const onCurrentSceneChange = ({ sceneName }: { sceneName: string }) => {
  selected.value = sceneName;
};

const addListenters = () => {
  if (store.socket) {
    store.socket.on("CurrentProgramSceneChanged", onCurrentSceneChange);
  }
};

const removeListeners = () => {
  if (store.socket) {
    store.socket.off("CurrentProgramSceneChanged", onCurrentSceneChange);
  }
};

onMounted(() => {
  getScenes();
  addListenters();
});

onBeforeUnmount(() => {
  removeListeners();
});
</script>

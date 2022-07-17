<template>
  <v-container>
    <v-row no-gutters>
      <v-col>
        <ProgramPreview />
      </v-col>
      <v-col cols="1"></v-col>
      <v-col cols="4">
        <v-row>
          <v-col cols="12">
            <CommonActions />
          </v-col>
          <v-col cols="12">
            <SceneList />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { onBeforeMount, onBeforeUnmount, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useSocketStore } from "@/store/socket";
import SceneList from "@/components/SceneList.vue";
import ProgramPreview from "@/components/ProgramPreview.vue";
import CommonActions from "@/components/CommonActions.vue";

const router = useRouter();
const store = useSocketStore();

// Auth protected route
onBeforeMount(() => {
  if (store.isSocketDown) {
    router.push("/");
  }
});

const getAllInfos = async () => {
  if (store.socket) {
    const version = await store.socket.call("GetVersion");
    console.log(version);
  }
};

const addListenters = () => {
  if (store.socket) {
    store.socket.once("ConnectionClosed", () => {
      store.$patch({
        socket: undefined,
      });
    });
  }
};

const removeListeners = () => {
  if (store.socket) {
    //
  }
};

onMounted(() => {
  getAllInfos();
  addListenters();
});

onBeforeUnmount(() => {
  removeListeners();
});
</script>

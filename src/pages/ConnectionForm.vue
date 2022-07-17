<template>
  <v-card
    class="mx-auto"
    max-width="350px"
    style="padding: 1rem; margin-top: 1rem"
  >
    <v-form v-model="valid">
      <v-container>
        <v-row>
          <v-text-field
            v-model="hostname"
            :rules="rules.host"
            variant="underlined"
            label="Hostname"
            required
          ></v-text-field>
        </v-row>
        <v-row>
          <v-text-field
            v-model="port"
            :rules="rules.port"
            variant="underlined"
            label="Port"
            type="number"
            required
          ></v-text-field>
        </v-row>
        <v-row>
          <v-text-field
            v-model="password"
            :rules="rules.password"
            variant="underlined"
            label="Password"
            type="password"
            required
          ></v-text-field>
        </v-row>
        <v-row>
          <v-btn
            color="success"
            @click="connectToOBS"
            :disabled="loading || !valid"
            block
          >
            Connect
          </v-btn>
        </v-row>
      </v-container>
    </v-form>
  </v-card>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from "vue";
import OBSWebSocket from "obs-websocket-js";
import { useRouter } from "vue-router";
import { useSocketStore } from "@/store/socket";

// TODO: Set rules
const rules = {
  host: [],
  port: [],
  password: [],
};

const router = useRouter();
const store = useSocketStore();

const valid = ref(true); // TODO: Form validation
const loading = ref(false);
const hostname = ref("192.168.1.34");
const port = ref("4455");
const password = ref("1234456");

// If authed, go to dashboard
onBeforeMount(() => {
  if (!store.isSocketDown) {
    router.push("/dashboard");
  }
});

// Conntect to socket
const connectToOBS = async () => {
  try {
    loading.value = true;
    const obs = new OBSWebSocket();
    await obs.connect(`ws://${hostname.value}:${port.value}/`, password.value, {
      rpcVersion: 1,
    });

    // Put socket in store
    store.$patch({
      socket: obs,
    });

    // console.log("Connected !");
    router.push("/dashboard");
  } catch (error) {
    const err = error as { code: string; message: string };
    console.error("Failed to connect", err.code, err.message);
  } finally {
    loading.value = false;
  }
};
</script>

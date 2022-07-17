import type OBSWebSocket from "obs-websocket-js";
import { defineStore } from "pinia";

export const useSocketStore = defineStore("socket", {
  state: () => ({ socket: undefined as OBSWebSocket | undefined }),
  actions: {},
  getters: {
    isSocketDown: (state) => !state.socket,
  },
});

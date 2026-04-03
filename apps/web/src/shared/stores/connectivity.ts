import { create } from "zustand";

export type ConnectivityMode = "online" | "offline" | "ble";

type ConnectivityState = {
  mode: ConnectivityMode;
  setMode: (mode: ConnectivityMode) => void;
};

export const useConnectivityStore = create<ConnectivityState>((set) => ({
  mode: "online",
  setMode: (mode) => set({ mode }),
}));

import { useConnectivityStore } from "@/shared/stores/connectivity";

export const useConnectivity = () => useConnectivityStore((s) => s.mode);

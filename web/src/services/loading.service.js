import { writable } from "svelte/store";

const loadingStore = () => {
  const { subscribe, set, update } = writable(false);
  return {
    subscribe,
    setVisible: () => {
      return update((_) => true);
    },
    setInvisible: () => {
      return update((_) => false);
    },
    toggle: () => {
      return update((v) => !v);
    },
    reset: () => set(false),
  };
};

export default loadingStore();

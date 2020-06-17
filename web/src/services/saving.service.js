import { writable } from 'svelte/store';

const savingStore = () => {
	const { subscribe, set, update } = writable(false);
	return {
		subscribe,
		saving: () => {
			return update(_ => 1);
		},
		saved: () => {
			return update(_ => 2);
		},
		error: () => {
			return update(_ => 3);
		},
		hide: () => {
			return update(_ => 0);
		},
		reset: () => set(0)
	};
};

export default savingStore();
import { writable } from 'svelte/store';
import config from '../config';

const cache = (function () {
	const _items = {};

	class Cache {
		exists(key) {
			return key in _items && _items.hasOwnProperty(key);
		}

		get(key) {
			return this.exists(key)
				? _items[key].value
				: undefined;
		}

		setOrUpdate(key, value, expire) {
			const now = Date.now();
			if (!(expire instanceof Date)) {
				throw new Error(`Expire param [${expire}] is not a date.`)
			}
			if (expire.getTime() < now) {
				throw new Error(`Expire param [${expire}] must be in the future.`)
			}
			if (value) {
				_items[key] = { expire: expire.getTime(), value };
			}
		}

		set(key, value, expire) {
			if (this.exists(key)) {
				throw new Error(`Key [${key}] exists in the cache.`);
			}
			this.setOrUpdate(key, value, expire);
		}

		update(key, value, expire) {
			if (!this.exists(key)) {
				throw new Error(`Key [${key}] does not exists in the cache.`);
			}
			this.setOrUpdate(key, value, expire);
		}

		clean() {
			const now = Date.now();
			for (const item in _items) {
				if (_items[item].expire <= now) {
					delete _items[item];
				}
			}
		}
	}

	return () => new Cache();
}());

const createCacheStore = () => {
	const _cleanInterval = config.milliseconds.min10;
	const _clean = () => {
		update(_c => { _c.clean(); return _c; });
	};
	setInterval(_clean, _cleanInterval);

	const { subscribe, set, update } = writable(cache());
	return {
		subscribe,
		updateValue: (key, value, expire) => {
			return update(_c => { _c.update(key, value, expire); return _c; });
		},
		setValue: (key, value, expire) => {
			return update(_c => { _c.set(key, value, expire); return _c; });
		},
		setOrUpdateValue: (key, value, expire) => {
			return update(_c => { _c.setOrUpdate(key, value, expire); return _c; });
		},
		reset: () => set(cache())
	};
};

export default createCacheStore();

export const CacheKeys = {
	Data: "sessionData",
	UserData: "userData",
	UserInfo: "userInfo",
	Token: "token",
	AdminService: "adminService",
	Departments: "departments"
};
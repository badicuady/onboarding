import { writable } from "svelte/store";

export const StateInfo = {
  Services: {
    Admin: "Admin",
    Users: "Users",
    Dictionaries: "Dictionaries",
  },
};

const state = (() => {
  const _privateFields = new WeakMap();

  class State {
    constructor() {
      const services = {};
      Object.keys(StateInfo.Services).forEach((e) => (services[StateInfo.Services[e]] = null));
      _privateFields.set(this, {
        services: services,
        mandatoryTopics: new Set(),
        specificTopics: new Map(),
      });
    }

    getService(name) {
      this._isKnowService(name);
      return _privateFields.get(this).services[name];
    }

    getServices() {
      return _privateFields.get(this).services;
    }

    setService(name, instance) {
      this._isKnowService(name);
      const newInstance = { ..._privateFields.get(this) };
      newInstance.services[name] = instance;
      _privateFields.set(this, newInstance);
    }

    setServices(services) {
      for (const name in services) {
        if (services.hasOwnProperty(name)) {
          this.setService(name, services[name]);
        }
      }
    }

    getMandatoryTopics() {
      return _privateFields.get(this).mandatoryTopics;
    }

    setMandatoryTopics(mandatoryTopics) {
      if (mandatoryTopics && mandatoryTopics instanceof Set) {
        _privateFields.set(this, { ..._privateFields.get(this), mandatoryTopics });
      }
    }

    getSpecificTopics() {
      return _privateFields.get(this).specificTopics;
    }

    setSpecificTopics(specificTopics) {
      if (specificTopics && specificTopics instanceof Set) {
        _privateFields.set(this, { ..._privateFields.get(this), specificTopics });
      }
    }

    _isKnowService(name) {
      if (Object.keys(StateInfo.Services).indexOf(name) < 0) {
        throw Error(`Unknown service name ${name}`);
      }
      return true;
    }
  }

  return () => new State();
})();

const createStateStore = () => {
  const { subscribe, set, update } = writable(state());
  return {
    subscribe,
    updateService: (name, instance) => {
      update((_s) => {
        _s.setService(name, instance);
        return _s;
      });
    },
    updateServices: (services) => {
      update((_s) => {
        _s.setServices(services);
        return _s;
      });
    },
    updateMandatoryTopics: (mandatoryTopics) => {
      update((_s) => {
        _s.setMandatoryTopics(mandatoryTopics);
        return _s;
      });
    },
    updateSpecificTopics: (specificTopics) => {
      update((_s) => {
        _s.setSpecificTopics(specificTopics);
        return _s;
      });
    },
    reset: () => set(state()),
  };
};

export default createStateStore();

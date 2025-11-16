const storage = typeof window !== 'undefined' ? window.localStorage : null;

function wrap<T>(callback: () => T | Promise<T>) {
  try {
    const value = callback();
    return value instanceof Promise ? value : Promise.resolve(value);
  } catch (err) {
    return Promise.reject(err);
  }
}

const asyncStorage = {
  getItem(key: string) {
    if (!storage) return Promise.resolve(null);
    return wrap(() => storage.getItem(key));
  },
  setItem(key: string, value: string) {
    if (!storage) return Promise.resolve();
    return wrap(() => storage.setItem(key, value));
  },
  removeItem(key: string) {
    if (!storage) return Promise.resolve();
    return wrap(() => storage.removeItem(key));
  }
};

export default asyncStorage;

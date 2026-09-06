"use client";

import { useCallback, useSyncExternalStore } from "react";

const LOCAL_STORAGE_EVENT = "portfolio-local-storage";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(LOCAL_STORAGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(LOCAL_STORAGE_EVENT, onStoreChange);
  };
}

export function useLocalStorageValue(key: string) {
  const getSnapshot = useCallback(() => {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      console.warn(`Unable to read local storage key "${key}".`, error);
      return null;
    }
  }, [key]);

  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}

export function setLocalStorageValue(key: string, value: string) {
  window.localStorage.setItem(key, value);
  window.dispatchEvent(new Event(LOCAL_STORAGE_EVENT));
}

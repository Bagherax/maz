import { useCallback } from 'react';

// This is a SIMULATED IndexedDB hook using localStorage for demonstration.
// A production implementation would use a library like 'idb'.
const getDbKey = (dbName: string, key: string) => `indexedDB_sim_${dbName}_${key}`;

export const useIndexedDB = (dbName: string) => {

  const setItem = useCallback(async <T>(key: string, value: T): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Simulate async latency
      setTimeout(() => {
        try {
          localStorage.setItem(getDbKey(dbName, key), JSON.stringify(value));
          resolve();
        } catch (error) {
          console.error(`IndexedDB (sim) failed to set item '${key}' in '${dbName}'`, error);
          reject(error);
        }
      }, 50);
    });
  }, [dbName]);

  const getItem = useCallback(async <T>(key: string): Promise<T | null> => {
    return new Promise((resolve) => {
      // Simulate async latency
      setTimeout(() => {
        try {
          const item = localStorage.getItem(getDbKey(dbName, key));
          resolve(item ? JSON.parse(item) : null);
        } catch (error) {
          console.error(`IndexedDB (sim) failed to get item '${key}' from '${dbName}'`, error);
          resolve(null);
        }
      }, 50);
    });
  }, [dbName]);

  const removeItem = useCallback(async (key: string): Promise<void> => {
    return new Promise(resolve => {
        setTimeout(() => {
            localStorage.removeItem(getDbKey(dbName, key));
            resolve();
        }, 10)
    });
  }, [dbName]);

  return { setItem, getItem, removeItem };
};
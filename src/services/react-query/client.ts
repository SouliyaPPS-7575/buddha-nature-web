import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';

// 🔹 A Safe Storage Provider that handles Safari Private mode
const getStorage = () => {
  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, 'test');
    window.localStorage.removeItem(testKey);
    return window.localStorage;
  } catch (e) {
    try {
      // 🟢 Fallback to sessionStorage if localStorage isn't available
      return window.sessionStorage;
    } catch (e) {
      console.warn('⚠️ No Web Storage Available - Using In-Memory Cache');
      // 🏆 In-memory fallback (persists data only during session)
      let memoryStorage: Record<string, string> = {};
      return {
        setItem: (key: string, value: string) => {
          memoryStorage[key] = value;
        },
        getItem: (key: string) => memoryStorage[key] || null,
        removeItem: (key: string) => {
          delete memoryStorage[key];
        },
      };
    }
  }
};

// 🔥 Use this storage strategy everywhere BEFORE persister is created
const storage = getStorage();

// ✅ Create a Query Client
const createQueryClient = () => {
  return new QueryClient();
};

// 🎯 Use the improved storage method
export const persister = createSyncStoragePersister({
  storage, // ✅ storage is now properly initialized before use
});

// 🎯 Initialize Query Client
export const queryClient = createQueryClient();

// 🎯 Automatically Persist React Query Cache
persistQueryClient({
  queryClient,
  persister,
});
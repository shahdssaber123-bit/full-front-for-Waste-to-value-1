import { useState, useEffect, useCallback } from 'react';
import { dataStore } from '@/lib/dataStore';

export function useDataStore() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    dataStore.init();
    const handler = () => setTick(t => t + 1);
    window.addEventListener('wtv-data-change', handler);
    return () => window.removeEventListener('wtv-data-change', handler);
  }, []);

  const refresh = useCallback(() => setTick(t => t + 1), []);

  return {
    operations: dataStore.getOperations(),
    inventory: dataStore.getInventory(),
    users: dataStore.getUsers(),
    reservations: dataStore.getReservations(),
    ratings: dataStore.getRatings(),
    currentUser: dataStore.getCurrentUser(),
    getNotifications: dataStore.getNotifications,
    store: dataStore,
    refresh,
    tick,
  };
}
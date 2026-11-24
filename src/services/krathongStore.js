import { useState, useEffect } from 'react';
import { SAMPLE_KRATHONGS } from '../data/sampleKrathongs';
import { 
  fetchCloudKrathongs, 
  saveCloudKrathong, 
  reactCloudKrathong, 
  clearCloudKrathongs 
} from './cloudSync';
import { presenceService } from './presenceService';
import { 
  initFirebase, 
  isFirebaseActive, 
  pushKrathongToFirebase, 
  subscribeToFirebaseKrathongs, 
  reactToFirebaseKrathong, 
  getStoredFirebaseConfig 
} from './firebase';

const LOCAL_STORAGE_KEY = 'loy_krathong_river_v1';

// Helper to get stored local krathongs
const getStoredLocalKrathongs = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return [];
};

export function useKrathongStore() {
  const [krathongs, setKrathongs] = useState(() => {
    const userSaved = getStoredLocalKrathongs();
    return [...SAMPLE_KRATHONGS, ...userSaved];
  });
  const [isLiveFirebase, setIsLiveFirebase] = useState(false);

  // 1. Initial Load from Cloud Sync & Real-time Live Wire
  useEffect(() => {
    // A. Fetch current krathongs from global cloud storage
    const syncCloud = () => {
      fetchCloudKrathongs().then((cloudList) => {
        if (Array.isArray(cloudList)) {
          setKrathongs((prev) => {
            const map = new Map();
            // Retain positions of already floating krathongs
            prev.forEach((k) => {
              if (k && k.id) map.set(k.id, k);
            });
            cloudList.forEach((k) => {
              if (k && k.id) {
                if (map.has(k.id)) {
                  const existing = map.get(k.id);
                  map.set(k.id, {
                    ...existing,
                    likes: Math.max(existing.likes || 0, k.likes || 0),
                    blessings: Math.max(existing.blessings || 0, k.blessings || 0)
                  });
                } else {
                  map.set(k.id, {
                    ...k,
                    x: k.x !== undefined ? k.x : 0.08 + Math.random() * 0.4,
                    y: k.y !== undefined ? k.y : 0.55 + Math.random() * 0.3,
                    speed: k.speed || 0.00035 + Math.random() * 0.00015,
                    scale: k.scale || 1.1
                  });
                }
              }
            });
            return Array.from(map.values());
          });
        }
      });
    };

    syncCloud();
    const intervalTimer = setInterval(syncCloud, 12000);

    // B. Listen for new krathongs broadcast from any device on earth
    presenceService.onLiveKrathong = (newK) => {
      setKrathongs((prev) => {
        if (prev.some((k) => k.id === newK.id)) return prev;
        return [
          {
            ...newK,
            x: newK.x !== undefined ? newK.x : 0.08 + Math.random() * 0.1,
            y: newK.y !== undefined ? newK.y : 0.6 + Math.random() * 0.25,
            speed: newK.speed || 0.00035 + Math.random() * 0.00015,
            scale: newK.scale || 1.1
          },
          ...prev
        ];
      });
    };

    // C. Listen for live reactions (❤️ / 🙏) from other devices
    presenceService.onLiveReaction = (id, reactionType) => {
      setKrathongs((prev) =>
        prev.map((k) => {
          if (k.id === id) {
            return {
              ...k,
              likes: reactionType === 'like' ? (k.likes || 0) + 1 : (k.likes || 0),
              blessings: reactionType === 'blessing' ? (k.blessings || 0) + 1 : (k.blessings || 0)
            };
          }
          return k;
        })
      );
    };

    // D. Listen for river clear
    presenceService.onLiveClearKrathongs = () => {
      setKrathongs([]);
    };

    return () => {
      clearInterval(intervalTimer);
    };
  }, []);

  // 2. Optional Firebase connection (if configured by user)
  useEffect(() => {
    const hasConfig = getStoredFirebaseConfig();
    if (hasConfig) {
      const success = initFirebase(hasConfig);
      setIsLiveFirebase(success);

      if (success) {
        const unsubscribe = subscribeToFirebaseKrathongs(
          (newK) => {
            setKrathongs((prev) => {
              if (prev.some((k) => k.id === newK.id)) return prev;
              return [
                {
                  ...newK,
                  x: newK.x !== undefined ? newK.x : 0.05 + Math.random() * 0.1,
                  y: newK.y !== undefined ? newK.y : 0.55 + Math.random() * 0.3,
                  speed: 0.0003 + Math.random() * 0.0002,
                  scale: 0.9 + Math.random() * 0.25
                },
                ...prev
              ];
            });
          },
          (allVal) => {
            setKrathongs((prev) =>
              prev.map((k) => {
                if (allVal[k.id]) {
                  return {
                    ...k,
                    likes: allVal[k.id].likes ?? k.likes,
                    blessings: allVal[k.id].blessings ?? k.blessings
                  };
                }
                return k;
              })
            );
          }
        );
        return () => unsubscribe();
      }
    }
  }, []);

  // Add Krathong
  const addKrathong = async (newKrathongData) => {
    const id = 'k-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
    const fullKrathong = {
      ...newKrathongData,
      id,
      timestamp: Date.now(),
      likes: 0,
      blessings: 0,
      x: 0.12, // Starting near pier
      y: 0.72 + (Math.random() * 0.1 - 0.05),
      speed: 0.00035 + Math.random() * 0.00015,
      scale: 1.15
    };

    // 1. Broadcast to all connected devices in real time via WebSocket
    presenceService.broadcastKrathong(fullKrathong);

    // 2. Save to global cloud storage (async)
    saveCloudKrathong(fullKrathong);

    // 3. Optional Firebase sync
    if (isLiveFirebase && isFirebaseActive()) {
      try {
        const firebaseKey = await pushKrathongToFirebase(fullKrathong);
        if (firebaseKey) {
          fullKrathong.id = firebaseKey;
        }
      } catch (err) {
        console.warn('Firebase push error:', err);
      }
    }

    // 4. Save to local storage cache
    try {
      const currentLocals = getStoredLocalKrathongs();
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([fullKrathong, ...currentLocals].slice(0, 50)));
    } catch (err) {
      console.warn('Local storage write notice:', err);
    }

    setKrathongs((prev) => [fullKrathong, ...prev]);
    return fullKrathong;
  };

  // React to Krathong (Like or Blessing)
  const reactToKrathong = async (id, reactionType) => {
    // 1. Optimistic UI update
    setKrathongs((prev) =>
      prev.map((k) => {
        if (k.id === id) {
          return {
            ...k,
            likes: reactionType === 'like' ? (k.likes || 0) + 1 : k.likes,
            blessings: reactionType === 'blessing' ? (k.blessings || 0) + 1 : k.blessings
          };
        }
        return k;
      })
    );

    // 2. Broadcast reaction to all connected devices in real time
    presenceService.broadcastReaction(id, reactionType);

    // 3. Save reaction to cloud storage
    reactCloudKrathong(id, reactionType);

    // 4. Optional Firebase sync
    if (isLiveFirebase && isFirebaseActive()) {
      try {
        await reactToFirebaseKrathong(id, reactionType);
      } catch (err) {
        console.warn('Reaction sync error:', err);
      }
    }
  };

  // Clear all krathongs from river
  const clearAllKrathongs = () => {
    // Broadcast clear event to all clients
    presenceService.broadcastClearKrathongs();

    // Clear cloud storage
    clearCloudKrathongs();

    // Clear local storage
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      localStorage.removeItem('loy_krathong_local_list');
    } catch (e) {}

    setKrathongs([]);
  };

  return {
    krathongs,
    setKrathongs,
    addKrathong,
    reactToKrathong,
    clearAllKrathongs,
    isLiveFirebase,
    setIsLiveFirebase
  };
}

import { useState, useEffect } from 'react';
import { SAMPLE_KRATHONGS } from '../data/sampleKrathongs';
import { 
  initFirebase, 
  isFirebaseActive, 
  pushKrathongToFirebase, 
  subscribeToFirebaseKrathongs, 
  reactToFirebaseKrathong,
  getStoredFirebaseConfig
} from './firebase';

const LOCAL_STORAGE_KEY = 'loy_krathong_river_v1';

// Clear any previous test session data automatically
try {
  localStorage.removeItem('loy_krathong_local_list');
} catch (e) {}

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

  // Initialize and check Firebase connection
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
              // Add new krathong floating in from pier
              return [
                ...prev,
                {
                  ...newK,
                  x: newK.x !== undefined ? newK.x : 0.05 + Math.random() * 0.1,
                  y: newK.y !== undefined ? newK.y : 0.55 + Math.random() * 0.3,
                  speed: 0.0003 + Math.random() * 0.0002,
                  scale: 0.9 + Math.random() * 0.25
                }
              ];
            });
          },
          (allVal) => {
            // Update likes/blessings
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

    if (isLiveFirebase && isFirebaseActive()) {
      try {
        const firebaseKey = await pushKrathongToFirebase(fullKrathong);
        if (firebaseKey) {
          fullKrathong.id = firebaseKey;
        }
      } catch (err) {
        console.warn('Fallback to local storage:', err);
      }
    }

    // Save to local storage cache safely
    try {
      const currentLocals = getStoredLocalKrathongs();
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([fullKrathong, ...currentLocals].slice(0, 30)));
    } catch (err) {
      console.warn('Local storage write skipped or full:', err);
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

    // 2. Sync to Firebase if active
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

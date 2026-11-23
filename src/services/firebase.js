import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getDatabase, 
  ref, 
  push, 
  onChildAdded, 
  onValue, 
  update, 
  increment,
  query,
  limitToLast
} from 'firebase/database';

let db = null;
let app = null;

const STORAGE_KEY = 'loy_krathong_firebase_cfg';

export const getStoredFirebaseConfig = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse Firebase config from localStorage:', e);
  }
  return null;
};

export const saveFirebaseConfig = (config) => {
  try {
    if (!config) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    }
  } catch (e) {
    console.error('Failed to save Firebase config:', e);
  }
};

export const initFirebase = (customConfig = null) => {
  const config = customConfig || getStoredFirebaseConfig();
  if (!config || !config.apiKey || !config.databaseURL) {
    db = null;
    return false;
  }

  try {
    app = getApps().length === 0 ? initializeApp(config) : getApp();
    db = getDatabase(app);
    return true;
  } catch (err) {
    console.error('Firebase init error:', err);
    db = null;
    return false;
  }
};

export const isFirebaseActive = () => {
  return db !== null;
};

// Push a new Krathong
export const pushKrathongToFirebase = async (krathongData) => {
  if (!db) return null;
  const krathongRef = ref(db, 'krathongs');
  const newRef = await push(krathongRef, {
    ...krathongData,
    timestamp: Date.now(),
    likes: 0,
    blessings: 0
  });
  return newRef.key;
};

// Listen for new Krathongs in real-time
export const subscribeToFirebaseKrathongs = (onAdd, onUpdate) => {
  if (!db) return () => {};
  const krathongRef = query(ref(db, 'krathongs'), limitToLast(50));

  const unsubscribeAdd = onChildAdded(krathongRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      onAdd({ id: snapshot.key, ...data });
    }
  });

  const unsubscribeUpdate = onValue(krathongRef, (snapshot) => {
    const val = snapshot.val();
    if (val && onUpdate) {
      onUpdate(val);
    }
  });

  return () => {
    try {
      if (typeof unsubscribeAdd === 'function') unsubscribeAdd();
      if (typeof unsubscribeUpdate === 'function') unsubscribeUpdate();
    } catch (e) {
      console.warn('Firebase unsubscribe error:', e);
    }
  };
};

// Send reaction (Heart or Blessing)
export const reactToFirebaseKrathong = async (id, reactionType) => {
  if (!db) return;
  const targetRef = ref(db, `krathongs/${id}`);
  const updatePayload = {};
  if (reactionType === 'like') {
    updatePayload.likes = increment(1);
  } else if (reactionType === 'blessing') {
    updatePayload.blessings = increment(1);
  }
  await update(targetRef, updatePayload);
};

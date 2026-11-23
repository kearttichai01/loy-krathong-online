import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getDatabase, 
  ref, 
  push, 
  set,
  remove,
  onChildAdded, 
  onValue, 
  update, 
  increment,
  onDisconnect,
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

// Real-time Presence in Temple Fair
export const setFirebasePresence = async (user) => {
  if (!db || !user?.id) return;
  try {
    const userRef = ref(db, `presence/${user.id}`);
    await set(userRef, {
      ...user,
      lastSeen: Date.now()
    });
    try {
      await onDisconnect(userRef).remove();
    } catch (e) {}
  } catch (err) {
    console.warn('Firebase presence warning:', err);
  }
};

export const removeFirebasePresence = async (userId) => {
  if (!db || !userId) return;
  try {
    await remove(ref(db, `presence/${userId}`));
  } catch (e) {}
};

export const subscribeToFirebasePresence = (onPresenceChange) => {
  if (!db) return () => {};
  const presenceRef = ref(db, 'presence');
  const unsubscribe = onValue(presenceRef, (snapshot) => {
    const val = snapshot.val() || {};
    const list = Object.values(val);
    onPresenceChange(list);
  });
  return () => {
    try {
      if (typeof unsubscribe === 'function') unsubscribe();
    } catch (e) {}
  };
};

// Real-time Invitations
export const sendFirebaseInvite = async (invite) => {
  if (!db || !invite?.toUserId) return;
  try {
    const inviteRef = ref(db, `invites/${invite.toUserId}/${invite.id}`);
    await set(inviteRef, invite);
  } catch (e) {}
};

export const updateFirebaseInviteStatus = async (toUserId, inviteId, status) => {
  if (!db || !toUserId || !inviteId) return;
  try {
    const inviteRef = ref(db, `invites/${toUserId}/${inviteId}`);
    await update(inviteRef, { status, respondedAt: Date.now() });
  } catch (e) {}
};

export const subscribeToFirebaseInvites = (myUserId, onInvite, onResponse) => {
  if (!db || !myUserId) return () => {};
  const invitesRef = ref(db, `invites/${myUserId}`);
  const unsubscribe = onValue(invitesRef, (snapshot) => {
    const val = snapshot.val();
    if (!val) return;
    Object.entries(val).forEach(([inviteId, data]) => {
      if (data.status === 'pending' && onInvite) {
        onInvite(data);
      } else if ((data.status === 'accepted' || data.status === 'rejected') && onResponse) {
        onResponse(data);
      }
    });
  });
  return () => {
    try {
      if (typeof unsubscribe === 'function') unsubscribe();
    } catch (e) {}
  };
};

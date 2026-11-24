// Global Cloud Sync for Krathongs (No API Key Required)
const CLOUD_MASTER_URL = 'https://api.restful-api.dev/objects/ff808181a09d98f701a20e1259123793';
const LOCAL_STORAGE_KEY = 'loy_krathong_river_v1';

export const fetchCloudKrathongs = async () => {
  try {
    const res = await fetch(CLOUD_MASTER_URL, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      const json = await res.json();
      const list = json?.data?.krathongs || [];
      if (Array.isArray(list)) {
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list.slice(0, 50)));
        } catch (e) {}
        return list;
      }
    }
  } catch (err) {
    console.warn('Cloud krathongs fetch error (using local cache):', err);
  }

  // Fallback to local storage cache
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [];
};

export const saveCloudKrathong = async (newKrathong) => {
  try {
    // 1. Fetch current list
    const currentList = await fetchCloudKrathongs();
    const updatedList = [
      newKrathong,
      ...currentList.filter((k) => k.id !== newKrathong.id)
    ].slice(0, 50);

    // 2. Save back to cloud
    await fetch(CLOUD_MASTER_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'loy-krathong-river-master',
        data: { krathongs: updatedList }
      })
    });
    return true;
  } catch (err) {
    console.warn('Cloud krathong save error:', err);
    return false;
  }
};

export const reactCloudKrathong = async (krathongId, reactionType) => {
  try {
    const currentList = await fetchCloudKrathongs();
    const updatedList = currentList.map((k) => {
      if (k.id === krathongId) {
        return {
          ...k,
          likes: reactionType === 'like' ? (k.likes || 0) + 1 : (k.likes || 0),
          blessings: reactionType === 'blessing' ? (k.blessings || 0) + 1 : (k.blessings || 0)
        };
      }
      return k;
    });

    await fetch(CLOUD_MASTER_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'loy-krathong-river-master',
        data: { krathongs: updatedList }
      })
    });
  } catch (err) {
    console.warn('Cloud krathong react error:', err);
  }
};

export const clearCloudKrathongs = async () => {
  try {
    await fetch(CLOUD_MASTER_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'loy-krathong-river-master',
        data: { krathongs: [] }
      })
    });
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (e) {}
    return true;
  } catch (err) {
    console.warn('Cloud krathongs clear error:', err);
    return false;
  }
};

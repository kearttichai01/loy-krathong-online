// Real-Time Cross-Tab & Cross-Device Presence and Invitation Service
import { 
  isFirebaseActive, 
  setFirebasePresence, 
  removeFirebasePresence, 
  subscribeToFirebasePresence,
  sendFirebaseInvite,
  updateFirebaseInviteStatus,
  subscribeToFirebaseInvites
} from './firebase';

class PresenceAndInviteService {
  constructor() {
    this.myProfile = null;
    this.peers = new Map();
    this.pulseTimer = null;
    this.cleanupTimer = null;
    this.channel = null;
    this.firebaseUnsubPresence = null;
    this.firebaseUnsubInvites = null;
    
    // Callbacks
    this.onVisitorsChange = null;
    this.onIncomingInvite = null;
    this.onInviteResponse = null;

    this.initChannel();
  }

  initChannel() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel('loy_krathong_network');
        this.channel.onmessage = (event) => this.handleMessage(event.data);
      } catch (e) {
        console.warn('BroadcastChannel error:', e);
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === 'loy_krathong_network_msg' && e.newValue) {
          try {
            const data = JSON.parse(e.newValue);
            this.handleMessage(data);
          } catch (err) {}
        }
      });

      window.addEventListener('beforeunload', () => {
        this.leave();
      });
    }
  }

  broadcast(message) {
    // 1. BroadcastChannel
    if (this.channel) {
      try {
        this.channel.postMessage(message);
      } catch (e) {}
    }

    // 2. Storage event fallback
    try {
      localStorage.setItem('loy_krathong_network_msg', JSON.stringify({
        ...message,
        _time: Date.now() + Math.random()
      }));
    } catch (e) {}
  }

  start(myProfile, callbacks = {}) {
    if (!myProfile) return;
    this.myProfile = myProfile;
    this.onVisitorsChange = callbacks.onVisitorsChange || null;
    this.onIncomingInvite = callbacks.onIncomingInvite || null;
    this.onInviteResponse = callbacks.onInviteResponse || null;

    this.stop(); // Clear previous intervals if any

    // Pulse presence immediately
    this.pulse();

    // Pulse heartbeat every 2.5 seconds
    this.pulseTimer = setInterval(() => {
      this.pulse();
    }, 2500);

    // Prune stale peers every 3 seconds
    this.cleanupTimer = setInterval(() => {
      this.cleanupPeers();
    }, 3000);

    // Sync with Firebase if active
    if (isFirebaseActive()) {
      setFirebasePresence(this.myProfile);
      
      this.firebaseUnsubPresence = subscribeToFirebasePresence((onlineList) => {
        let changed = false;
        onlineList.forEach((u) => {
          if (u && u.id && u.id !== this.myProfile?.id) {
            this.peers.set(u.id, {
              ...u,
              lastSeen: u.lastSeen || Date.now()
            });
            changed = true;
          }
        });
        if (changed) this.emitVisitors();
      });

      this.firebaseUnsubInvites = subscribeToFirebaseInvites(
        this.myProfile.id,
        (invite) => {
          if (this.onIncomingInvite) this.onIncomingInvite(invite);
        },
        (resp) => {
          if (this.onInviteResponse) this.onInviteResponse(resp);
        }
      );
    }
  }

  pulse() {
    if (!this.myProfile) return;
    this.broadcast({
      type: 'PRESENCE_PULSE',
      user: this.myProfile,
      timestamp: Date.now()
    });

    if (isFirebaseActive()) {
      setFirebasePresence(this.myProfile);
    }
  }

  cleanupPeers() {
    const now = Date.now();
    let changed = false;
    for (const [id, peer] of this.peers.entries()) {
      // If no pulse received for > 7 seconds, remove peer
      if (now - peer.lastSeen > 7000) {
        this.peers.delete(id);
        changed = true;
      }
    }
    if (changed) {
      this.emitVisitors();
    }
  }

  emitVisitors() {
    if (!this.onVisitorsChange) return;
    const list = Array.from(this.peers.values()).filter(
      (u) => u.id !== this.myProfile?.id
    );
    this.onVisitorsChange(list);
  }

  leave() {
    if (!this.myProfile) return;
    this.broadcast({
      type: 'PRESENCE_LEAVE',
      userId: this.myProfile.id
    });
    if (isFirebaseActive()) {
      removeFirebasePresence(this.myProfile.id);
    }
  }

  stop() {
    if (this.pulseTimer) {
      clearInterval(this.pulseTimer);
      this.pulseTimer = null;
    }
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    if (this.firebaseUnsubPresence) {
      this.firebaseUnsubPresence();
      this.firebaseUnsubPresence = null;
    }
    if (this.firebaseUnsubInvites) {
      this.firebaseUnsubInvites();
      this.firebaseUnsubInvites = null;
    }
  }

  handleMessage(msg) {
    if (!msg || !msg.type) return;

    switch (msg.type) {
      case 'PRESENCE_PULSE': {
        const u = msg.user;
        if (!u || !u.id || (this.myProfile && u.id === this.myProfile.id)) return;
        const isNew = !this.peers.has(u.id);
        this.peers.set(u.id, {
          ...u,
          lastSeen: Date.now()
        });
        if (isNew) {
          // Immediately answer with our pulse so both tabs know each other at once
          this.pulse();
        }
        this.emitVisitors();
        break;
      }

      case 'PRESENCE_LEAVE': {
        if (msg.userId && this.peers.has(msg.userId)) {
          this.peers.delete(msg.userId);
          this.emitVisitors();
        }
        break;
      }

      case 'INVITE_SEND': {
        const invite = msg.invite;
        if (this.myProfile && invite && invite.toUserId === this.myProfile.id) {
          if (this.onIncomingInvite) {
            this.onIncomingInvite(invite);
          }
        }
        break;
      }

      case 'INVITE_RESPONSE': {
        const { inviteId, toUserId, status, fromUser } = msg;
        if (this.myProfile && toUserId === this.myProfile.id) {
          if (this.onInviteResponse) {
            this.onInviteResponse({ inviteId, status, fromUser });
          }
        }
        break;
      }

      case 'INVITE_CANCEL': {
        const { inviteId, toUserId } = msg;
        if (this.myProfile && toUserId === this.myProfile.id) {
          if (this.onInviteResponse) {
            this.onInviteResponse({ inviteId, status: 'cancelled' });
          }
        }
        break;
      }

      default:
        break;
    }
  }

  // --- ACTIONS ---

  sendInvite(targetUser) {
    if (!this.myProfile || !targetUser) return null;
    const inviteId = 'inv_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const invite = {
      id: inviteId,
      from: this.myProfile,
      toUserId: targetUser.id,
      partner: targetUser,
      status: 'pending',
      timestamp: Date.now()
    };

    this.broadcast({
      type: 'INVITE_SEND',
      invite
    });

    if (isFirebaseActive()) {
      sendFirebaseInvite(invite);
    }

    return invite;
  }

  respondInvite(invite, status) {
    if (!this.myProfile || !invite) return;
    this.broadcast({
      type: 'INVITE_RESPONSE',
      inviteId: invite.id,
      toUserId: invite.from.id,
      fromUser: this.myProfile,
      status
    });

    if (isFirebaseActive()) {
      updateFirebaseInviteStatus(invite.toUserId, invite.id, status);
    }
  }

  cancelInvite(inviteId, targetUserId) {
    this.broadcast({
      type: 'INVITE_CANCEL',
      inviteId,
      toUserId: targetUserId
    });
  }
}

export const presenceService = new PresenceAndInviteService();

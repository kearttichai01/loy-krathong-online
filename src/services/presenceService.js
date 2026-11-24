// Global Real-Time Presence, Krathongs Broadcast & Couple Invitations
// Powered by Secure WebSocket MQTT + BroadcastChannel (Zero Config Required)
import mqtt from 'mqtt';
import { 
  isFirebaseActive, 
  setFirebasePresence, 
  removeFirebasePresence, 
  subscribeToFirebasePresence,
  sendFirebaseInvite,
  updateFirebaseInviteStatus,
  subscribeToFirebaseInvites
} from './firebase';

const MQTT_BROKER_PRIMARY = 'wss://broker.emqx.io:8084/mqtt';
const MQTT_BROKER_BACKUP = 'wss://broker.hivemq.com:8884/mqtt';
const TOPIC_PREFIX = 'loy-krathong-2026';

class PresenceAndInviteService {
  constructor() {
    this.myProfile = null;
    this.peers = new Map();
    this.pulseTimer = null;
    this.cleanupTimer = null;
    this.channel = null;
    this.mqttClient = null;
    this.isMqttConnected = false;

    // Callbacks
    this.onVisitorsChange = null;
    this.onIncomingInvite = null;
    this.onInviteResponse = null;
    this.onLiveKrathong = null;
    this.onLiveReaction = null;
    this.onLiveClearKrathongs = null;

    this.initLocalChannel();
    this.initMqtt();
  }

  // 1. Cross-Tab Same-Browser Channel (Zero latency fallback)
  initLocalChannel() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel('loy_krathong_network');
        this.channel.onmessage = (event) => this.handleLocalMessage(event.data);
      } catch (e) {
        console.warn('BroadcastChannel error:', e);
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === 'loy_krathong_network_msg' && e.newValue) {
          try {
            const data = JSON.parse(e.newValue);
            this.handleLocalMessage(data);
          } catch (err) {}
        }
      });

      window.addEventListener('beforeunload', () => {
        this.leave();
      });
    }
  }

  // 2. Global Internet Real-Time WebSocket MQTT
  initMqtt() {
    if (typeof window === 'undefined') return;

    const clientId = 'loy_' + Math.random().toString(36).substring(2, 10);
    const connectBroker = (brokerUrl) => {
      try {
        const client = mqtt.connect(brokerUrl, {
          clientId,
          keepalive: 20,
          clean: true,
          reconnectPeriod: 3000,
          connectTimeout: 7000
        });

        client.on('connect', () => {
          this.isMqttConnected = true;
          // Subscribe to all festival topics
          client.subscribe(`${TOPIC_PREFIX}/#`, (err) => {
            if (!err) {
              if (this.myProfile) {
                this.pulse();
              } else {
                this.queryPeers();
              }
            }
          });
        });

        client.on('message', (topic, payload) => {
          try {
            const str = payload.toString();
            const data = JSON.parse(str);
            this.handleMqttMessage(topic, data);
          } catch (e) {}
        });

        client.on('error', (err) => {
          console.warn(`MQTT [${brokerUrl}] notice:`, err?.message || err);
          if (!this.isMqttConnected && brokerUrl === MQTT_BROKER_PRIMARY) {
            try { client.end(true); } catch (e) {}
            this.mqttClient = connectBroker(MQTT_BROKER_BACKUP);
          }
        });

        client.on('close', () => {
          this.isMqttConnected = false;
        });

        return client;
      } catch (err) {
        console.warn('MQTT init notice:', err);
        if (brokerUrl === MQTT_BROKER_PRIMARY) {
          return connectBroker(MQTT_BROKER_BACKUP);
        }
        return null;
      }
    };

    this.mqttClient = connectBroker(MQTT_BROKER_PRIMARY);
  }

  broadcast(message) {
    // 1. BroadcastChannel / Storage (Same device)
    if (this.channel) {
      try {
        this.channel.postMessage(message);
      } catch (e) {}
    }
    try {
      localStorage.setItem('loy_krathong_network_msg', JSON.stringify({
        ...message,
        _time: Date.now() + Math.random()
      }));
    } catch (e) {}

    // 2. Global MQTT Network (Cross-device, worldwide)
    if (this.mqttClient && this.isMqttConnected) {
      try {
        if (message.type === 'PRESENCE_QUERY') {
          this.mqttClient.publish(`${TOPIC_PREFIX}/presence/query`, JSON.stringify(message));
        } else if (message.type === 'PRESENCE_PULSE' && message.user?.id) {
          this.mqttClient.publish(`${TOPIC_PREFIX}/presence/${message.user.id}`, JSON.stringify(message));
        } else if (message.type === 'PRESENCE_LEAVE' && message.userId) {
          this.mqttClient.publish(`${TOPIC_PREFIX}/presence/leave`, JSON.stringify(message));
        } else if (message.type === 'INVITE_SEND' && message.invite?.toUserId) {
          this.mqttClient.publish(`${TOPIC_PREFIX}/invites/${message.invite.toUserId}`, JSON.stringify(message));
        } else if (message.type === 'INVITE_RESPONSE' && message.toUserId) {
          this.mqttClient.publish(`${TOPIC_PREFIX}/invites/${message.toUserId}`, JSON.stringify(message));
        } else if (message.type === 'INVITE_CANCEL' && message.toUserId) {
          this.mqttClient.publish(`${TOPIC_PREFIX}/invites/${message.toUserId}`, JSON.stringify(message));
        } else if (message.type === 'KRATHONG_NEW') {
          this.mqttClient.publish(`${TOPIC_PREFIX}/krathongs/new`, JSON.stringify(message));
        } else if (message.type === 'KRATHONG_REACT') {
          this.mqttClient.publish(`${TOPIC_PREFIX}/krathongs/react`, JSON.stringify(message));
        } else if (message.type === 'KRATHONG_CLEAR') {
          this.mqttClient.publish(`${TOPIC_PREFIX}/krathongs/clear`, JSON.stringify(message));
        }
      } catch (e) {}
    }
  }

  start(myProfile, callbacks = {}) {
    this.myProfile = myProfile || null;
    if (callbacks.onVisitorsChange) this.onVisitorsChange = callbacks.onVisitorsChange;
    if (callbacks.onIncomingInvite) this.onIncomingInvite = callbacks.onIncomingInvite;
    if (callbacks.onInviteResponse) this.onInviteResponse = callbacks.onInviteResponse;
    if (callbacks.onLiveKrathong) this.onLiveKrathong = callbacks.onLiveKrathong;
    if (callbacks.onLiveReaction) this.onLiveReaction = callbacks.onLiveReaction;
    if (callbacks.onLiveClearKrathongs) this.onLiveClearKrathongs = callbacks.onLiveClearKrathongs;

    this.stop();

    // Pulse immediately and set interval if profile exists
    if (this.myProfile) {
      this.pulse();
      this.pulseTimer = setInterval(() => {
        this.pulse();
      }, 2500);
    } else {
      this.queryPeers();
    }

    // Prune stale peers every 3 seconds
    this.cleanupTimer = setInterval(() => {
      this.cleanupPeers();
    }, 3000);

    // Optional Firebase integration
    if (isFirebaseActive() && this.myProfile) {
      setFirebasePresence(this.myProfile);
      subscribeToFirebasePresence((onlineList) => {
        let changed = false;
        onlineList.forEach((u) => {
          if (u && u.id && u.id !== this.myProfile?.id) {
            this.peers.set(u.id, { ...u, lastSeen: u.lastSeen || Date.now() });
            changed = true;
          }
        });
        if (changed) this.emitVisitors();
      });

      subscribeToFirebaseInvites(
        this.myProfile.id,
        (invite) => { if (this.onIncomingInvite) this.onIncomingInvite(invite); },
        (resp) => { if (this.onInviteResponse) this.onInviteResponse(resp); }
      );
    }

    // Emit current peers
    this.emitVisitors();
  }

  queryPeers() {
    this.broadcast({
      type: 'PRESENCE_QUERY',
      timestamp: Date.now()
    });
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
  }

  // Handle Global MQTT Messages
  handleMqttMessage(topic, msg) {
    if (!msg || !msg.type) return;

    // Ignore self-published messages
    if (msg.user && this.myProfile && msg.user.id === this.myProfile.id) return;
    if (msg.fromUser && this.myProfile && msg.fromUser.id === this.myProfile.id) return;
    if (msg.senderId && this.myProfile && msg.senderId === this.myProfile.id) return;

    switch (msg.type) {
      case 'PRESENCE_QUERY': {
        if (this.myProfile) {
          this.pulse();
        }
        break;
      }

      case 'PRESENCE_PULSE': {
        const u = msg.user;
        if (!u || !u.id || (this.myProfile && u.id === this.myProfile.id)) return;
        const isNew = !this.peers.has(u.id);
        this.peers.set(u.id, {
          ...u,
          lastSeen: Date.now()
        });
        if (isNew) {
          // Greet new peer with our presence
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

      case 'KRATHONG_NEW': {
        if (msg.krathong && this.onLiveKrathong) {
          this.onLiveKrathong(msg.krathong);
        }
        break;
      }

      case 'KRATHONG_REACT': {
        if (msg.id && msg.reactionType && this.onLiveReaction) {
          this.onLiveReaction(msg.id, msg.reactionType);
        }
        break;
      }

      case 'KRATHONG_CLEAR': {
        if (this.onLiveClearKrathongs) {
          this.onLiveClearKrathongs();
        }
        break;
      }

      default:
        break;
    }
  }

  // Handle Local Same-Browser Messages
  handleLocalMessage(msg) {
    // Route local messages through the same pipeline
    this.handleMqttMessage('local', msg);
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
      invite,
      senderId: this.myProfile.id
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
      toUserId: targetUserId,
      senderId: this.myProfile?.id
    });
  }

  broadcastKrathong(krathong) {
    this.broadcast({
      type: 'KRATHONG_NEW',
      krathong,
      senderId: this.myProfile?.id
    });
  }

  broadcastReaction(krathongId, reactionType) {
    this.broadcast({
      type: 'KRATHONG_REACT',
      id: krathongId,
      reactionType,
      senderId: this.myProfile?.id
    });
  }

  broadcastClearKrathongs() {
    this.broadcast({
      type: 'KRATHONG_CLEAR',
      senderId: this.myProfile?.id
    });
  }
}

export const presenceService = new PresenceAndInviteService();

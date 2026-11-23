import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import RiverCanvas from './components/RiverCanvas';
import HeaderControls from './components/HeaderControls';
import LaunchWizard from './components/LaunchModal/LaunchWizard';
import KrathongDetailModal from './components/KrathongDetailModal';
import FirebaseConfigModal from './components/FirebaseConfigModal';
import AboutModal from './components/AboutModal';
import ProfileModal from './components/ProfileModal';
import TempleFairView from './components/TempleFairView';
import IncomingInviteModal from './components/IncomingInviteModal';
import { useKrathongStore } from './services/krathongStore';
import { presenceService } from './services/presenceService';
import { INITIAL_ONLINE_VISITORS } from './data/onlineVisitors';

const PROFILE_STORAGE_KEY = 'loy_krathong_my_profile';

export default function App() {
  const {
    krathongs,
    addKrathong,
    reactToKrathong,
    isLiveFirebase,
    setIsLiveFirebase
  } = useKrathongStore();

  // 1. User Profile State (Mandatory First Step)
  const [myProfile, setMyProfile] = useState(() => {
    try {
      const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (!parsed.id) {
          parsed.id = 'u_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
          localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(parsed));
        }
        return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(!myProfile);
  const [currentView, setCurrentView] = useState('temple-fair'); // 'temple-fair' | 'river'

  // Wizard & Interaction States
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardPartner, setWizardPartner] = useState(null);
  const [selectedKrathong, setSelectedKrathong] = useState(null);
  const [isFirebaseConfigOpen, setIsFirebaseConfigOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Online Real Visitors in Temple Fair
  const [onlineVisitors, setOnlineVisitors] = useState(INITIAL_ONLINE_VISITORS);

  // Couple Invitation States (Waiting for acceptance)
  const [incomingInvite, setIncomingInvite] = useState(null);
  const [outgoingInviteStatus, setOutgoingInviteStatus] = useState(null); // { status: 'waiting'|'accepted'|'rejected', partner, inviteId }

  // Sync real-time presence & invitations
  useEffect(() => {
    if (!myProfile) return;

    presenceService.start(myProfile, {
      onVisitorsChange: (list) => {
        setOnlineVisitors(list);
      },
      onIncomingInvite: (invite) => {
        setIncomingInvite(invite);
      },
      onInviteResponse: ({ inviteId, status, fromUser }) => {
        if (status === 'accepted') {
          setOutgoingInviteStatus({
            status: 'accepted',
            partner: fromUser,
            inviteId
          });
          try {
            confetti({
              particleCount: 65,
              spread: 80,
              origin: { y: 0.6 },
              colors: ['#f43f5e', '#fb7185', '#fda4af', '#facc15', '#fde047']
            });
          } catch (e) {}
          setTimeout(() => {
            setOutgoingInviteStatus(null);
            handleFloatCouple(fromUser);
          }, 1200);
        } else if (status === 'rejected') {
          setOutgoingInviteStatus({
            status: 'rejected',
            partner: fromUser,
            inviteId
          });
        }
      }
    });

    return () => {
      presenceService.stop();
    };
  }, [myProfile]);

  // Handle Saving Profile
  const handleSaveProfile = (profileData) => {
    const dataWithId = {
      ...profileData,
      id: profileData.id || myProfile?.id || 'u_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7)
    };
    setMyProfile(dataWithId);
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(dataWithId));
    setIsProfileModalOpen(false);
    setCurrentView('temple-fair');
  };

  // Trigger Floating Solo
  const handleFloatSolo = () => {
    if (!myProfile) {
      setIsProfileModalOpen(true);
      return;
    }
    setWizardPartner(null);
    setIsWizardOpen(true);
  };

  // Trigger Floating as Couple with a Partner
  const handleFloatCouple = (partner) => {
    if (!myProfile) {
      setIsProfileModalOpen(true);
      return;
    }
    setWizardPartner(partner);
    setIsWizardOpen(true);
  };

  // Couple Invitation Handlers
  const handleSendInvite = (targetUser) => {
    const invite = presenceService.sendInvite(targetUser);
    setOutgoingInviteStatus({
      status: 'waiting',
      partner: targetUser,
      inviteId: invite?.id
    });
  };

  const handleCancelInvite = () => {
    if (outgoingInviteStatus?.inviteId && outgoingInviteStatus?.partner) {
      presenceService.cancelInvite(outgoingInviteStatus.inviteId, outgoingInviteStatus.partner.id);
    }
    setOutgoingInviteStatus(null);
  };

  const handleAcceptIncomingInvite = (invite) => {
    presenceService.respondInvite(invite, 'accepted');
    setIncomingInvite(null);
    handleFloatCouple(invite.from);
  };

  const handleDeclineIncomingInvite = (invite) => {
    presenceService.respondInvite(invite, 'rejected');
    setIncomingInvite(null);
  };

  // Handle Launch Krathong (Add to river & switch to river view)
  const handleLaunchKrathong = async (formData) => {
    const launched = await addKrathong(formData);
    // Switch view to river so user sees their krathong floating
    setCurrentView('river');
    // Automatically select to celebrate
    setTimeout(() => {
      setSelectedKrathong(launched);
    }, 600);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#060913] font-sans">
      {/* Top Navigation Bar */}
      <HeaderControls
        krathongCount={krathongs.length}
        isLiveFirebase={isLiveFirebase}
        onOpenFirebaseConfig={() => setIsFirebaseConfigOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        currentView={currentView}
        onToggleView={() => setCurrentView((prev) => (prev === 'temple-fair' ? 'river' : 'temple-fair'))}
        onEditProfile={() => setIsProfileModalOpen(true)}
        myProfile={myProfile}
      />

      {/* VIEW 1: TEMPLE FAIR PIER (ลานงานวัดริมน้ำ & รอดูคนออนไลน์) */}
      {currentView === 'temple-fair' && myProfile && (
        <TempleFairView
          myProfile={myProfile}
          onlineVisitors={onlineVisitors}
          onFloatSolo={handleFloatSolo}
          onFloatCouple={handleFloatCouple}
          onGoToRiver={() => setCurrentView('river')}
          onEditProfile={() => setIsProfileModalOpen(true)}
          onSendInvite={handleSendInvite}
          onCancelInvite={handleCancelInvite}
          outgoingInviteStatus={outgoingInviteStatus}
          onClearOutgoingInvite={() => setOutgoingInviteStatus(null)}
        />
      )}

      {/* VIEW 2: RIVER SCENE (แม่น้ำคืนวันเพ็ญ & กระทงลอย) */}
      {currentView === 'river' && (
        <RiverCanvas
          krathongs={krathongs}
          onSelectKrathong={(k) => setSelectedKrathong(k)}
          onOpenWizard={() => handleFloatSolo()}
          onGoToFair={() => setCurrentView('temple-fair')}
        />
      )}

      {/* MANDATORY PROFILE CREATION MODAL */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onSave={handleSaveProfile}
        initialData={myProfile}
        canClose={Boolean(myProfile)}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* 2-STEP KRATHONG LAUNCH WIZARD (Solo or Couple) */}
      <LaunchWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onLaunch={handleLaunchKrathong}
        myProfile={myProfile}
        partner={wizardPartner}
      />

      {/* INCOMING COUPLE INVITATION MODAL (รออีกฝ่ายกดยอมรับ) */}
      <IncomingInviteModal
        invite={incomingInvite}
        myProfile={myProfile}
        onAccept={handleAcceptIncomingInvite}
        onDecline={handleDeclineIncomingInvite}
      />

      {/* KRATHONG DETAIL VIEW (Reading Wishes & Reactions) */}
      <KrathongDetailModal
        krathong={selectedKrathong}
        onClose={() => setSelectedKrathong(null)}
        onReact={reactToKrathong}
      />

      {/* FIREBASE CONFIG MODAL */}
      <FirebaseConfigModal
        isOpen={isFirebaseConfigOpen}
        onClose={() => setIsFirebaseConfigOpen(false)}
        onConfigSaved={(success) => setIsLiveFirebase(success)}
      />

      {/* ABOUT FESTIVAL MODAL */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </main>
  );
}

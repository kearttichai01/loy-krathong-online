import React, { useState } from 'react';
import RiverCanvas from './components/RiverCanvas';
import HeaderControls from './components/HeaderControls';
import LaunchWizard from './components/LaunchModal/LaunchWizard';
import KrathongDetailModal from './components/KrathongDetailModal';
import FirebaseConfigModal from './components/FirebaseConfigModal';
import AboutModal from './components/AboutModal';
import { useKrathongStore } from './services/krathongStore';

export default function App() {
  const {
    krathongs,
    addKrathong,
    reactToKrathong,
    isLiveFirebase,
    setIsLiveFirebase
  } = useKrathongStore();

  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [selectedKrathong, setSelectedKrathong] = useState(null);
  const [isFirebaseConfigOpen, setIsFirebaseConfigOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Handle Launch Krathong
  const handleLaunchKrathong = async (formData) => {
    const launched = await addKrathong(formData);
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
      />

      {/* Main 2D Canvas River Simulation */}
      <RiverCanvas
        krathongs={krathongs}
        onSelectKrathong={(k) => setSelectedKrathong(k)}
        onOpenWizard={() => setIsWizardOpen(true)}
      />

      {/* 3-Step Launch Wizard Modal */}
      <LaunchWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onLaunch={handleLaunchKrathong}
      />

      {/* Reading other people's Krathong Modal */}
      <KrathongDetailModal
        krathong={selectedKrathong}
        onClose={() => setSelectedKrathong(null)}
        onReact={reactToKrathong}
      />

      {/* Firebase Cloud Config Modal */}
      <FirebaseConfigModal
        isOpen={isFirebaseConfigOpen}
        onClose={() => setIsFirebaseConfigOpen(false)}
        onConfigSaved={(success) => setIsLiveFirebase(success)}
      />

      {/* About Festival Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </main>
  );
}

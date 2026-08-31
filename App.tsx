// App.tsx
import React, { useState } from 'react';
import { Header } from './Header';
import { Navbar, TabType } from './Navbar';
import { HomeScreen } from './HomeScreen';
import { GameTableScreen } from './GameTableScreen';
import { LeaderboardScreen } from './LeaderboardScreen';
import { ProfileScreen } from './ProfileScreen';
import { ShopScreen } from './ShopScreen';
import { AuthAndRoomModals } from './AuthAndRoomModals';
import { useGameStore } from './useGameStore';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Modals state
  const [showTerms, setShowTerms] = useState<boolean>(false);
  const [showAuth, setShowAuth] = useState<boolean>(false);
  const [showCreateRoom, setShowCreateRoom] = useState<boolean>(false);

  const { startNewGame } = useGameStore();

  const handleStartQuickMatch = () => {
    startNewGame();
    setIsPlaying(true);
  };

  const handleLeaveGame = () => {
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-[#0A140F] text-white flex flex-col justify-between font-sans selection:bg-yellow-500 selection:text-black">
      {/* 1. Header (فقط خارج از محیط میز بازی نمایش داده می‌شود) */}
      {!isPlaying && (
        <Header
          onOpenProfile={() => setActiveTab('profile')}
          onOpenSettings={() => setShowAuth(true)}
        />
      )}

      {/* 2. Main Content Area */}
      <main className="flex-1 p-3 md:p-6 overflow-y-auto max-w-4xl mx-auto w-full">
        {isPlaying ? (
          <GameTableScreen onLeave={handleLeaveGame} />
        ) : (
          <>
            {activeTab === 'home' && (
              <HomeScreen
                onStartQuickMatch={handleStartQuickMatch}
                onOpenCreateRoom={() => setShowCreateRoom(true)}
              />
            )}
            {activeTab === 'leaderboard' && <LeaderboardScreen />}
            {activeTab === 'profile' && <ProfileScreen />}
            {activeTab === 'shop' && <ShopScreen />}
            {activeTab === 'more' && (
              <div className="text-center py-12 text-gray-400 space-y-3 dir-rtl">
                <p className="text-sm font-bold">بخش تنظیمات، راهنمای کامل بازی و پشتیبانی آنلاین</p>
                <button
                  onClick={() => setShowTerms(true)}
                  className="bg-gray-800 hover:bg-gray-700 text-yellow-400 text-xs px-4 py-2 rounded-xl border border-gray-700"
                >
                  مشاهده قوانین و مقررات
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* 3. Bottom Navbar (فقط خارج از محیط میز بازی) */}
      {!isPlaying && <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />}

      {/* 4. Modals */}
      <AuthAndRoomModals
        showTerms={showTerms}
        setShowTerms={setShowTerms}
        showAuth={showAuth}
        setShowAuth={setShowAuth}
        showCreateRoom={showCreateRoom}
        setShowCreateRoom={setShowCreateRoom}
      />
    </div>
  );
}

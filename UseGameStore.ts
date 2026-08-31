// useGameStore.ts
import { create } from 'zustand';
import { HokmEngine, CardSuit, Card, GameState } from './HokmEngine';

export interface UserProfile {
  id: string;
  username: string;
  phoneNumber?: string;
  avatar: string;
  level: number;
  xp: number;
  coins: number;
  gems: number;
  isVip: boolean;
  referralCode: string;
  stats: {
    totalGames: number;
    wins: number;
    losses: number;
    kots: number;
  };
}

export interface RoomInfo {
  id: string;
  code: string;
  title: string;
  entryFee: number;
  targetPoints: number;
  playersCount: number;
  isPrivate: boolean;
}

export interface TournamentInfo {
  id: string;
  title: string;
  prizePool: number;
  entryFee: number;
  startTime: string;
  registeredCount: number;
}

interface GameStore {
  // User & Auth State
  user: UserProfile | null;
  isAuthenticated: boolean;
  setUser: (user: UserProfile | null) => void;
  updateCoins: (amount: number) => void;
  updateGems: (amount: number) => void;

  // Active Game State
  engine: HokmEngine | null;
  gameState: GameState;
  myHand: Card[];
  currentTurnIndex: number;
  hokmSuit: CardSuit | null;
  hakemIndex: number;
  currentTrick: { playerId: string; card: Card }[];
  team1Score: number;
  team2Score: number;
  team1Tricks: number;
  team2Tricks: number;

  // Room & Lobby
  availableRooms: RoomInfo[];
  tournaments: TournamentInfo[];
  
  // App Settings
  soundEnabled: boolean;
  musicEnabled: boolean;
  vibrationEnabled: boolean;
  toggleSound: () => void;
  toggleMusic: () => void;
  toggleVibration: () => void;

  // Actions
  initQuickMatch: () => void;
  setHokm: (suit: CardSuit) => void;
  playCard: (cardId: string) => void;
  leaveGame: () => void;
  syncEngineState: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Default Initial User Profile
  user: {
    id: 'usr_1',
    username: 'بازیکن_حرفه_ای',
    phoneNumber: '+989123456789',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
    level: 12,
    xp: 2400,
    coins: 45000,
    gems: 120,
    isVip: true,
    referralCode: 'HOKM-9921',
    stats: {
      totalGames: 150,
      wins: 98,
      losses: 52,
      kots: 14,
    },
  },
  isAuthenticated: true,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  updateCoins: (amount) => set((state) => ({
    user: state.user ? { ...state.user, coins: state.user.coins + amount } : null
  })),
  updateGems: (amount) => set((state) => ({
    user: state.user ? { ...state.user, gems: state.user.gems + amount } : null
  })),

  // Engine States
  engine: null,
  gameState: 'WAITING',
  myHand: [],
  currentTurnIndex: 0,
  hokmSuit: null,
  hakemIndex: 0,
  currentTrick: [],
  team1Score: 0,
  team2Score: 0,
  team1Tricks: 0,
  team2Tricks: 0,

  // Lobby Data
  availableRooms: [
    { id: 'r1', code: '84920', title: 'میز حرفه‌ای‌ها', entryFee: 5000, targetPoints: 7, playersCount: 3, isPrivate: false },
    { id: 'r2', code: '10293', title: 'بازی سریع ساوه', entryFee: 1000, targetPoints: 7, playersCount: 2, isPrivate: false },
    { id: 'r3', code: '55412', title: 'اتاق دوستانه VIP', entryFee: 10000, targetPoints: 11, playersCount: 1, isPrivate: true },
  ],
  tournaments: [
    { id: 't1', title: 'جام طلایی ساوه', prizePool: 500000, entryFee: 10000, startTime: '20:00', registeredCount: 48 },
    { id: 't2', title: 'تورنمنت هفتگی قشم', prizePool: 1000000, entryFee: 25000, startTime: '22:30', registeredCount: 112 },
  ],

  // Settings
  soundEnabled: true,
  musicEnabled: true,
  vibrationEnabled: true,
  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
  toggleMusic: () => set((s) => ({ musicEnabled: !s.musicEnabled })),
  toggleVibration: () => set((s) => ({ vibrationEnabled: !s.vibrationEnabled })),

  // Game Engine Synchronization
  initQuickMatch: () => {
    const currentUser = get().user;
    const dummyPlayers = [
      { id: currentUser?.id || 'usr_1', name: currentUser?.username || 'من', avatar: currentUser?.avatar || '' },
      { id: 'bot_1', name: 'علی (ربات)', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100' },
      { id: 'bot_2', name: 'رضا (یار)', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
      { id: 'bot_3', name: 'سارا (ربات)', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
    ];

    const engine = new HokmEngine(dummyPlayers, 7);
    engine.startMatch();

    set({ engine });
    get().syncEngineState();
  },

  syncEngineState: () => {
    const engine = get().engine;
    const currentUser = get().user;
    if (!engine) return;

    const data = engine.getGameState();
    const myHand = engine.getPlayerHand(currentUser?.id || 'usr_1');

    set({
      gameState: data.state,
      currentTurnIndex: data.currentTurnIndex,
      hokmSuit: data.hokmSuit,
      hakemIndex: data.hakemIndex,
      currentTrick: data.currentTrick,
      team1Tricks: data.team1TricksWon,
      team2Tricks: data.team2TricksWon,
      team1Score: data.team1GamePoints,
      team2Score: data.team2GamePoints,
      myHand,
    });
  },

  setHokm: (suit: CardSuit) => {
    const { engine, user } = get();
    if (!engine || !user) return;
    
    engine.setHokm(suit, user.id);
    get().syncEngineState();
  },

  playCard: (cardId: string) => {
    const { engine, user } = get();
    if (!engine || !user) return;

    try {
      engine.playCard(user.id, cardId);
      get().syncEngineState();
    } catch (err: any) {
      alert(err.message || "حرکت نامعتبر است.");
    }
  },

  leaveGame: () => {
    set({
      engine: null,
      gameState: 'WAITING',
      myHand: [],
      currentTrick: [],
    });
  },
}));

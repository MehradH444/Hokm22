// LeaderboardScreen.tsx
import React, { useState } from 'react';
import { Trophy, Medal, Crown, Flame, ShieldCheck } from 'lucide-react';
import { useGameStore } from './useGameStore';

interface LeaderboardUser {
  rank: number;
  id: string;
  username: string;
  avatar: string;
  wins: number;
  coins: number;
  isVip: boolean;
}

export const LeaderboardScreen: React.FC = () => {
  const [filter, setFilter] = useState<'weekly' | 'allTime'>('weekly');

  const topUsers: LeaderboardUser[] = [
    { rank: 1, id: '1', username: 'امیر_حکم‌باز', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100', wins: 340, coins: 1250000, isVip: true },
    { rank: 2, id: '2', username: 'سارا_تک‌خال', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', wins: 295, coins: 980000, isVip: true },
    { rank: 3, id: '3', username: 'شاه_دل', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100', wins: 260, coins: 750000, isVip: false },
    { rank: 4, id: '4', username: 'حاکم_ساوه', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', wins: 210, coins: 520000, isVip: false },
    { rank: 5, id: '5', username: 'رضا_کُت‌کن', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100', wins: 185, coins: 410000, isVip: true },
  ];

  return (
    <div className="flex flex-col gap-4 max-w-xl mx-auto pb-6 select-none dir-rtl">
      {/* هدر صفحه برترین‌ها */}
      <div className="flex items-center justify-between bg-[#1C2C24] p-4 rounded-2xl border border-yellow-500/30">
        <div className="flex items-center gap-2 text-yellow-400">
          <Trophy className="w-6 h-6 animate-bounce" />
          <h2 className="font-extrabold text-base">جدول برترین‌های حکم</h2>
        </div>
        <div className="flex bg-black/40 p-1 rounded-xl border border-gray-700 text-xs">
          <button
            onClick={() => setFilter('weekly')}
            className={`px-3 py-1 rounded-lg font-bold transition ${
              filter === 'weekly' ? 'bg-yellow-500 text-black' : 'text-gray-400'
            }`}
          >
            هفتگی
          </button>
          <button
            onClick={() => setFilter('allTime')}
            className={`px-3 py-1 rounded-lg font-bold transition ${
              filter === 'allTime' ? 'bg-yellow-500 text-black' : 'text-gray-400'
            }`}
          >
            کل
          </button>
        </div>
      </div>

      {/* ۳ نفر برتر (Top 3 Podium) */}
      <div className="grid grid-cols-3 gap-2 items-end pt-4 pb-2">
        {/* نفر دوم */}
        <div className="flex flex-col items-center bg-[#1C2C24] p-3 rounded-2xl border border-gray-400/30 relative">
          <Medal className="w-6 h-6 text-gray-300 absolute -top-3" />
          <img src={topUsers[1].avatar} className="w-12 h-12 rounded-full border-2 border-gray-300 mt-2 object-cover" alt="Rank 2" />
          <span className="text-xs font-bold text-white mt-1 truncate max-w-[80px]">{topUsers[1].username}</span>
          <span className="text-[10px] text-yellow-400 font-extrabold mt-0.5">{topUsers[1].wins} برد</span>
        </div>

        {/* نفر اول */}
        <div className="flex flex-col items-center bg-[#1C2C24] p-4 rounded-2xl border-2 border-yellow-500 relative -translate-y-2 shadow-xl">
          <Crown className="w-7 h-7 text-yellow-400 absolute -top-4 animate-pulse" />
          <img src={topUsers[0].avatar} className="w-16 h-16 rounded-full border-2 border-yellow-400 mt-1 object-cover" alt="Rank 1" />
          <span className="text-xs font-black text-yellow-400 mt-1 truncate max-w-[90px]">{topUsers[0].username}</span>
          <span className="text-[10px] text-gray-300 font-extrabold mt-0.5">{topUsers[0].wins} برد</span>
        </div>

        {/* نفر سوم */}
        <div className="flex flex-col items-center bg-[#1C2C24] p-3 rounded-2xl border border-amber-700/30 relative">
          <Medal className="w-6 h-6 text-amber-600 absolute -top-3" />
          <img src={topUsers[2].avatar} className="w-12 h-12 rounded-full border-2 border-amber-600 mt-2 object-cover" alt="Rank 3" />
          <span className="text-xs font-bold text-white mt-1 truncate max-w-[80px]">{topUsers[2].username}</span>
          <span className="text-[10px] text-yellow-400 font-extrabold mt-0.5">{topUsers[2].wins} برد</span>
        </div>
      </div>

      {/* لیست بقیه برترین‌ها */}
      <div className="space-y-2">
        {topUsers.slice(3).map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-[#1C2C24] p-3 rounded-xl border border-gray-800 hover:border-yellow-500/30 transition"
          >
            <div className="flex items-center gap-3">
              <span className="font-black text-sm text-gray-400 w-5 text-center">#{item.rank}</span>
              <img src={item.avatar} className="w-9 h-9 rounded-full object-cover border border-gray-700" alt={item.username} />
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white">{item.username}</span>
                {item.isVip && <ShieldCheck className="w-3.5 h-3.5 text-yellow-400" />}
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <span className="text-gray-400 font-medium">{item.wins} برد</span>
              <span className="text-yellow-400 font-extrabold">{item.coins.toLocaleString('fa-IR')} سکه</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

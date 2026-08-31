// ProfileScreen.tsx
import React from 'react';
import { User, Award, Shield, Copy, Share2, CheckCircle2, Zap } from 'lucide-react';
import { useGameStore } from './useGameStore';

export const ProfileScreen: React.FC = () => {
  const { user } = useGameStore();

  if (!user) return null;

  const winRate = user.stats.totalGames > 0 
    ? Math.round((user.stats.wins / user.stats.totalGames) * 100) 
    : 0;

  const copyReferralCode = () => {
    navigator.clipboard.writeText(user.referralCode);
    alert('کد معرف با موفقیت کپی شد.');
  };

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto pb-6 select-none dir-rtl">
      {/* 1. کارت مشخصات اصلی */}
      <div className="bg-[#1C2C24] p-5 rounded-2xl border border-yellow-500/30 flex flex-col items-center text-center relative shadow-xl">
        <div className="relative">
          <img
            src={user.avatar}
            alt={user.username}
            className="w-20 h-20 rounded-full border-2 border-yellow-500 object-cover shadow-md"
          />
          {user.isVip && (
            <span className="absolute -bottom-1 -right-1 bg-yellow-500 text-black font-black text-[10px] px-2 py-0.5 rounded-full border border-black shadow">
              VIP
            </span>
          )}
        </div>

        <h3 className="font-extrabold text-lg text-white mt-3">{user.username}</h3>
        <p className="text-xs text-gray-400 mt-0.5">شماره همراه: {user.phoneNumber || 'مهمان'}</p>

        {/* لول و XP */}
        <div className="w-full bg-black/40 p-3 rounded-xl border border-gray-700/60 mt-4 space-y-1.5">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-gray-300">سطح {user.level}</span>
            <span className="text-yellow-400">{user.xp} / 3000 XP</span>
          </div>
          <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
            <div className="bg-yellow-500 h-full rounded-full" style={{ width: `${(user.xp / 3000) * 100}%` }}></div>
          </div>
        </div>
      </div>

      {/* 2. کارت آمار بازی‌ها */}
      <div className="bg-[#1C2C24] p-4 rounded-2xl border border-yellow-500/30 space-y-3">
        <h4 className="font-bold text-sm text-yellow-400 flex items-center gap-2">
          <Award className="w-4 h-4" />
          آمار و عملکرد
        </h4>

        <div className="grid grid-cols-2 gap-2 text-center text-xs">
          <div className="bg-black/30 p-2.5 rounded-xl border border-gray-800">
            <span className="text-gray-400 block mb-1">کل بازی‌ها</span>
            <span className="font-black text-sm text-white">{user.stats.totalGames}</span>
          </div>
          <div className="bg-black/30 p-2.5 rounded-xl border border-gray-800">
            <span className="text-gray-400 block mb-1">درصد برد</span>
            <span className="font-black text-sm text-green-400">{winRate}%</span>
          </div>
          <div className="bg-black/30 p-2.5 rounded-xl border border-gray-800">
            <span className="text-gray-400 block mb-1">تعداد برد</span>
            <span className="font-black text-sm text-yellow-400">{user.stats.wins}</span>
          </div>
          <div className="bg-black/30 p-2.5 rounded-xl border border-gray-800">
            <span className="text-gray-400 block mb-1">تعداد کُت‌ها</span>
            <span className="font-black text-sm text-cyan-400">{user.stats.kots}</span>
          </div>
        </div>
      </div>

      {/* 3. دعوت از دوستان (کد معرف) */}
      <div className="bg-gradient-to-r from-amber-600/20 to-yellow-600/20 bg-[#1C2C24] p-4 rounded-2xl border border-yellow-500/40 flex justify-between items-center">
        <div>
          <h4 className="font-bold text-xs text-yellow-400">دعوت از دوستان و دریافت ۵,۰۰۰ سکه</h4>
          <span className="text-[11px] text-gray-300 mt-1 block">کد اختصاصی شما: {user.referralCode}</span>
        </div>
        <button
          onClick={copyReferralCode}
          className="bg-yellow-500 hover:bg-yellow-400 text-black p-2.5 rounded-xl transition"
        >
          <Copy className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

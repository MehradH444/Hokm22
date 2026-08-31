// Header.tsx
import React from 'react';
import { Coins, Gem, Bell, Settings, UserCheck } from 'lucide-react';
import { useGameStore } from './useGameStore';

interface HeaderProps {
  onOpenSettings?: () => void;
  onOpenProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings, onOpenProfile }) => {
  const { user } = useGameStore();

  if (!user) return null;

  return (
    <header className="flex items-center justify-between px-4 py-2.5 bg-[#0F2018] border-b border-yellow-600/30 select-none dir-rtl">
      {/* سمت راست: آواتار و مشخصات کاربر */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={onOpenProfile}>
        <div className="relative">
          <img
            src={user.avatar}
            alt={user.username}
            className="w-10 h-10 rounded-full border-2 border-yellow-500 object-cover shadow-md"
          />
          {user.isVip && (
            <span className="absolute -bottom-1 -right-1 bg-yellow-500 text-black font-black text-[9px] px-1 rounded-full border border-black shadow">
              VIP
            </span>
          )}
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm text-yellow-400 truncate max-w-[110px]">
              {user.username}
            </span>
            {user.isVip && <UserCheck className="w-3.5 h-3.5 text-yellow-400" />}
          </div>
          <span className="text-[11px] text-gray-400 font-medium">سطح {user.level}</span>
        </div>
      </div>

      {/* سمت چپ: منابع (سکه/الماس) و اعلان‌ها */}
      <div className="flex items-center gap-2.5">
        {/* نشانگر سکه */}
        <div className="flex items-center bg-black/50 px-2.5 py-1 rounded-full border border-yellow-500/30 shadow-inner">
          <Coins className="w-4 h-4 text-yellow-400 ml-1.5 animate-pulse" />
          <span className="text-xs font-extrabold text-yellow-400 dir-ltr">
            {user.coins.toLocaleString('fa-IR')}
          </span>
          <button className="mr-1.5 text-yellow-500 font-bold text-sm leading-none hover:scale-125 transition-transform">
            +
          </button>
        </div>

        {/* نشانگر الماس */}
        <div className="flex items-center bg-black/50 px-2.5 py-1 rounded-full border border-cyan-500/30 shadow-inner">
          <Gem className="w-4 h-4 text-cyan-400 ml-1.5" />
          <span className="text-xs font-extrabold text-cyan-400 dir-ltr">
            {user.gems.toLocaleString('fa-IR')}
          </span>
          <button className="mr-1.5 text-cyan-400 font-bold text-sm leading-none hover:scale-125 transition-transform">
            +
          </button>
        </div>

        {/* دکمه تنظیمات */}
        <button
          onClick={onOpenSettings}
          className="p-1.5 text-gray-300 hover:text-white bg-black/30 rounded-full border border-gray-700/50 hover:bg-black/60 transition"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

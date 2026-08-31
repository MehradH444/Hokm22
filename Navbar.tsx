// Navbar.tsx
import React from 'react';
import { Home, Trophy, User, ShoppingBag, MoreHorizontal } from 'lucide-react';

export type TabType = 'home' | 'leaderboard' | 'profile' | 'shop' | 'more';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'خانه', icon: <Home className="w-5 h-5" /> },
    { id: 'leaderboard', label: 'برترین‌ها', icon: <Trophy className="w-5 h-5" /> },
    { id: 'profile', label: 'پروفایل', icon: <User className="w-5 h-5" /> },
    { id: 'shop', label: 'فروشگاه', icon: <ShoppingBag className="w-5 h-5" /> },
    { id: 'more', label: 'بیشتر', icon: <MoreHorizontal className="w-5 h-5" /> },
  ];

  return (
    <nav className="flex justify-around items-center bg-[#0F2018] border-t border-yellow-600/30 py-2 select-none dir-rtl">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center transition-all duration-200 ${
              isActive ? 'text-yellow-400 scale-105 font-bold' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <div className={`p-1 rounded-xl ${isActive ? 'bg-yellow-500/10' : ''}`}>
              {item.icon}
            </div>
            <span className="text-[11px] mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

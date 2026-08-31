// HomeScreen.tsx
import React from 'react';
import { Play, Users, Award, Lock, Plus, Swords, Sparkles, Volume2 } from 'lucide-react';
import { useGameStore, RoomInfo, TournamentInfo } from './useGameStore';

interface HomeScreenProps {
  onStartQuickMatch: () => void;
  onOpenCreateRoom: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartQuickMatch,
  onOpenCreateRoom,
}) => {
  const { availableRooms, tournaments, user } = useGameStore();

  return (
    <div className="flex flex-col gap-5 max-w-2xl mx-auto pb-6 select-none dir-rtl">
      {/* 1. ویژه / بنر تورنمنت اصلی */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 p-5 shadow-2xl border border-yellow-400/40">
        <div className="absolute -left-10 -bottom-10 opacity-20 pointer-events-none">
          <Award className="w-48 h-48 text-black" />
        </div>
        <div className="relative z-10 flex justify-between items-center">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-black animate-spin" />
              <span className="text-xs font-black bg-black text-yellow-400 px-2 py-0.5 rounded-full">
                تورنمنت ویژه هفته
              </span>
            </div>
            <h2 className="text-xl font-black text-black">جام بزرگ طلایی ساوه</h2>
            <p className="text-xs text-black/90 font-bold">
              جایزه: ۵۰۰,۰۰۰ سکه + نشان ویژه VIP
            </p>
          </div>
          <button className="bg-black hover:bg-gray-900 text-yellow-400 font-extrabold px-5 py-2.5 rounded-xl text-sm shadow-lg active:scale-95 transition-all border border-yellow-400/30">
            ثبت‌نام
          </button>
        </div>
      </div>

      {/* 2. حالت‌های اصلی بازی (Quick Match / Private / Tournament) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* بازی سریع */}
        <div
          onClick={onStartQuickMatch}
          className="group relative bg-[#1C2C24] hover:bg-[#23382e] border border-yellow-500/30 hover:border-yellow-400 p-4 rounded-2xl cursor-pointer transition-all duration-200 flex flex-col items-center justify-center text-center shadow-lg"
        >
          <div className="p-3 rounded-2xl bg-yellow-500/10 text-yellow-400 mb-2 group-hover:scale-110 transition-transform">
            <Play className="w-8 h-8 fill-yellow-400" />
          </div>
          <h3 className="font-extrabold text-base text-white">بازی سریع</h3>
          <span className="text-[11px] text-gray-400 mt-1">ورودی: ۱,۰۰۰ سکه</span>
        </div>

        {/* ساخت / ورود به اتاق اختصاصی */}
        <div
          onClick={onOpenCreateRoom}
          className="group relative bg-[#1C2C24] hover:bg-[#23382e] border border-cyan-500/30 hover:border-cyan-400 p-4 rounded-2xl cursor-pointer transition-all duration-200 flex flex-col items-center justify-center text-center shadow-lg"
        >
          <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 mb-2 group-hover:scale-110 transition-transform">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-base text-white">اتاق اختصاصی</h3>
          <span className="text-[11px] text-gray-400 mt-1">بازی با دوستان</span>
        </div>

        {/* تورنمنت‌ها */}
        <div className="group relative bg-[#1C2C24] hover:bg-[#23382e] border border-purple-500/30 hover:border-purple-400 p-4 rounded-2xl cursor-pointer transition-all duration-200 flex flex-col items-center justify-center text-center shadow-lg">
          <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 mb-2 group-hover:scale-110 transition-transform">
            <Swords className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-base text-white">تورنمنت‌ها</h3>
          <span className="text-[11px] text-gray-400 mt-1">رقابت‌های تک‌حذفی</span>
        </div>
      </div>

      {/* 3. لیست اتاق‌های عمومی فعال */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-sm font-bold text-yellow-400 flex items-center gap-2">
            <Users className="w-4 h-4" />
            اتاق‌های در انتظار بازیکن
          </h3>
          <button
            onClick={onOpenCreateRoom}
            className="text-xs text-yellow-500 hover:underline flex items-center gap-1 font-bold"
          >
            <Plus className="w-3.5 h-3.5" />
            ایجاد اتاق جدید
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {availableRooms.map((room: RoomInfo) => (
            <div
              key={room.id}
              className="flex items-center justify-between bg-[#1C2C24] p-3.5 rounded-xl border border-gray-800 hover:border-yellow-500/40 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-black/40 flex items-center justify-center border border-gray-700">
                  {room.isPrivate ? (
                    <Lock className="w-5 h-5 text-red-400" />
                  ) : (
                    <Users className="w-5 h-5 text-yellow-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-white">{room.title}</h4>
                    <span className="text-[10px] bg-black/50 text-gray-400 px-1.5 py-0.5 rounded border border-gray-700">
                      کد: {room.code}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                    <span>ورودی: {room.entryFee.toLocaleString('fa-IR')} سکه</span>
                    <span>•</span>
                    <span>هدف: {room.targetPoints} دست</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-yellow-400 font-bold bg-yellow-500/10 px-2 py-1 rounded-lg">
                  {room.playersCount}/۴ نفر
                </span>
                <button
                  onClick={onStartQuickMatch}
                  className="bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold text-xs px-3.5 py-2 rounded-lg transition"
                >
                  ورود
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

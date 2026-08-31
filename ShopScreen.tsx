// ShopScreen.tsx
import React from 'react';
import { Coins, Gem, Crown, Check, Zap } from 'lucide-react';
import { useGameStore } from './useGameStore';

export const ShopScreen: React.FC = () => {
  const { user, setUser } = useGameStore();

  const coinPackages = [
    { id: 'c1', title: 'بسته برنجی', coins: 10000, price: '۲۰,۰۰۰ تومان', icon: '🪙' },
    { id: 'c2', title: 'بسته نقره‌ای', coins: 50000, price: '۸۰,۰۰۰ تومان', popular: true, icon: '💰' },
    { id: 'c3', title: 'بسته طلایی', coins: 200000, price: '۲۵۰,۰۰۰ تومان', icon: '🏆' },
  ];

  const vipPackage = {
    title: 'اشتراک ویژه VIP (۳۰ روزه)',
    price: '۱۵۰,۰۰۰ تومان',
    features: [
      'تخفیف ۵۰ درصدی ورودی تمامی اتاق‌ها',
      'نشان طلایی VIP در پروفایل و میز بازی',
      'دسترسی به ایموجی‌ها و عبارات اختصاصی',
      'دریافت روزانه ۵,۰۰۰ سکه رایگان',
    ],
  };

  const handleBuyCoins = (amount: number) => {
    if (!user) return;
    setUser({ ...user, coins: user.coins + amount });
    alert(`${amount.toLocaleString('fa-IR')} سکه به حساب شما اضافه شد.`);
  };

  return (
    <div className="flex flex-col gap-5 max-w-xl mx-auto pb-6 select-none dir-rtl">
      {/* 1. کارت بنر ویژه VIP */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 p-5 rounded-2xl border border-yellow-400/50 shadow-2xl">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2 text-black">
            <Crown className="w-6 h-6 fill-black" />
            <h3 className="font-black text-lg">{vipPackage.title}</h3>
          </div>
          <span className="bg-black text-yellow-400 text-xs font-black px-2.5 py-1 rounded-full">
            {vipPackage.price}
          </span>
        </div>

        <ul className="space-y-1.5 mb-4 text-xs font-bold text-black/90">
          {vipPackage.features.map((feat, idx) => (
            <li key={idx} className="flex items-center gap-1.5">
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{feat}</span>
            </li>
          ))}
        </ul>

        <button className="w-full bg-black hover:bg-gray-900 text-yellow-400 font-extrabold py-2.5 rounded-xl text-xs shadow-lg transition">
          فعالسازی اشتراک VIP
        </button>
      </div>

      {/* 2. بسته‌های سکه */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-yellow-400 flex items-center gap-2">
          <Coins className="w-4 h-4" />
          خرید سکه
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {coinPackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`bg-[#1C2C24] p-4 rounded-2xl border flex flex-col items-center text-center relative shadow-lg ${
                pkg.popular ? 'border-yellow-400' : 'border-gray-800'
              }`}
            >
              {pkg.popular && (
                <span className="absolute -top-2.5 bg-yellow-500 text-black text-[9px] font-black px-2 py-0.5 rounded-full">
                  محبوب‌ترین
                </span>
              )}
              <span className="text-3xl mb-2">{pkg.icon}</span>
              <h4 className="font-bold text-xs text-white">{pkg.title}</h4>
              <span className="text-sm font-black text-yellow-400 my-1">
                {pkg.coins.toLocaleString('fa-IR')} سکه
              </span>
              <button
                onClick={() => handleBuyCoins(pkg.coins)}
                className="w-full bg-yellow-500/20 hover:bg-yellow-500 text-yellow-400 hover:text-black font-extrabold text-xs py-2 rounded-xl border border-yellow-500/40 mt-2 transition"
              >
                {pkg.price}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

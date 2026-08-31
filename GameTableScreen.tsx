// GameTableScreen.tsx
import React, { useState } from 'react';
import { ArrowLeft, MessageSquare, Volume2, Shield, Sparkles, RefreshCw } from 'lucide-react';
import { useGameStore } from './useGameStore';
import { CardSuit, Card } from './HokmEngine';

interface GameTableScreenProps {
  onLeave: () => void;
}

export const GameTableScreen: React.FC<GameTableScreenProps> = ({ onLeave }) => {
  const {
    myHand,
    gameState,
    currentTurnIndex,
    hokmSuit,
    hakemIndex,
    currentTrick,
    team1Score,
    team2Score,
    team1Tricks,
    team2Tricks,
    user,
    setHokm,
    playCard,
  } = useGameStore();

  const [chatMessage, setChatMessage] = useState<string | null>(null);

  const getSuitSymbol = (suit: CardSuit) => {
    switch (suit) {
      case 'HEARTS': return { symbol: '♥️', color: 'text-red-500' };
      case 'DIAMONDS': return { symbol: '♦️', color: 'text-red-500' };
      case 'CLUBS': return { symbol: '♣️', color: 'text-white' };
      case 'SPADES': return { symbol: '♠️', color: 'text-white' };
    }
  };

  const getValueLabel = (value: number) => {
    if (value === 11) return 'J';
    if (value === 12) return 'Q';
    if (value === 13) return 'K';
    if (value === 14) return 'A';
    return value.toString();
  };

  const handleSendQuickPhrase = (phrase: string) => {
    setChatMessage(phrase);
    setTimeout(() => setChatMessage(null), 3000);
  };

  const isMyTurn = currentTurnIndex === 0;
  const isHakem = hakemIndex === 0;

  return (
    <div className="relative w-full h-full min-h-[600px] bg-[#0F2018] rounded-3xl border-4 border-yellow-900/40 p-4 flex flex-col justify-between items-center overflow-hidden select-none dir-rtl shadow-2xl">
      {/* 1. نوار ابزار بالای میز بازی */}
      <div className="w-full flex justify-between items-center z-20 bg-black/40 p-2.5 rounded-2xl border border-yellow-600/30 backdrop-blur-md">
        <button
          onClick={onLeave}
          className="bg-red-600/80 hover:bg-red-600 text-white font-bold text-xs px-3 py-1.5 rounded-xl border border-red-400 transition"
        >
          خروج از بازی
        </button>

        {/* نتیجه کلی و دست‌های برده شده */}
        <div className="flex items-center gap-4 text-xs font-black">
          <div className="flex items-center gap-1.5 bg-yellow-500/10 px-3 py-1 rounded-lg border border-yellow-500/30 text-yellow-400">
            <span>تیم ما:</span>
            <span className="text-sm">{team1Score}</span>
            <span className="text-gray-400">({team1Tricks})</span>
          </div>
          <div className="flex items-center gap-1.5 bg-red-500/10 px-3 py-1 rounded-lg border border-red-500/30 text-red-400">
            <span>تیم حریف:</span>
            <span className="text-sm">{team2Score}</span>
            <span className="text-gray-400">({team2Tricks})</span>
          </div>
        </div>

        {/* نمایش خال حکم */}
        <div className="bg-black/60 px-3 py-1 rounded-xl border border-yellow-500/40 text-xs font-bold text-yellow-400 flex items-center gap-1">
          <span>حکم:</span>
          {hokmSuit ? (
            <span className={getSuitSymbol(hokmSuit).color}>
              {getSuitSymbol(hokmSuit).symbol}
            </span>
          ) : (
            <span className="text-gray-400 animate-pulse">نامشخص</span>
          )}
        </div>
      </div>

      {/* 2. آواتار بازیکن بالایی (یار - صندلی ۲) */}
      <div className="flex flex-col items-center z-10">
        <div className={`relative w-12 h-12 rounded-full border-2 p-0.5 ${currentTurnIndex === 2 ? 'border-yellow-400 ring-4 ring-yellow-400/30' : 'border-gray-600'}`}>
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
            className="w-full h-full rounded-full object-cover"
            alt="Teammate"
          />
          {hakemIndex === 2 && (
            <span className="absolute -top-2 -right-2 bg-yellow-500 text-black font-extrabold text-[9px] px-1.5 py-0.5 rounded-full border border-black">
              حاکم
            </span>
          )}
        </div>
        <span className="text-[11px] font-bold text-gray-300 mt-1">رضا (یار)</span>
      </div>

      {/* 3. فضای مرکز میز (کارت‌های بازی‌شده روی زمین) */}
      <div className="relative w-72 h-52 my-auto border border-yellow-600/20 rounded-full flex items-center justify-center bg-black/20 backdrop-blur-sm">
        {/* پیام حباب چت کاربر */}
        {chatMessage && (
          <div className="absolute -bottom-8 bg-yellow-400 text-black font-bold text-xs px-3 py-1 rounded-xl shadow-lg z-30 animate-bounce">
            {chatMessage}
          </div>
        )}

        {/* کارت بازیکن صندلی ۲ (بالا) */}
        {currentTrick.find(t => t.playerId === 'bot_2') && (
          <div className="absolute top-3 w-12 h-16 bg-white rounded-lg border border-gray-400 shadow-xl flex flex-col justify-between p-1 text-black font-bold">
            <span className="text-xs">{getValueLabel(currentTrick.find(t => t.playerId === 'bot_2')!.card.value)}</span>
            <span className={`text-center text-base ${getSuitSymbol(currentTrick.find(t => t.playerId === 'bot_2')!.card.suit).color}`}>
              {getSuitSymbol(currentTrick.find(t => t.playerId === 'bot_2')!.card.suit).symbol}
            </span>
          </div>
        )}

        {/* کارت بازیکن صندلی ۰ (پایین / کاربر اصلی) */}
        {currentTrick.find(t => t.playerId === user?.id) && (
          <div className="absolute bottom-3 w-12 h-16 bg-white rounded-lg border border-gray-400 shadow-xl flex flex-col justify-between p-1 text-black font-bold z-10">
            <span className="text-xs">{getValueLabel(currentTrick.find(t => t.playerId === user?.id)!.card.value)}</span>
            <span className={`text-center text-base ${getSuitSymbol(currentTrick.find(t => t.playerId === user?.id)!.card.suit).color}`}>
              {getSuitSymbol(currentTrick.find(t => t.playerId === user?.id)!.card.suit).symbol}
            </span>
          </div>
        )}

        {/* انتخاب حکم توسط حاکم (در صورت قرار داشتن در مرحله انتخاب حکم) */}
        {gameState === 'CHOOSING_HOKM' && isHakem && (
          <div className="absolute inset-0 bg-black/90 rounded-2xl flex flex-col items-center justify-center p-3 z-30 border border-yellow-500/50">
            <span className="text-xs font-bold text-yellow-400 mb-3">حاکم محترم، حکم را تعیین کنید:</span>
            <div className="flex gap-2">
              {(['HEARTS', 'DIAMONDS', 'CLUBS', 'SPADES'] as CardSuit[]).map(suit => (
                <button
                  key={suit}
                  onClick={() => setHokm(suit)}
                  className="bg-[#1C2C24] hover:bg-yellow-500/20 border border-yellow-500/40 p-2.5 rounded-xl text-xl hover:scale-110 transition"
                >
                  <span className={getSuitSymbol(suit).color}>{getSuitSymbol(suit).symbol}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. بخش پایینی: عبارات سریع و کارت‌های دست کاربر */}
      <div className="flex flex-col items-center w-full z-20">
        {/* عبارات سریع و ایموجی‌ها */}
        <div className="flex gap-1.5 mb-2 overflow-x-auto max-w-full px-2">
          {['دست خوش!', 'سریع‌تر لطفا', 'خال‌مایه بازی کن', '😀', '🔥', '👏'].map((phrase, i) => (
            <button
              key={i}
              onClick={() => handleSendQuickPhrase(phrase)}
              className="bg-black/60 hover:bg-black text-gray-200 text-[11px] font-bold px-2.5 py-1 rounded-xl border border-gray-700 whitespace-nowrap transition"
            >
              {phrase}
            </button>
          ))}
        </div>

        {/* کارت‌های دست کاربر */}
        <div className="flex -space-x-5 hover:space-x-1 transition-all duration-300 overflow-x-auto p-2 max-w-full justify-center">
          {myHand.map((card: Card) => {
            const suitInfo = getSuitSymbol(card.suit);
            return (
              <div
                key={card.id}
                onClick={() => isMyTurn && playCard(card.id)}
                className={`w-14 h-22 bg-white border-2 border-gray-300 rounded-xl shadow-2xl flex flex-col justify-between p-1.5 cursor-pointer transform hover:-translate-y-5 hover:scale-105 transition-all text-black font-extrabold select-none ${
                  isMyTurn ? 'hover:border-yellow-500' : 'opacity-80 cursor-not-allowed'
                }`}
              >
                <span className="text-xs leading-none">{getValueLabel(card.value)}</span>
                <span className={`text-center text-xl leading-none ${suitInfo.color}`}>
                  {suitInfo.symbol}
                </span>
                <span className="self-end text-xs leading-none">{getValueLabel(card.value)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

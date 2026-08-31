// HokmEngine.ts

export type CardSuit = 'HEARTS' | 'DIAMONDS' | 'CLUBS' | 'SPADES';
export type CardValue = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14; 
// 11: سرباز (J), 12: بی‌بی (Q), 13: شاه (K), 14: تک (A)

export interface Card {
  id: string;
  suit: CardSuit;
  value: CardValue;
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  hand: Card[];
  seatIndex: number; // 0 (پایین/کاربر اصلی), 1 (راست), 2 (بالا/یار), 3 (چپ)
  team: 1 | 2;       // صندلی 0 و 2 = تیم 1 | صندلی 1 و 3 = تیم 2
}

export interface PlayedCard {
  playerId: string;
  card: Card;
}

export type GameState = 
  | 'WAITING' 
  | 'DETERMINING_HAKEM' 
  | 'CHOOSING_HOKM' 
  | 'DEALING' 
  | 'PLAYING' 
  | 'HAND_FINISHED' 
  | 'MATCH_FINISHED';

export class HokmEngine {
  private deck: Card[] = [];
  public players: Player[] = [];
  public hakemIndex: number = 0;
  public hokmSuit: CardSuit | null = null;
  public currentTurnIndex: number = 0;
  public currentTrick: PlayedCard[] = [];
  
  public team1TricksWon: number = 0; // دست‌های برده شده در این راند (تیم ۱)
  public team2TricksWon: number = 0; // دست‌های برده شده در این راند (تیم ۲)
  
  public team1GamePoints: number = 0; // امتیاز کل بازی (هدف: ۷ یا ۱۱ یا ۱۵)
  public team2GamePoints: number = 0; // امتیاز کل بازی
  
  public targetPoints: number = 7;
  public state: GameState = 'WAITING';
  public lastWinnerPlayerId: string | null = null;

  constructor(playersData: { id: string; name: string; avatar: string }[], targetPoints: number = 7) {
    if (playersData.length !== 4) {
      throw new Error("بازی حکم الزاماً نیازمند ۴ بازیکن است.");
    }

    this.targetPoints = targetPoints;
    this.players = playersData.map((p, index) => ({
      ...p,
      hand: [],
      seatIndex: index,
      team: (index % 2 === 0) ? 1 : 2,
    }));
  }

  // ----------------------------------------------------------------
  // ۱. ساخت و بر زدن دسته کارت ۵۲ تایی
  // ----------------------------------------------------------------
  private generateDeck(): Card[] {
    const suits: CardSuit[] = ['HEARTS', 'DIAMONDS', 'CLUBS', 'SPADES'];
    const cards: Card[] = [];

    for (const suit of suits) {
      for (let value = 2; value <= 14; value++) {
        cards.push({
          id: `${suit}_${value}`,
          suit,
          value: value as CardValue,
        });
      }
    }
    return cards;
  }

  private shuffleDeck(deck: Card[]): Card[] {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // ----------------------------------------------------------------
  // ۲. شروع بازی و تعیین حاکم با تک
  // ----------------------------------------------------------------
  public startMatch(): void {
    this.team1GamePoints = 0;
    this.team2GamePoints = 0;
    this.determineHakem();
  }

  public determineHakem(): void {
    this.state = 'DETERMINING_HAKEM';
    let tempDeck = this.shuffleDeck(this.generateDeck());
    let foundHakem = false;
    let cardIndex = 0;

    while (!foundHakem && cardIndex < tempDeck.length) {
      const playerIdx = cardIndex % 4;
      const drawnCard = tempDeck[cardIndex];

      if (drawnCard.value === 14) { // تک (Ace)
        this.hakemIndex = playerIdx;
        foundHakem = true;
      }
      cardIndex++;
    }

    this.startNewHand();
  }

  // ----------------------------------------------------------------
  // ۳. توزیع مرحله اول کارت‌ها (۵ کارت به حاکم)
  // ----------------------------------------------------------------
  private startNewHand(): void {
    this.team1TricksWon = 0;
    this.team2TricksWon = 0;
    this.currentTrick = [];
    this.hokmSuit = null;
    this.deck = this.shuffleDeck(this.generateDeck());

    // پاک کردن دست تمام بازیکنان
    this.players.forEach(p => p.hand = []);

    // ۵ کارت اول فقط به حاکم داده می‌شود
    this.players[this.hakemIndex].hand = this.deck.splice(0, 5);
    this.state = 'CHOOSING_HOKM';
  }

  // ----------------------------------------------------------------
  // ۴. تعیین حکم توسط حاکم
  // ----------------------------------------------------------------
  public setHokm(suit: CardSuit, requestingPlayerId: string): void {
    if (this.state !== 'CHOOSING_HOKM') {
      throw new Error("در این مرحله نمی‌توان حکم تعیین کرد.");
    }

    const currentHakem = this.players[this.hakemIndex];
    if (currentHakem.id !== requestingPlayerId) {
      throw new Error("تنها حاکم اجازه تعیین حکم را دارد.");
    }

    this.hokmSuit = suit;
    this.dealRemainingCards();
  }

  // ----------------------------------------------------------------
  // ۵. توزیع مابقی کارت‌ها (بسته ۵تایی و ۴تایی)
  // ----------------------------------------------------------------
  private dealRemainingCards(): void {
    this.state = 'DEALING';

    // توزیع بقیه کارت‌ها بین ۴ بازیکن به صورت ۴تایی/۴تایی/۵تایی
    for (let round = 0; round < 2; round++) {
      for (let i = 0; i < 4; i++) {
        const pIndex = (this.hakemIndex + i) % 4;
        const count = (round === 0) ? 4 : (pIndex === this.hakemIndex ? 4 : 5);
        this.players[pIndex].hand.push(...this.deck.splice(0, count));
      }
    }

    // مرتب‌سازی دست تمام بازیکنان بر اساس خال و مقدار
    this.players.forEach(p => this.sortHand(p.hand));

    this.currentTurnIndex = this.hakemIndex;
    this.state = 'PLAYING';
  }

  private sortHand(hand: Card[]): void {
    const suitOrder: Record<CardSuit, number> = {
      HEARTS: 1,
      DIAMONDS: 2,
      CLUBS: 3,
      SPADES: 4,
    };

    hand.sort((a, b) => {
      if (a.suit !== b.suit) {
        return suitOrder[a.suit] - suitOrder[b.suit];
      }
      return b.value - a.value;
    });
  }

  // ----------------------------------------------------------------
  // ۶. منطق بازی کردن کارت و اعتبار سنجی
  // ----------------------------------------------------------------
  public playCard(playerId: string, cardId: string): void {
    if (this.state !== 'PLAYING') {
      throw new Error("بازی در جریان نیست.");
    }

    const currentPlayer = this.players[this.currentTurnIndex];
    if (currentPlayer.id !== playerId) {
      throw new Error("نوبت شما نیست.");
    }

    const cardIndex = currentPlayer.hand.findIndex(c => c.id === cardId);
    if (cardIndex === -1) {
      throw new Error("این کارت در دست شما وجود ندارد.");
    }

    const cardToPlay = currentPlayer.hand[cardIndex];

    // بررسی قانونی بودن خال‌مایه
    if (this.currentTrick.length > 0) {
      const leadSuit = this.currentTrick[0].card.suit;
      const hasLeadSuit = currentPlayer.hand.some(c => c.suit === leadSuit);

      if (hasLeadSuit && cardToPlay.suit !== leadSuit) {
        throw new Error(`شما باید از خال زمینه (${leadSuit}) بازی کنید.`);
      }
    }

    // برداشتن کارت از دست بازیکن و اضافه کردن به وسط میز
    currentPlayer.hand.splice(cardIndex, 1);
    this.currentTrick.push({ playerId, card: cardToPlay });

    // اگر ۴ کارت روی میز آمد، برنده دست مشخص می‌شود
    if (this.currentTrick.length === 4) {
      this.evaluateTrick();
    } else {
      this.currentTurnIndex = (this.currentTurnIndex + 1) % 4;
    }
  }

  // ----------------------------------------------------------------
  // ۷. برسی برنده هر دست (Trick Evaluation)
  // ----------------------------------------------------------------
  private evaluateTrick(): void {
    const leadSuit = this.currentTrick[0].card.suit;
    let winningTrick = this.currentTrick[0];

    for (let i = 1; i < this.currentTrick.length; i++) {
      const current = this.currentTrick[i];
      
      // اگر کارت فعلی حکم باشد و کارت برنده فعلی حکم نباشد
      if (current.card.suit === this.hokmSuit && winningTrick.card.suit !== this.hokmSuit) {
        winningTrick = current;
      } 
      // اگر خال هر دو کارت یکسان باشد و مقدار کارت جدید بیشتر باشد
      else if (current.card.suit === winningTrick.card.suit && current.card.value > winningTrick.card.value) {
        winningTrick = current;
      }
    }

    const winningPlayer = this.players.find(p => p.id === winningTrick.playerId)!;
    this.lastWinnerPlayerId = winningPlayer.id;

    if (winningPlayer.team === 1) {
      this.team1TricksWon++;
    } else {
      this.team2TricksWon++;
    }

    this.currentTurnIndex = winningPlayer.seatIndex;

    // بررسی اتمام راند (رسیدن یکی از تیم‌ها به ۷ دست)
    if (this.team1TricksWon === 7 || this.team2TricksWon === 7) {
      this.finishHand();
    } else {
      this.currentTrick = [];
    }
  }

  // ----------------------------------------------------------------
  // ۸. محاسبه کُت، حاکم‌کُت و امتیاز کل راند
  // ----------------------------------------------------------------
  private finishHand(): void {
    this.state = 'HAND_FINISHED';
    const winnerTeam = this.team1TricksWon === 7 ? 1 : 2;
    const loserTricks = winnerTeam === 1 ? this.team2TricksWon : this.team1TricksWon;
    const hakemTeam = this.players[this.hakemIndex].team;

    let pointsAwarded = 1;

    // بررسی حالت‌های کُت (Kot)
    if (loserTricks === 0) {
      if (winnerTeam !== hakemTeam) {
        pointsAwarded = 3; // حاکم‌کُت (Hakem Kot)
      } else {
        pointsAwarded = 2; // کُت معمولی (Kot)
      }
    }

    // اعمال امتیازات به تیم برنده
    if (winnerTeam === 1) {
      this.team1GamePoints += pointsAwarded;
    } else {
      this.team2GamePoints += pointsAwarded;
    }

    // بررسی اتمام کلی بازی (رسیدن به امتیاز هدف مثل ۷)
    if (this.team1GamePoints >= this.targetPoints || this.team2GamePoints >= this.targetPoints) {
      this.state = 'MATCH_FINISHED';
    } else {
      // تغییر حاکم در صورت باخت تیم حاکم
      if (winnerTeam !== hakemTeam) {
        this.hakemIndex = (this.hakemIndex + 1) % 4;
      }
      
      // شروع دست بعدی
      setTimeout(() => {
        this.startNewHand();
      }, 3000);
    }
  }

  // ----------------------------------------------------------------
  // ۹. توابع کمکی دریافت اطلاعات برای فرانت‌اند
  // ----------------------------------------------------------------
  public getGameState() {
    return {
      state: this.state,
      hakemIndex: this.hakemIndex,
      hokmSuit: this.hokmSuit,
      currentTurnIndex: this.currentTurnIndex,
      currentTrick: this.currentTrick,
      team1TricksWon: this.team1TricksWon,
      team2TricksWon: this.team2TricksWon,
      team1GamePoints: this.team1GamePoints,
      team2GamePoints: this.team2GamePoints,
      targetPoints: this.targetPoints,
      lastWinnerPlayerId: this.lastWinnerPlayerId,
      players: this.players.map(p => ({
        id: p.id,
        name: p.name,
        avatar: p.avatar,
        seatIndex: p.seatIndex,
        team: p.team,
        cardCount: p.hand.length,
      })),
    };
  }

  public getPlayerHand(playerId: string): Card[] {
    const player = this.players.find(p => p.id === playerId);
    return player ? player.hand : [];
  }
}

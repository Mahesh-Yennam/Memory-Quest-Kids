/**
 * ============================================================================
 * MEMORY QUEST KIDS — FUN CARD MATCHING GAME
 * Pure Vanilla JavaScript Game Engine & Web Audio Procedural Synthesizer
 * ============================================================================
 */

(function () {
  'use strict';

  // --- THEMES & CARD DATA ---
  const THEMES = {
    animals: [
      { id: 'lion', symbol: '🦁', name: 'Lion' },
      { id: 'elephant', symbol: '🐘', name: 'Elephant' },
      { id: 'giraffe', symbol: '🦒', name: 'Giraffe' },
      { id: 'panda', symbol: '🐼', name: 'Panda' },
      { id: 'monkey', symbol: '🐵', name: 'Monkey' },
      { id: 'penguin', symbol: '🐧', name: 'Penguin' },
      { id: 'fox', symbol: '🦊', name: 'Fox' },
      { id: 'koala', symbol: '🐨', name: 'Koala' },
      { id: 'dolphin', symbol: '🐬', name: 'Dolphin' },
      { id: 'tiger', symbol: '🐯', name: 'Tiger' }
    ],
    space: [
      { id: 'rocket', symbol: '🚀', name: 'Rocket' },
      { id: 'alien', symbol: '👾', name: 'Alien' },
      { id: 'saturn', symbol: '🪐', name: 'Saturn' },
      { id: 'astronaut', symbol: '👨‍🚀', name: 'Astronaut' },
      { id: 'ufo', symbol: '🛸', name: 'UFO' },
      { id: 'telescope', symbol: '🔭', name: 'Telescope' },
      { id: 'star', symbol: '⭐', name: 'Star' },
      { id: 'comet', symbol: '☄️', name: 'Comet' },
      { id: 'satellite', symbol: '🛰️', name: 'Satellite' },
      { id: 'rover', symbol: '🤖', name: 'Rover' }
    ],
    sweets: [
      { id: 'cupcake', symbol: '🧁', name: 'Cupcake' },
      { id: 'donut', symbol: '🍩', name: 'Donut' },
      { id: 'icecream', symbol: '🍦', name: 'Ice Cream' },
      { id: 'lollipop', symbol: '🍭', name: 'Lollipop' },
      { id: 'cookie', symbol: '🍪', name: 'Cookie' },
      { id: 'candy', symbol: '🍬', name: 'Candy' },
      { id: 'popsicle', symbol: '🍧', name: 'Popsicle' },
      { id: 'cake', symbol: '🎂', name: 'Cake' },
      { id: 'waffle', symbol: '🧇', name: 'Waffle' },
      { id: 'chocolate', symbol: '🍫', name: 'Chocolate' }
    ],
    fruits: [
      { id: 'strawberry', symbol: '🍓', name: 'Strawberry' },
      { id: 'watermelon', symbol: '🍉', name: 'Watermelon' },
      { id: 'banana', symbol: '🍌', name: 'Banana' },
      { id: 'pineapple', symbol: '🍍', name: 'Pineapple' },
      { id: 'grapes', symbol: '🍇', name: 'Grapes' },
      { id: 'apple', symbol: '🍎', name: 'Apple' },
      { id: 'orange', symbol: '🍊', name: 'Orange' },
      { id: 'kiwi', symbol: '🥝', name: 'Kiwi' },
      { id: 'cherries', symbol: '🍒', name: 'Cherries' },
      { id: 'avocado', symbol: '🥑', name: 'Avocado' }
    ]
  };

  // --- AUDIO SYNTHESIZER (Web Audio API) ---
  class SoundController {
    constructor() {
      this.ctx = null;
      this.soundEnabled = true;
    }

    init() {
      if (this.ctx) return;
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }

    resume() {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggle() {
      this.soundEnabled = !this.soundEnabled;
      return this.soundEnabled;
    }

    // Crisp card flip swoosh & wooden click
    playCardFlip() {
      if (!this.soundEnabled || !this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, t);
        osc.frequency.exponentialRampToValueAtTime(180, t + 0.06);

        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.06);
      } catch (e) {}
    }

    // Joyful matching chime arpeggio
    playMatch() {
      if (!this.soundEnabled || !this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t + idx * 0.07);
          gain.gain.setValueAtTime(0.25, t + idx * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.07 + 0.35);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t + idx * 0.07);
          osc.stop(t + idx * 0.07 + 0.36);
        });
      } catch (e) {}
    }

    // Soft "uh-oh" descending tone on mismatch
    playMismatch() {
      if (!this.soundEnabled || !this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        const freqs = [340, 260];
        freqs.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t + idx * 0.1);
          gain.gain.setValueAtTime(0.2, t + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.1 + 0.16);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t + idx * 0.1);
          osc.stop(t + idx * 0.1 + 0.17);
        });
      } catch (e) {}
    }

    // Mystical shimmer on Sneak Peek hint
    playPeek() {
      if (!this.soundEnabled || !this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        const freqs = [587.33, 739.99, 880.0, 1174.66]; // D5, F#5, A5, D6
        freqs.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, t + idx * 0.06);
          gain.gain.setValueAtTime(0.2, t + idx * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.06 + 0.4);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t + idx * 0.06);
          osc.stop(t + idx * 0.06 + 0.41);
        });
      } catch (e) {}
    }

    // Grand victory fanfare
    playVictory() {
      if (!this.soundEnabled || !this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        const notes = [
          { f: 523.25, time: 0, dur: 0.15 },    // C5
          { f: 659.25, time: 0.12, dur: 0.15 },  // E5
          { f: 783.99, time: 0.24, dur: 0.18 },  // G5
          { f: 1046.5, time: 0.42, dur: 0.6 }    // C6
        ];
        notes.forEach(n => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(n.f, t + n.time);
          gain.gain.setValueAtTime(0.3, t + n.time);
          gain.gain.exponentialRampToValueAtTime(0.001, t + n.time + n.dur);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t + n.time);
          osc.stop(t + n.time + n.dur + 0.02);
        });
      } catch (e) {}
    }
  }

  // --- GAME ENGINE ---
  class MemoryQuestGame {
    constructor() {
      // DOM Elements
      this.btnSize12 = document.getElementById('btnSize12');
      this.btnSize16 = document.getElementById('btnSize16');
      this.btnSize20 = document.getElementById('btnSize20');
      this.themePills = document.querySelectorAll('.btn-theme-pill');

      this.btnToggleAudio = document.getElementById('btnToggleAudio');
      this.audioIcon = document.getElementById('audioIcon');

      this.hudMoves = document.getElementById('hudMoves');
      this.hudStreakBadge = document.getElementById('hudStreakBadge');
      this.pairsFoundEl = document.getElementById('pairsFound');
      this.pairsTotalEl = document.getElementById('pairsTotal');
      this.hudBestMoves = document.getElementById('hudBestMoves');
      this.btnSneakPeek = document.getElementById('btnSneakPeek');

      this.cardsGrid = document.getElementById('cardsGrid');
      this.fxOverlay = document.getElementById('fxOverlay');

      // Modals
      this.startOverlay = document.getElementById('startOverlay');
      this.victoryOverlay = document.getElementById('victoryOverlay');
      this.btnStartGame = document.getElementById('btnStartGame');
      this.btnPlayAgain = document.getElementById('btnPlayAgain');

      this.modalThemeBtns = document.querySelectorAll('.theme-card-btn');
      this.victoryMoves = document.getElementById('victoryMoves');
      this.victoryBestMoves = document.getElementById('victoryBestMoves');
      this.victoryCardCount = document.getElementById('victoryCardCount');
      this.victoryMaxStreak = document.getElementById('victoryMaxStreak');
      this.victoryTimeTaken = document.getElementById('victoryTimeTaken');
      this.victoryStars = [
        document.getElementById('vStar1'),
        document.getElementById('vStar2'),
        document.getElementById('vStar3')
      ];

      // Audio Controller
      this.audio = new SoundController();

      // State
      this.gridSize = 16; // 12 | 16 | 20
      this.currentTheme = 'animals'; // 'animals' | 'space' | 'sweets' | 'fruits'
      this.moves = 0;
      this.pairsFound = 0;
      this.totalPairs = 8;
      this.streak = 0;
      this.maxStreak = 0;
      this.startTime = null;
      this.flippedCards = [];
      this.isLocked = false;
      this.peekUsed = false;
      this.cardsData = [];

      // Pending timers
      this.mismatchTimeout = null;
      this.peekTimeout = null;

      this.loadBestScore();
      this.bindEvents();
    }

    getStorageKey() {
      return `gamility_memory_best_${this.gridSize}`;
    }

    loadBestScore() {
      try {
        const val = localStorage.getItem(this.getStorageKey());
        const best = val ? parseInt(val, 10) : null;
        this.hudBestMoves.textContent = best !== null ? best.toString() : '--';
      } catch (e) {
        this.hudBestMoves.textContent = '--';
      }
    }

    saveBestScore() {
      try {
        const key = this.getStorageKey();
        const prev = localStorage.getItem(key);
        const prevBest = prev ? parseInt(prev, 10) : Infinity;
        if (this.moves < prevBest) {
          localStorage.setItem(key, this.moves.toString());
          this.hudBestMoves.textContent = this.moves.toString();
          return this.moves;
        }
        return prevBest !== Infinity ? prevBest : this.moves;
      } catch (e) {
        return this.moves;
      }
    }

    bindEvents() {
      // Audio toggle
      this.btnToggleAudio.addEventListener('click', (e) => {
        e.stopPropagation();
        this.audio.init();
        const enabled = this.audio.toggle();
        this.audioIcon.textContent = enabled ? '🔊' : '🔇';
      });

      // Start Modal
      this.modalThemeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          this.modalThemeBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.currentTheme = btn.dataset.theme;
          this.updateThemeUI();
        });
      });

      this.btnStartGame.addEventListener('click', () => {
        this.audio.init();
        this.audio.resume();
        this.startOverlay.style.display = 'none';
        this.startNewGame();
      });

      this.btnPlayAgain.addEventListener('click', () => {
        this.victoryOverlay.style.display = 'none';
        this.startNewGame();
      });

      // Grid Size Switchers
      [this.btnSize12, this.btnSize16, this.btnSize20].forEach(btn => {
        btn.addEventListener('click', () => {
          this.audio.playCardFlip();
          const size = parseInt(btn.dataset.size, 10);
          if (this.gridSize === size) return;
          this.gridSize = size;
          this.updateSizeUI();
          this.loadBestScore();
          this.startNewGame();
        });
      });

      // Theme Selector Pills
      this.themePills.forEach(pill => {
        pill.addEventListener('click', () => {
          this.audio.playCardFlip();
          const theme = pill.dataset.theme;
          if (this.currentTheme === theme) return;
          this.currentTheme = theme;
          this.updateThemeUI();
          this.startNewGame();
        });
      });

      // Sneak Peek Hint Button
      this.btnSneakPeek.addEventListener('click', () => {
        this.triggerSneakPeek();
      });
    }

    updateSizeUI() {
      [this.btnSize12, this.btnSize16, this.btnSize20].forEach(btn => {
        if (parseInt(btn.dataset.size, 10) === this.gridSize) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      this.cardsGrid.className = `cards-grid size-${this.gridSize}`;
    }

    updateThemeUI() {
      this.themePills.forEach(pill => {
        if (pill.dataset.theme === this.currentTheme) {
          pill.classList.add('active');
        } else {
          pill.classList.remove('active');
        }
      });

      this.modalThemeBtns.forEach(btn => {
        if (btn.dataset.theme === this.currentTheme) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }

    // --- GAME INITIALIZATION & CARD SETUP ---
    startNewGame() {
      // Clear timers
      if (this.mismatchTimeout) {
        clearTimeout(this.mismatchTimeout);
        this.mismatchTimeout = null;
      }
      if (this.peekTimeout) {
        clearTimeout(this.peekTimeout);
        this.peekTimeout = null;
      }

      this.moves = 0;
      this.pairsFound = 0;
      this.totalPairs = this.gridSize / 2;
      this.streak = 0;
      this.maxStreak = 0;
      this.flippedCards = [];
      this.isLocked = false;
      this.peekUsed = false;
      this.startTime = Date.now();

      // Reset HUD
      this.hudMoves.textContent = '0';
      this.hudStreakBadge.style.display = 'none';
      this.pairsFoundEl.textContent = '0';
      this.pairsTotalEl.textContent = this.totalPairs.toString();
      this.btnSneakPeek.disabled = false;
      this.updateSizeUI();
      this.updateThemeUI();
      this.loadBestScore();

      this.buildCardsDeck();
      this.renderCards();
    }

    buildCardsDeck() {
      const themeItems = [...THEMES[this.currentTheme]];
      // Shuffle theme items so different items appear in 12 or 16 grids
      for (let i = themeItems.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [themeItems[i], themeItems[j]] = [themeItems[j], themeItems[i]];
      }

      // Select exact number of pairs needed
      const selectedPairs = themeItems.slice(0, this.totalPairs);

      // Duplicate each item to create exact twins
      const deck = [];
      selectedPairs.forEach(item => {
        deck.push({ ...item, uid: `${item.id}_a` });
        deck.push({ ...item, uid: `${item.id}_b` });
      });

      // Fisher-Yates Shuffle
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }

      this.cardsData = deck;
    }

    renderCards() {
      this.cardsGrid.innerHTML = '';

      this.cardsData.forEach((cardItem, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.id = cardItem.id;
        card.dataset.uid = cardItem.uid;
        card.dataset.index = index.toString();

        card.innerHTML = `
          <div class="card-inner">
            <div class="card-front" aria-label="Card Hidden">
              <span class="card-star-emblem">⭐</span>
            </div>
            <div class="card-back" aria-label="${cardItem.name}">
              <span class="card-symbol">${cardItem.symbol}</span>
              <span class="card-name">${cardItem.name}</span>
            </div>
          </div>
        `;

        card.addEventListener('click', () => this.handleCardClick(card, cardItem));
        this.cardsGrid.appendChild(card);
      });
    }

    // --- CARD SELECTION & MATCH LOGIC ---
    handleCardClick(card, cardItem) {
      if (this.isLocked) return;
      if (card.classList.contains('flipped') || card.classList.contains('matched')) return;

      this.audio.playCardFlip();
      card.classList.add('flipped');
      this.flippedCards.push({ card, item: cardItem });

      if (this.flippedCards.length === 2) {
        this.moves++;
        this.hudMoves.textContent = this.moves.toString();
        this.evaluateTurn();
      }
    }

    evaluateTurn() {
      const [first, second] = this.flippedCards;
      const isMatch = (first.item.id === second.item.id);

      if (isMatch) {
        this.handleMatchSuccess(first.card, second.card);
      } else {
        this.handleMismatch(first.card, second.card);
      }
    }

    handleMatchSuccess(card1, card2) {
      this.audio.playMatch();
      this.pairsFound++;
      this.streak++;
      if (this.streak > this.maxStreak) this.maxStreak = this.streak;

      this.pairsFoundEl.textContent = this.pairsFound.toString();

      // Show combo streak badge if streak >= 2
      if (this.streak >= 2) {
        this.hudStreakBadge.textContent = `${this.streak}x🔥`;
        this.hudStreakBadge.style.display = 'inline-block';
      }

      card1.classList.add('matched');
      card2.classList.add('matched');
      this.spawnMatchSparkles(card1);
      this.spawnMatchSparkles(card2);

      this.flippedCards = [];

      // Check for Game Completion
      if (this.pairsFound === this.totalPairs) {
        setTimeout(() => this.handleVictory(), 600);
      }
    }

    handleMismatch(card1, card2) {
      this.isLocked = true;
      this.streak = 0;
      this.hudStreakBadge.style.display = 'none';

      this.mismatchTimeout = setTimeout(() => {
        this.audio.playMismatch();
        card1.classList.add('shake');
        card2.classList.add('shake');

        setTimeout(() => {
          card1.classList.remove('flipped', 'shake');
          card2.classList.remove('flipped', 'shake');
          this.flippedCards = [];
          this.isLocked = false;
        }, 450);
      }, 550);
    }

    // --- SNEAK PEEK HINT (1.5s visual reveal) ---
    triggerSneakPeek() {
      if (this.peekUsed || this.isLocked || this.pairsFound === this.totalPairs) return;

      this.peekUsed = true;
      this.btnSneakPeek.disabled = true;
      this.audio.playPeek();

      const allCards = this.cardsGrid.querySelectorAll('.memory-card');
      allCards.forEach(card => {
        if (!card.classList.contains('matched')) {
          card.classList.add('flipped');
        }
      });

      this.isLocked = true;

      this.peekTimeout = setTimeout(() => {
        allCards.forEach(card => {
          if (!card.classList.contains('matched')) {
            card.classList.remove('flipped');
          }
        });
        this.flippedCards = [];
        this.isLocked = false;
      }, 1500);
    }

    // --- VICTORY & 3-STAR RATING CALCULATION ---
    handleVictory() {
      this.audio.playVictory();
      this.spawnConfetti();

      const best = this.saveBestScore();
      const elapsedSec = Math.floor((Date.now() - this.startTime) / 1000);
      const mins = Math.floor(elapsedSec / 60);
      const secs = (elapsedSec % 60).toString().padStart(2, '0');

      this.victoryMoves.textContent = this.moves.toString();
      this.victoryBestMoves.textContent = best.toString();
      this.victoryCardCount.textContent = this.gridSize.toString();
      this.victoryMaxStreak.textContent = this.maxStreak.toString();
      this.victoryTimeTaken.textContent = `${mins}:${secs}`;

      // Star calculation based on optimal ratio
      // 12 cards (6 pairs): <= 9 moves (3 stars), <= 14 moves (2 stars), else 1 star
      // 16 cards (8 pairs): <= 12 moves (3 stars), <= 18 moves (2 stars), else 1 star
      // 20 cards (10 pairs): <= 15 moves (3 stars), <= 23 moves (2 stars), else 1 star
      let starsEarned = 1;
      const perfect = this.totalPairs;
      if (this.moves <= Math.round(perfect * 1.5)) {
        starsEarned = 3;
      } else if (this.moves <= Math.round(perfect * 2.3)) {
        starsEarned = 2;
      }

      this.victoryStars.forEach((star, idx) => {
        if (idx < starsEarned) {
          star.classList.add('active');
        } else {
          star.classList.remove('active');
        }
      });

      this.victoryOverlay.style.display = 'flex';
    }

    // --- PARTICLE FX (Confetti & Sparkles) ---
    spawnMatchSparkles(cardEl) {
      const rect = cardEl.getBoundingClientRect();
      const parentRect = this.fxOverlay.getBoundingClientRect();

      const cx = rect.left - parentRect.left + rect.width / 2;
      const cy = rect.top - parentRect.top + rect.height / 2;

      const colors = ['#f59e0b', '#fbbf24', '#fde047', '#6366f1'];
      for (let i = 0; i < 8; i++) {
        const p = document.createElement('div');
        p.className = 'confetti-piece';
        p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        p.style.left = `${cx}px`;
        p.style.top = `${cy}px`;
        p.style.width = '6px';
        p.style.height = '6px';
        p.style.borderRadius = '50%';

        const angle = Math.random() * Math.PI * 2;
        const dist = 24 + Math.random() * 32;
        p.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
        p.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);

        this.fxOverlay.appendChild(p);
        setTimeout(() => p.remove(), 800);
      }
    }

    spawnConfetti() {
      const colors = ['#6366f1', '#4f46e5', '#f59e0b', '#10b981', '#ec4899', '#38bdf8'];
      for (let i = 0; i < 32; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        piece.style.left = `${10 + Math.random() * 80}%`;
        piece.style.top = `${30 + Math.random() * 30}%`;

        const angle = Math.random() * Math.PI * 2;
        const dist = 60 + Math.random() * 110;
        piece.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
        piece.style.setProperty('--ty', `${Math.sin(angle) * dist - 40}px`);

        this.fxOverlay.appendChild(piece);
        setTimeout(() => piece.remove(), 1200);
      }
    }
  }

  // Boot on DOM ready
  window.addEventListener('DOMContentLoaded', () => {
    window.gamilityMemoryQuest = new MemoryQuestGame();
  });

})();

// UI Controller for Screen Navigation, Board Rendering, Confetti & Modals

import { APP_CONFIG, PUZZLE_IMAGES } from './config.js';
import { Storage } from './storage.js';
import { sound } from './audio.js';

export class UIController {
  constructor(engine) {
    this.engine = engine;
    this.currentScreen = 'home';
    this.selectedImage = PUZZLE_IMAGES[0];
    this.confettiParticles = [];
    this.confettiAnimId = null;

    this.cacheDOMElements();
    this.initConfetti();
    this.bindEvents();
    this.loadInitialData();
  }

  cacheDOMElements() {
    // Screens
    this.screens = {
      home: document.getElementById('screen-home'),
      puzzle: document.getElementById('screen-puzzle'),
      leaderboard: document.getElementById('screen-leaderboard'),
      profile: document.getElementById('screen-profile')
    };

    // Navigation Tabs
    this.navTabs = document.querySelectorAll('.nav-tab-item');

    // Home screen elements
    this.playerNameInput = document.getElementById('player-name-input');
    this.startChallengeBtn = document.getElementById('btn-start-challenge');
    this.homeLeaderboardList = document.getElementById('home-leaderboard-preview');
    this.themeCapsulesContainer = document.getElementById('theme-capsules-container');

    // Puzzle screen elements
    this.headerTitle = document.getElementById('header-title');
    this.headerBackBtn = document.getElementById('header-back-btn');
    this.headerTrophyBtn = document.getElementById('header-trophy-btn');
    this.playerBadgeName = document.getElementById('player-badge-name');
    this.playerBadgeTag = document.getElementById('player-badge-tag');
    this.playerAvatarBadge = document.getElementById('player-avatar-badge');
    this.goalReferenceBox = document.getElementById('goal-reference-box');
    this.puzzleBoardGrid = document.getElementById('puzzle-board-grid');
    this.statTimeVal = document.getElementById('stat-time-val');
    this.statMovesVal = document.getElementById('stat-moves-val');
    this.btnHint = document.getElementById('btn-hint');
    this.btnRestart = document.getElementById('btn-restart');
    this.btnToggleGoal = document.getElementById('btn-toggle-goal');

    // Transition Overlay
    this.assignmentOverlay = document.getElementById('assignment-overlay');
    this.assignPlayerTag = document.getElementById('assign-player-tag');
    this.assignPlayerName = document.getElementById('assign-player-name');

    // Victory Modal
    this.victoryModal = document.getElementById('victory-modal');
    this.victoryPlayerName = document.getElementById('victory-player-name');
    this.victoryScoreVal = document.getElementById('victory-score-val');
    this.victoryTimeVal = document.getElementById('victory-time-val');
    this.victoryMovesVal = document.getElementById('victory-moves-val');
    this.victoryImagePreview = document.getElementById('victory-image-preview');
    this.btnPlayAgain = document.getElementById('btn-play-again');
    this.btnViewLeaderboard = document.getElementById('btn-view-leaderboard');

    // Confirm Dialog
    this.confirmModal = document.getElementById('confirm-modal');
    this.btnConfirmCancel = document.getElementById('btn-confirm-cancel');
    this.btnConfirmRestart = document.getElementById('btn-confirm-restart');

    // Leaderboard Screen
    this.fullLeaderboardList = document.getElementById('full-leaderboard-list');
    this.leaderboardFilterTabs = document.querySelectorAll('.lb-filter-tab');

    // Profile Screen
    this.profileName = document.getElementById('profile-name');
    this.profileTag = document.getElementById('profile-tag');
    this.statGamesWon = document.getElementById('profile-games-won');
    this.statBestScore = document.getElementById('profile-best-score');
    this.statBestTime = document.getElementById('profile-best-time');
    this.audioToggle = document.getElementById('profile-audio-toggle');
    this.themeToggle = document.getElementById('profile-theme-toggle');

    // Device Switcher
    this.devicePhoneFrame = document.getElementById('mobile-phone-frame');
    this.deviceButtons = document.querySelectorAll('.switcher-btn');

    // Confetti canvas
    this.confettiCanvas = document.getElementById('confetti-canvas');
    this.confettiCtx = this.confettiCanvas ? this.confettiCanvas.getContext('2d') : null;
  }

  loadInitialData() {
    const savedName = Storage.getPlayerName();
    const savedId = Storage.getParticipantId();

    if (this.playerNameInput) {
      this.playerNameInput.value = savedName;
    }
    this.updatePlayerInfoLabels(savedName, savedId);
    this.renderThemeCapsules();
    this.renderLeaderboards();
    this.renderProfileStats();

    // Audio setting
    const isAudioOn = Storage.getAudioSetting();
    sound.enabled = isAudioOn;
    if (this.audioToggle) {
      this.audioToggle.checked = isAudioOn;
    }
  }

  updatePlayerInfoLabels(name, id) {
    if (this.playerBadgeName) this.playerBadgeName.textContent = name;
    if (this.playerBadgeTag) this.playerBadgeTag.textContent = `Participant #${id}`;
    if (this.playerAvatarBadge) this.playerAvatarBadge.textContent = name.charAt(0).toUpperCase() || 'P';
    if (this.profileName) this.profileName.textContent = name;
    if (this.profileTag) this.profileTag.textContent = `Participant #${id}`;
  }

  bindEvents() {
    // Navigation tabs
    this.navTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        sound.playTap();
        const screenKey = tab.dataset.screen;
        this.switchScreen(screenKey);
      });
    });

    // Start Challenge CTA
    if (this.startChallengeBtn) {
      this.startChallengeBtn.addEventListener('click', () => {
        sound.playTap();
        this.handleStartChallengeFlow();
      });
    }

    // Name Input Change
    if (this.playerNameInput) {
      this.playerNameInput.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        if (val) {
          Storage.setPlayerName(val);
          this.updatePlayerInfoLabels(val, Storage.getParticipantId());
        }
      });
    }

    // Header Back button
    if (this.headerBackBtn) {
      this.headerBackBtn.addEventListener('click', () => {
        sound.playTap();
        this.switchScreen('home');
      });
    }

    // Header Trophy button
    if (this.headerTrophyBtn) {
      this.headerTrophyBtn.addEventListener('click', () => {
        sound.playTap();
        this.switchScreen('leaderboard');
      });
    }

    // Hint Button
    if (this.btnHint) {
      this.btnHint.addEventListener('click', () => {
        const nextMove = this.engine.requestHint();
        if (nextMove) {
          this.highlightTile(nextMove.tile);
        }
      });
    }

    // Restart Button -> Confirm Dialog
    if (this.btnRestart) {
      this.btnRestart.addEventListener('click', () => {
        sound.playTap();
        this.showConfirmDialog();
      });
    }

    if (this.btnConfirmCancel) {
      this.btnConfirmCancel.addEventListener('click', () => {
        sound.playTap();
        this.hideConfirmDialog();
      });
    }

    if (this.btnConfirmRestart) {
      this.btnConfirmRestart.addEventListener('click', () => {
        sound.playTap();
        this.hideConfirmDialog();
        this.startPuzzleGame();
      });
    }

    // Victory Modal Buttons
    if (this.btnPlayAgain) {
      this.btnPlayAgain.addEventListener('click', () => {
        sound.playTap();
        this.hideVictoryModal();
        this.startPuzzleGame();
      });
    }

    if (this.btnViewLeaderboard) {
      this.btnViewLeaderboard.addEventListener('click', () => {
        sound.playTap();
        this.hideVictoryModal();
        this.switchScreen('leaderboard');
      });
    }

    // Toggle Goal Preview
    if (this.btnToggleGoal) {
      this.btnToggleGoal.addEventListener('click', () => {
        sound.playTap();
        if (this.goalReferenceBox) {
          const isHidden = this.goalReferenceBox.style.display === 'none';
          this.goalReferenceBox.style.display = isHidden ? 'flex' : 'none';
          this.btnToggleGoal.textContent = isHidden ? '👁 Hide Preview' : '👁 Show Preview';
        }
      });
    }

    // Audio Setting Toggle
    if (this.audioToggle) {
      this.audioToggle.addEventListener('change', (e) => {
        const enabled = e.target.checked;
        sound.enabled = enabled;
        Storage.setAudioSetting(enabled);
        if (enabled) sound.playTap();
      });
    }

    // Theme Toggle (Light/Dark)
    if (this.themeToggle) {
      this.themeToggle.addEventListener('change', (e) => {
        sound.playTap();
        const theme = e.target.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
      });
    }

    // Device switcher frame buttons
    this.deviceButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.deviceButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mode = btn.dataset.device;
        this.devicePhoneFrame.className = `mobile-phone-frame mode-${mode}`;
      });
    });
  }

  switchScreen(screenKey) {
    this.currentScreen = screenKey;
    Object.keys(this.screens).forEach(k => {
      if (this.screens[k]) {
        this.screens[k].classList.toggle('active', k === screenKey);
      }
    });

    this.navTabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.screen === screenKey);
    });

    if (screenKey === 'leaderboard') {
      this.renderLeaderboards();
    } else if (screenKey === 'profile') {
      this.renderProfileStats();
    }
  }

  handleStartChallengeFlow() {
    const rawName = this.playerNameInput.value.trim() || APP_CONFIG.DEFAULT_PLAYER_NAME;
    Storage.setPlayerName(rawName);
    const participantId = Storage.getParticipantId();

    this.updatePlayerInfoLabels(rawName, participantId);

    // Show Animated Assignment Overlay
    if (this.assignPlayerName) this.assignPlayerName.textContent = rawName;
    if (this.assignPlayerTag) this.assignPlayerTag.textContent = `PLAYER #${participantId}`;
    if (this.assignmentOverlay) this.assignmentOverlay.classList.add('active');

    setTimeout(() => {
      if (this.assignmentOverlay) this.assignmentOverlay.classList.remove('active');
      this.switchScreen('puzzle');
      this.startPuzzleGame();
    }, APP_CONFIG.TRANSITION_DURATION);
  }

  startPuzzleGame() {
    this.engine.setImage(this.selectedImage);
    this.updateGoalReferenceImage();
    this.engine.startNewGame('standard');
    this.updateHintButtonState(this.engine.hintsRemaining);
  }

  updateGoalReferenceImage() {
    if (this.goalReferenceBox && this.selectedImage) {
      this.goalReferenceBox.style.backgroundImage = `url("${this.selectedImage.url}")`;
    }
  }

  renderThemeCapsules() {
    if (!this.themeCapsulesContainer) return;
    this.themeCapsulesContainer.innerHTML = '';

    PUZZLE_IMAGES.forEach((img, idx) => {
      const capsule = document.createElement('div');
      capsule.className = `theme-capsule ${img.id === this.selectedImage.id ? 'active' : ''}`;
      capsule.innerHTML = `<span>🧩</span> ${img.title}`;
      capsule.addEventListener('click', () => {
        sound.playTap();
        this.selectedImage = img;
        Storage.setSelectedImageId(img.id);
        this.renderThemeCapsules();
      });
      this.themeCapsulesContainer.appendChild(capsule);
    });
  }

  renderBoard(state, moveDetails = null) {
    if (!this.puzzleBoardGrid) return;
    this.puzzleBoardGrid.innerHTML = '';

    state.forEach((tileVal, gridIdx) => {
      const tile = document.createElement('div');
      tile.className = 'puzzle-tile';
      tile.dataset.gridIndex = gridIdx;
      tile.dataset.tileValue = tileVal;

      if (tileVal === 0) {
        tile.classList.add('tile-blank');
      } else {
        tile.classList.add(`tile-val-${tileVal}`);
        if (this.selectedImage) {
          tile.style.backgroundImage = `url("${this.selectedImage.url}")`;
        }

        // Add subtle stylish corner number badge
        const numBadge = document.createElement('div');
        numBadge.className = 'tile-number-badge';
        numBadge.textContent = tileVal;
        tile.appendChild(numBadge);

        // Slide animation class
        if (moveDetails && moveDetails.movedTile === tileVal) {
          const from = moveDetails.fromIndex;
          const to = moveDetails.toIndex;
          if (to === from - 3) tile.classList.add('tile-slide-up');
          else if (to === from + 3) tile.classList.add('tile-slide-down');
          else if (to === from - 1) tile.classList.add('tile-slide-left');
          else if (to === from + 1) tile.classList.add('tile-slide-right');
        }
      }

      this.puzzleBoardGrid.appendChild(tile);
    });
  }

  highlightTile(tileVal) {
    const tiles = this.puzzleBoardGrid.querySelectorAll('.puzzle-tile');
    tiles.forEach(t => {
      if (parseInt(t.dataset.tileValue, 10) === tileVal) {
        t.classList.add('hint-active');
        setTimeout(() => {
          t.classList.remove('hint-active');
        }, 1800);
      }
    });
  }

  updateStats(timeStr, moves) {
    if (this.statTimeVal) this.statTimeVal.textContent = timeStr;
    if (this.statMovesVal) this.statMovesVal.textContent = moves;
  }

  updateHintButtonState(hintsRemaining) {
    if (!this.btnHint) return;
    this.btnHint.innerHTML = `💡 Hint · ${hintsRemaining} left`;
    this.btnHint.disabled = hintsRemaining <= 0;
  }

  showVictoryModal(results) {
    const playerName = Storage.getPlayerName();
    const participantId = Storage.getParticipantId();

    if (this.victoryPlayerName) {
      this.victoryPlayerName.textContent = `${playerName} · #${participantId}`;
    }
    if (this.victoryScoreVal) this.victoryScoreVal.textContent = results.score;
    if (this.victoryTimeVal) this.victoryTimeVal.textContent = results.timeFormatted;
    if (this.victoryMovesVal) this.victoryMovesVal.textContent = results.moves;
    if (this.victoryImagePreview && results.image) {
      this.victoryImagePreview.style.backgroundImage = `url("${results.image.url}")`;
    }

    // Save record to persistent storage
    const newRecord = {
      name: playerName,
      id: participantId,
      avatar: playerName.charAt(0).toUpperCase() || 'P',
      avatarColor: results.image?.themeColor || '#6366F1',
      score: results.score,
      timeFormatted: results.timeFormatted,
      timeSec: results.timeSec,
      moves: results.moves,
      date: 'Just now'
    };
    Storage.addScoreRecord(newRecord);

    if (this.victoryModal) this.victoryModal.classList.add('active');
    this.startConfetti();
  }

  hideVictoryModal() {
    if (this.victoryModal) this.victoryModal.classList.remove('active');
    this.stopConfetti();
  }

  showConfirmDialog() {
    if (this.confirmModal) this.confirmModal.classList.add('active');
  }

  hideConfirmDialog() {
    if (this.confirmModal) this.confirmModal.classList.remove('active');
  }

  renderLeaderboards() {
    const list = Storage.getLeaderboard();
    const currentName = Storage.getPlayerName();
    const currentId = Storage.getParticipantId();

    const generateCardsHtml = (items) => {
      return items.map((item, idx) => {
        const isCurrent = (item.name === currentName && item.id === currentId);
        return `
          <div class="leaderboard-card-item ${isCurrent ? 'highlight-player' : ''}">
            <div class="rank-left-group">
              <div class="rank-badge-icon">${item.badge || `#${idx + 1}`}</div>
              <div class="rank-avatar-circle" style="background: ${item.avatarColor || '#6366F1'}">
                ${item.avatar || item.name.charAt(0)}
              </div>
              <div class="rank-player-meta">
                <div class="rank-player-name">${item.name}</div>
                <div class="rank-player-sub">#${item.id} · ${item.date}</div>
              </div>
            </div>
            <div class="rank-score-group">
              <div class="rank-score-val">${item.score}</div>
              <div class="rank-time-moves">${item.timeFormatted} · ${item.moves}m</div>
            </div>
          </div>
        `;
      }).join('');
    };

    // Home Preview (Top 3)
    if (this.homeLeaderboardList) {
      this.homeLeaderboardList.innerHTML = generateCardsHtml(list.slice(0, 3));
    }

    // Full Leaderboard Screen
    if (this.fullLeaderboardList) {
      this.fullLeaderboardList.innerHTML = generateCardsHtml(list);
    }
  }

  renderProfileStats() {
    const stats = Storage.getPlayerStats();
    if (this.statGamesWon) this.statGamesWon.textContent = stats.gamesWon;
    if (this.statBestScore) this.statBestScore.textContent = stats.bestScore;
    if (this.statBestTime) {
      this.statBestTime.textContent = stats.bestTimeSec === 9999 ? '--:--' : this.engine.formatTime(stats.bestTimeSec);
    }
  }

  // ==========================================
  // Confetti Particle Explosion Engine
  // ==========================================
  initConfetti() {
    if (!this.confettiCanvas) return;
    const resizeCanvas = () => {
      this.confettiCanvas.width = this.confettiCanvas.offsetWidth || 390;
      this.confettiCanvas.height = this.confettiCanvas.offsetHeight || 844;
    };
    resizeCanvas();
  }

  startConfetti() {
    if (!this.confettiCanvas || !this.confettiCtx) return;
    this.confettiParticles = [];
    const colors = ['#6366F1', '#EC4899', '#F59E0B', '#10B981', '#06B6D4', '#8B5CF6', '#F43F5E'];

    for (let i = 0; i < 75; i++) {
      this.confettiParticles.push({
        x: Math.random() * this.confettiCanvas.width,
        y: Math.random() * (this.confettiCanvas.height * 0.3),
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 6,
        vy: Math.random() * 4 + 2,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10
      });
    }

    const animate = () => {
      this.confettiCtx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);
      this.confettiParticles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;

        this.confettiCtx.save();
        this.confettiCtx.translate(p.x, p.y);
        this.confettiCtx.rotate((p.rotation * Math.PI) / 180);
        this.confettiCtx.fillStyle = p.color;
        this.confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        this.confettiCtx.restore();
      });

      this.confettiAnimId = requestAnimationFrame(animate);
    };

    if (this.confettiAnimId) cancelAnimationFrame(this.confettiAnimId);
    animate();
  }

  stopConfetti() {
    if (this.confettiAnimId) {
      cancelAnimationFrame(this.confettiAnimId);
      this.confettiAnimId = null;
    }
    if (this.confettiCtx && this.confettiCanvas) {
      this.confettiCtx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);
    }
  }
}

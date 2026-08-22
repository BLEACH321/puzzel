// Touch, Swipe, and Pointer Gesture Engine for 8-Puzzle Mobile

export class GestureController {
  constructor(boardElement, onTileMoveIntent) {
    this.board = boardElement;
    this.onTileMoveIntent = onTileMoveIntent; // callback(index, direction)
    this.startX = 0;
    this.startY = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.touchStartTime = 0;
    this.activeTileIndex = null;
    this.isDragging = false;
    this.minSwipeDistance = 25; // px threshold for swipe

    this.bindEvents();
  }

  bindEvents() {
    // Touch Events
    this.board.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
    this.board.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
    this.board.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });
    this.board.addEventListener('touchcancel', () => this.resetState());

    // Mouse / Pointer fallback for desktop testing
    this.board.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    window.addEventListener('mouseup', (e) => this.handleMouseUp(e));
  }

  getTileIndexFromTarget(target) {
    const tileEl = target.closest('.puzzle-tile');
    if (!tileEl) return null;
    return parseInt(tileEl.dataset.gridIndex, 10);
  }

  handleTouchStart(e) {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    const tileIndex = this.getTileIndexFromTarget(e.target);

    if (tileIndex !== null) {
      // Prevent browser default pull-to-refresh or page dragging while on board
      e.preventDefault();
      this.isDragging = true;
      this.activeTileIndex = tileIndex;
      this.startX = touch.clientX;
      this.startY = touch.clientY;
      this.currentX = touch.clientX;
      this.currentY = touch.clientY;
      this.touchStartTime = Date.now();
    }
  }

  handleTouchMove(e) {
    if (!this.isDragging) return;
    e.preventDefault();
    if (e.touches.length === 1) {
      this.currentX = e.touches[0].clientX;
      this.currentY = e.touches[0].clientY;
    }
  }

  handleTouchEnd(e) {
    if (!this.isDragging) return;
    this.isDragging = false;

    const deltaX = this.currentX - this.startX;
    const deltaY = this.currentY - this.startY;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    const duration = Date.now() - this.touchStartTime;

    if (absX >= this.minSwipeDistance || absY >= this.minSwipeDistance) {
      // Recognized swipe gesture
      let direction = null;
      if (absX > absY) {
        direction = deltaX > 0 ? 'right' : 'left';
      } else {
        direction = deltaY > 0 ? 'down' : 'up';
      }

      if (this.activeTileIndex !== null && direction) {
        this.onTileMoveIntent(this.activeTileIndex, direction, 'swipe');
      }
    } else if (duration < 400 && absX < 15 && absY < 15) {
      // Tap gesture
      if (this.activeTileIndex !== null) {
        this.onTileMoveIntent(this.activeTileIndex, null, 'tap');
      }
    }

    this.resetState();
  }

  handleMouseDown(e) {
    if (e.button !== 0) return;
    const tileIndex = this.getTileIndexFromTarget(e.target);
    if (tileIndex !== null) {
      this.isDragging = true;
      this.activeTileIndex = tileIndex;
      this.startX = e.clientX;
      this.startY = e.clientY;
      this.currentX = e.clientX;
      this.currentY = e.clientY;
      this.touchStartTime = Date.now();
    }
  }

  handleMouseMove(e) {
    if (!this.isDragging) return;
    this.currentX = e.clientX;
    this.currentY = e.clientY;
  }

  handleMouseUp(e) {
    if (!this.isDragging) return;
    this.isDragging = false;

    const deltaX = this.currentX - this.startX;
    const deltaY = this.currentY - this.startY;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    const duration = Date.now() - this.touchStartTime;

    if (absX >= this.minSwipeDistance || absY >= this.minSwipeDistance) {
      let direction = null;
      if (absX > absY) {
        direction = deltaX > 0 ? 'right' : 'left';
      } else {
        direction = deltaY > 0 ? 'down' : 'up';
      }

      if (this.activeTileIndex !== null && direction) {
        this.onTileMoveIntent(this.activeTileIndex, direction, 'swipe');
      }
    } else if (duration < 400 && absX < 15 && absY < 15) {
      if (this.activeTileIndex !== null) {
        this.onTileMoveIntent(this.activeTileIndex, null, 'tap');
      }
    }

    this.resetState();
  }

  resetState() {
    this.isDragging = false;
    this.activeTileIndex = null;
    this.startX = 0;
    this.startY = 0;
    this.currentX = 0;
    this.currentY = 0;
  }
}

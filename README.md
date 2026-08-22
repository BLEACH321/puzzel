# 🧩 8-Puzzle Mobile Game (React + Vite)

A modern, mobile-first 8-Puzzle web application built with **React 18** and **Vite**, featuring authentic **3D interlocking jigsaw piece shapes**, **dynamic image slicing**, **A* Manhattan optimal hints**, and a clean **3-step cartoon game flow**.

---

## ✨ Features

- **Mobile-First Tap-To-Move**: Designed for 360px–430px smartphone viewports with automatic piece snapping.
- **Authentic 3D Jigsaw Pieces**: Mathematical tab-and-socket clipping with embossed 3D relief and smooth spring slide animations.
- **Uploaded Community Pictures**: Slices through user-uploaded social initiative and activity images, cartoon landscapes, and glossy jigsaw patterns.
- **Live On-Screen Reference Strip**: Real-time thumbnail of the un-scrambled target image with tap-to-zoom support.
- **Easy Mode Helpers**:
  - 🔢 **Tile Numbers (1 to 8)** on the top-left of each piece.
  - 👻 **Ghost Target Watermark** behind the board for visual alignment.
  - ✓ **Solved Spot Checkmarks** when pieces land in their correct position.
  - ✨ **Auto Step Assist** to automatically make the next best move.
  - 💡 **A* Search Solver** with unlimited hints.
- **3-Step Flow**:
  1. **Welcome & Setup**: Floating user avatar card, name input, and 3D Golden Continue button.
  2. **Complete the Puzzle**: Live timer, moves badge, sliced jigsaw board, and action controls.
  3. **Leaderboard & Victory**: 3D Golden Trophy with laurel wreath and dynamic player rankings.
- **Web Audio Engine**: Zero-latency procedural sound effects for tile slides, clicks, hint chimes, and victory fanfare.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Dev Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
```
The optimized bundle will be created in the `dist/` directory.

---

## 🛠️ Tech Stack
- **Framework**: React 18
- **Bundler / Dev Server**: Vite
- **Styling**: Vanilla CSS (CSS Variables, Grid, Glassmorphism, 3D Dropshadows)
- **Audio**: Web Audio API Synthesizer
- **Algorithms**: Parity solvability invariant checker + A* Manhattan Distance pathfinder

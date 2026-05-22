# 🎲 Tokyo95

> A pixel-perfect Windows 95 recreation of the classic dice bluffing game.

**[🚀 Play Tokyo95 Live](https://mattconfusion.github.io/tokyo95/)**

---

## 🖥️ Overview

**Tokyo95** is a browser-based, four-player dice bluffing game (inspired by Tokyo/Meyer/Mia) designed with a strict Windows 95 aesthetic. Face off against three distinct AI personalities—Clippy, Bob, and XERXES—on a green felt table where the only thing that matters is how well you can bluff.

## 🕹️ How to Play

1.  **The Goal:** Be the last player standing with hearts remaining. Every time a bluff is caught or an honest claim is wrongly challenged, someone loses a life.
2.  **Rolling:** On your turn, roll two secret dice.
3.  **Announcing:** You must announce a value higher than the previous player's claim. The game automatically selects your roll as the default claim, but you can adjust it to bluff!
4.  **Challenging:** Instead of rolling, you can challenge the previous player if you think they are lying.
5.  **The Ranking:**
    *   **21 (Tokyo):** The ultimate roll. If someone calls Tokyo, you **MUST** challenge (the Roll button will be disabled).
    *   **Pairs:** 66 > 55 > 44 > 33 > 22 > 11.
    *   **Numbers:** High combinations first (e.g., 65 > 64 > 54).

## ✨ Features

*   **Authentic Win95 UI:** Classic silver chrome, beveled borders, Tahoma typography, and a functional top-bar menu system.
*   **Persistent Round History:** 
    *   **Mini-Dice:** Opponents show their last claims directly under their names until the next turn cycle begins.
    *   **Table Sync:** The large dice on the table update to show your active claim after you announce, keeping your move visible.
*   **Immersive Audio:** Localized sound effects (`roll.wav`, `right.wav`, `wrong.wav`) that trigger only for your actions and critical match outcomes.
*   **Distinct AI Personalities:** 
    *   📎 **Clippy (Easy):** Random bluffs and unpredictable challenges.
    *   👨‍💼 **Bob (Medium):** Tracks claim deltas and challenges implausible high rolls.
    *   💀 **XERXES (Hard):** Calculates optimal probabilities for a near-perfect game.
*   **Advanced Game Logic:**
    *   **Round-Based Tracking:** The turn counter in the title bar tracks full rounds of play.
    *   **Turbo Mode:** The game accelerates significantly once you're out, allowing you to watch the AI finale quickly.
    *   **Enforced Rules:** Strict enforcement of the "Tokyo Rule" and single-click roll protection.
*   **PWA Ready:** Install it as a standalone app for full offline play. Features background update detection and high-resolution icons.

## 🛠️ Technical Details

*   **Frontend:** Vanilla HTML5, CSS3, and ES6 JavaScript (No frameworks).
*   **Stability:** Shift-free UI using `visibility: hidden` and fixed-dimension containers to prevent layout jitter.
*   **State Machine:** A robust, event-driven state machine in `game.js` that handles complex turn transitions and AI-vs-AI challenges without race conditions.
*   **PWA:** Service Worker with versioned caching and no-cache headers for instant updates.
*   **Persistence:** LocalStorage integration for tracking lifetime wins and games played.

## 🔗 Project Link

Developed by [MattConfusion](https://github.com/mattconfusion).

Check out the source code: [github.com/mattconfusion/tokyo95](https://github.com/mattconfusion/tokyo95)


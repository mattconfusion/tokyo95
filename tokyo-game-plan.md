# 🎲 TOKYO — Win95 Edition: Game Design Plan

> *A Windows 95–styled browser dice game. Four players, pixel art dice, green felt, pure bluff.*

---

## Concept & Aesthetic

A pixel-perfect Windows 95 recreation. MS Sans Serif / Tahoma fonts, the classic `#c0c0c0` silver UI chrome, beveled 3D borders (inset/outset), title bars with the blue gradient, and authentic "raised" panel feel of Win95 controls — think Minesweeper, FreeCell, Solitaire.

The **game surface** breaks from the chrome: the central play area is rendered as a **green solitaire tablecloth** (dark felt texture via CSS noise or SVG pattern), against which **pixel art dice** are displayed and animated.

---

## File Structure

```
tokyo-win95/
├── index.html          # Main shell, Win95 window chrome
├── style.css           # Win95 UI system + felt table + dice styles
├── game.js             # Core game logic (state machine, AI)
├── ui.js               # DOM rendering, animations, pixel dice
├── manifest.json       # PWA manifest
├── sw.js               # Service worker (offline / cache-first)
└── assets/
    ├── favicon.ico
    ├── dice.css        # Pixel art die face definitions (CSS sprite or inline SVG)
    └── sounds/         # Optional: click.wav, roll.wav, lose.wav
```

---

## Game Rules (Tokyo / Meyer / Mia)

| Situation | Rule |
|---|---|
| Each turn | Player rolls 2 dice secretly, then announces a value (truth or bluff) |
| Ranking | Pairs beat non-pairs. **21 = Tokyo** (highest). Non-pairs ranked by highest die then second (e.g. 65 > 54). Pairs: 11 < 22 < … < 66 |
| Next player | Must announce **higher** — or **challenge** the previous claim |
| Challenge (wrong) | Challenger loses **1 life** |
| Challenge (right) | Bluffer loses **1 life** |
| Tokyo called | If true: challenger loses **1 life**. If bluff was false: bluffer loses **1 life** |
| Lives | Each player starts with **3 lives** (shown as pixel heart icons ♥♥♥) |
| Win | Last player standing |

> **Note:** All failures cost exactly 1 life — no double-penalty scenarios.

---

## Game State Machine

```
STATES:
  IDLE → ROLLING → ANNOUNCING → WAITING_FOR_NEXT
       → CHALLENGING / PASSING
       → REVEAL → RESULT → NEXT_TURN → (loop)
       → GAME_OVER
```

**State object:**

```js
{
  players: [
    { name, lives, isHuman, avatar, isEliminated }
  ],                              // 4 players total
  currentPlayerIndex: int,
  previousClaim: {
    value: [d1, d2],
    playerIndex: int
  },
  diceValues: [d1, d2],          // known only to current player
  phase: 'rolling' | 'announcing' | 'challenging',
  roundLog: [],                  // scrollable message log
  gameOver: false,
  winner: null
}
```

---

## AI Opponent Logic

Three bots with distinct personalities and difficulty curves:

| Bot | Name | Avatar | Style |
|---|---|---|---|
| Easy | **Clippy** | 📎 | Bluffs randomly ~30%, challenges randomly ~25% |
| Medium | **Bob** | 👨‍💼 | Tracks claim delta, challenges when claim seems implausibly high |
| Hard | **XERXES** | 💀 | Near-optimal EV: calculates challenge probability, bluffs minimally |

**AI decision pseudocode:**

```js
function aiTurn(bot, previousClaim, ownRoll) {
  const ownRank = rankClaim(ownRoll);
  const prevRank = rankClaim(previousClaim);

  // Can beat the claim honestly?
  if (ownRank > prevRank) {
    return announce(ownRoll); // always truth if possible
  }

  // Must bluff or challenge
  const challengeProb = getChallengeThreshold(bot.difficulty, prevRank);
  if (Math.random() < challengeProb) {
    return challenge();
  }

  // Bluff: pick believable value just above previous claim
  return announce(plausibleBluff(prevRank, bot.difficulty));
}
```

---

## UI Layout

```
┌─────────────────────────────────────────────┐
│ 🎲 Tokyo  [_][□][X]                         │  ← Win95 title bar
├─────────────────────────────────────────────┤
│ [Game▼]  [Help▼]                            │  ← menu bar
├─────────────────────────────────────────────┤
│                                             │
│  ╔═══════════════════════════════════════╗  │
│  ║  📎 Clippy  ♥♥♥   👨 Bob  ♥♥○       ║  │
│  ║  💀 XERXES  ♥○○                      ║  │
│  ║                                       ║  │  ← green felt table
│  ║     ┌──────┐  ┌──────┐               ║  │
│  ║     │[DIE] │  │[DIE] │  ← pixel art  ║  │
│  ║     └──────┘  └──────┘               ║  │
│  ║                                       ║  │
│  ║  YOU  ♥♥♥                            ║  │
│  ║  [🎲 ROLL]  [ANNOUNCE ▲]  [CHALLENGE]║  │
│  ╚═══════════════════════════════════════╝  │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ > Bob claims: 43                    │   │  ← game log (inset panel)
│  │ > You rolled: 52. Announce 52?      │   │
│  │ > XERXES challenges Bob... honest!  │   │
│  │ > XERXES loses 1 life.              │   │
│  └─────────────────────────────────────┘   │
│                                             │
├─────────────────────────────────────────────┤
│ Your turn — previous claim: 43             │  ← status bar
└─────────────────────────────────────────────┘
```

---

## Pixel Art Dice

Dice are rendered as **CSS pixel art** — 8×8 or 16×16 grid using `box-shadow` dot technique or inline `<canvas>` sprites. Each face is a hand-crafted pixel layout in ivory/cream on a dark red die body.

**Roll animation:** class cycles through faces at 80ms intervals for ~600ms, then snaps to result. Human player sees their result; AI dice display as `??` until reveal.

**Die face CSS pattern:**

```css
.die {
  width: 32px;
  height: 32px;
  background: #f5e6c8;       /* parchment ivory */
  border: 3px solid #8b1a1a; /* dark red border */
  image-rendering: pixelated;
  /* pip positions via box-shadow */
}

.die-face-3::before {
  content: '';
  /* top-left, center, bottom-right pips via box-shadow clusters */
  box-shadow:
    4px 4px 0 3px #1a1a1a,
    13px 13px 0 3px #1a1a1a,
    22px 22px 0 3px #1a1a1a;
}
```

---

## Win95 CSS System

**Core classes:**

```css
/* Raised panel */
.win95-raised {
  border: 2px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
  box-shadow: 1px 1px 0 #dfdfdf inset, -1px -1px 0 #404040 inset;
  background: #c0c0c0;
}

/* Sunken inset (log, dice area) */
.win95-inset {
  border: 2px solid;
  border-color: #808080 #ffffff #ffffff #808080;
  box-shadow: -1px -1px 0 #404040 inset, 1px 1px 0 #dfdfdf inset;
  background: #000000; /* or felt green for table */
}

/* Title bar */
.win95-titlebar {
  background: linear-gradient(to right, #000080, #1084d0);
  color: #ffffff;
  font-family: 'Tahoma', 'MS Sans Serif', sans-serif;
  font-size: 11px;
  font-weight: bold;
}

/* Classic button */
.win95-button {
  font-family: 'Tahoma', 'MS Sans Serif', sans-serif;
  font-size: 11px;
  background: #c0c0c0;
  border: 2px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
  padding: 3px 10px;
  cursor: pointer;
}
.win95-button:active {
  border-color: #808080 #ffffff #ffffff #808080;
}
```

**Felt table surface:**

```css
.felt-table {
  background-color: #1a5c2a;
  background-image:
    repeating-linear-gradient(
      45deg,
      rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 1px,
      transparent 1px, transparent 6px
    );
  border: 4px solid #0d3317;
  box-shadow: inset 0 0 20px rgba(0,0,0,0.4);
}
```

---

## Win95 Dialogs

Modal dialogs (`.win95-dialog`) for:

| Dialog | Trigger |
|---|---|
| **New Game** | Game menu → New Game |
| **Challenge Reveal** | Drama: dice flip from `??` to real values |
| **Tokyo!** | When someone calls Tokyo — animated reveal |
| **You Win / You Lose** | Game over, with ✅ OK button |
| **Rules** | Help menu → How to Play |
| **About Tokyo** | Help menu → About; fake © 1995 Microsoft Corporation |

---

## PWA Setup

```json
// manifest.json
{
  "name": "Tokyo",
  "short_name": "Tokyo",
  "display": "standalone",
  "start_url": "/index.html",
  "background_color": "#008080",
  "theme_color": "#000080",
  "icons": [
    { "src": "assets/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "assets/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

`sw.js` uses **cache-first** strategy for all static assets, enabling full offline play.

---

## Announce UI (Human Player)

When the human rolls, they see their dice result and get:

- A **stepper control** (Win95 spinner widget) to select the claimed value — constrained to values higher than the previous claim.
- The **ANNOUNCE** button to confirm claim.
- The **CHALLENGE** button to challenge the previous player instead of rolling.
- A **TOKYO!** button that appears only when claiming the highest value (21).

---

## localStorage Persistence

```js
// Saved between sessions
{
  highScore: int,           // longest survival streak
  gamesPlayed: int,
  wins: int,
  soundEnabled: bool
}
```

---

## Stretch Goals

- [ ] Sound effects toggle in Game menu (`click.wav`, `roll.wav`, `tokyo.wav`)
- [ ] Animated pixel confetti on win
- [ ] Fake "Shuffling…" loading screen on startup (Win95 hourglass cursor)
- [ ] Keyboard shortcuts (R = roll, C = challenge, Enter = announce)
- [ ] Difficulty select dialog on New Game (Easy / Medium / Hard bot mix)

---

*© 1995 Microsoft Corporation. All rights reserved.*  
*Tokyo is a work of fiction. Any resemblance to actual dice games is entirely intentional.*

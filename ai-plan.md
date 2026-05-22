# 🎲 TOKYO — AI Personality Roster

> Ten opponents. One table. All bluff.

Each personality defines a **name**, **emoji avatar**, **behavioural archetype**, **bluff tendency**, **challenge threshold**, and **tell** — a subtle UI animation or log quirk that a sharp human player can learn to read.

---

## Personality Matrix

| # | Name | Avatar | Archetype | Bluff Rate | Challenge Rate | Difficulty |
|---|---|---|---|---|---|---|
| 1 | Clippy | 📎 | The Helper | 20% | 20% | ★☆☆☆☆ |
| 2 | Dot | 🔵 | The Child | 35% | 15% | ★☆☆☆☆ |
| 3 | Bob | 👨‍💼 | The Suit | 40% | 35% | ★★☆☆☆ |
| 4 | Vera | 🌹 | The Gambler | 55% | 45% | ★★☆☆☆ |
| 5 | Tanaka | 🀄 | The Strategist | 30% | 60% | ★★★☆☆ |
| 6 | Glitch | 📟 | The Erratic | 65% | 65% | ★★★☆☆ |
| 7 | Countess | 🎭 | The Bluffer | 80% | 25% | ★★★★☆ |
| 8 | Monk | 🪨 | The Patient | 15% | 70% | ★★★★☆ |
| 9 | XERXES | 💀 | The Machine | 18% | 78% | ★★★★★ |
| 10 | The Dealer | 🃏 | The Unknown | ??? | ??? | ★★★★★ |

---

## Full Profiles

---

### 1 — 📎 Clippy
**Archetype:** The Helper  
**Difficulty:** ★☆☆☆☆

> *"It looks like you're playing a dice game! Would you like help losing?"*

Clippy means well. He announces his roll honestly almost every time, bluffs only when he forgets he shouldn't, and challenges at random with cheerful incompetence. He is not a threat. He is a warm-up.

**Behaviour:**
- Announces honestly ~80% of the time regardless of roll quality
- Bluffs ~20% — always just one step above the previous claim, never bold
- Challenges ~20% — purely random, no pattern
- Never calls Tokyo even when holding 21; he gets confused by the special rule

**Tell:** Log messages always end with an exclamation mark and a helpful non-sequitur. *"Clippy announces 43! Did you know you can sort files by date modified?"*

---

### 2 — 🔵 Dot
**Archetype:** The Child  
**Difficulty:** ★☆☆☆☆

> *"My dad taught me this game. I always win at home."*

Dot is young, impulsive, and transparent. She bluffs boldly but obviously — always going too high, too fast. She challenges on gut feeling, usually wrong. Easy to read, impossible not to like.

**Behaviour:**
- Bluffs ~35% — tends to overclaim wildly (e.g. jumps from 43 to 65)
- Challenges ~15% — only when she "feels something's off"
- Will call Tokyo on any pair, not just 21 — she's misremembered the rules
- Occasionally passes twice in a row (AI hesitation simulated with a delay)

**Tell:** Dot's log messages are lowercase and slightly garbled. *"dot says 65... i think"* — the hesitation text appears 1.2s before the action resolves.

---

### 3 — 👨‍💼 Bob
**Archetype:** The Suit  
**Difficulty:** ★★☆☆☆

> *"I've run the numbers. Statistically, you're going to lose."*

Bob is mid-level management energy at a dice table. He plays it safe, tracks the delta between claims, and challenges when the jump feels too large. He is correct about 55% of the time. He will remind you of this.

**Behaviour:**
- Bluffs ~40% — only when forced; stays close to the previous claim (+1 or +2 ranks)
- Challenges ~35% — triggers when claim delta exceeds 4 rank positions
- Folds immediately when holding a strong roll rather than building pressure
- Announces in even numbers when possible (perceived as more authoritative)

**Tell:** Bob always pauses 800ms before challenging — you can almost hear him checking a spreadsheet.

---

### 4 — 🌹 Vera
**Archetype:** The Gambler  
**Difficulty:** ★★☆☆☆

> *"Darling, the bluff IS the game."*

Vera plays for the thrill, not the win. She bluffs often and challenges on instinct, riding hot streaks and cold ones with equal flair. Her variance is high — she can demolish a table or flame out in three rounds.

**Behaviour:**
- Bluffs ~55% — not strategic, just confident; tends to land on aesthetically "interesting" numbers (61, 54, 21)
- Challenges ~45% — follows a hot-hand fallacy: more likely to challenge after a win, less after a loss
- Has a 10% chance to call Tokyo bluff on any high claim (she loves the drama)
- If she wins a challenge, bluff rate increases by 10% for the rest of the game

**Tell:** Vera's log messages are elegant and unhurried. *"Vera smiles and announces 61."* The smile is load-bearing.

---

### 5 — 🀄 Tanaka
**Archetype:** The Strategist  
**Difficulty:** ★★★☆☆

> *"I am not watching the dice. I am watching you."*

Tanaka maintains a running model of each player's behaviour. He is the first AI to track bluff frequency per opponent and adjust challenge probability accordingly. Quiet. Methodical. Rarely surprised.

**Behaviour:**
- Bluffs ~30% — only when holding a poor roll AND the previous claim rank is low (room to hide)
- Challenges ~60% — weighted by opponent bluff history; challenges humans more aggressively as the game progresses
- Never calls Tokyo unless holding actual 21
- Folds to save a life if already at 1 life — pragmatic survival mode

**Tell:** No emotional language in logs. *"Tanaka: 54."* Pure signal, no noise. This itself becomes a tell — his messages get shorter when he's bluffing.

---

### 6 — 📟 Glitch
**Archetype:** The Erratic  
**Difficulty:** ★★★☆☆

> *"ERR_CLAIM_INVALID. Retrying. Retrying. 65."*

Glitch is a corrupted AI — his decision engine fires with high variance, making him paradoxically hard to model. He challenges and bluffs at rates that feel random but follow a hidden chaotic function (sine wave over game time). Medium difficulty not because he's smart, but because he's unreadable.

**Behaviour:**
- Bluff and challenge rates oscillate ~65% each, cycling every ~8 turns
- Occasionally "freezes" (1.5s delay) before acting — a UI tell with no gameplay meaning
- Has a 5% chance each turn to announce the same value as the previous player (bug state — penalises himself)
- Can call Tokyo at any time, apparently by accident

**Tell:** Log messages sometimes contain garbled text. *"Gl1tch ann0unces 4█."* The corrupted digit is always the second die.

---

### 7 — 🎭 Countess
**Archetype:** The Bluffer  
**Difficulty:** ★★★★☆

> *"Truth is so terribly inefficient."*

Countess bluffs more than anyone at the table — but she does it with surgical control. She never overclaims wildly; she lands just above the plausible maximum at each moment. Catching her requires patience and memory. She is counting on you having neither.

**Behaviour:**
- Bluffs ~80% — but always within ±2 rank positions of the "plausible ceiling" given remaining dice
- Challenges ~25% — almost never; she finds it beneath her. When she does, she's usually right
- Knows the statistical distribution of rolls and uses it to pick maximally credible bluffs
- When at 1 life: bluff rate drops to 40%, survival instinct kicks in

**Tell:** Countess uses a fixed announcement delay of exactly 400ms — whether truth or bluff. This precision is itself the tell: real players hesitate more on bluffs. She has eliminated that gap.

---

### 8 — 🪨 Monk
**Archetype:** The Patient  
**Difficulty:** ★★★★☆

> *"A lie is heaviest when carried longest."*

Monk almost never bluffs. He waits. He lets others eliminate each other, challenges only on high-confidence reads, and plays with a life expectancy that borders on unsettling. His low bluff rate means when he does bluff, nobody believes it's coming.

**Behaviour:**
- Bluffs ~15% — only when trapped with no legitimate move AND challenge odds are unfavourable
- Challenges ~70% — but only when claim rank exceeds what's statistically likely given the game state
- Will pass multiple rounds without being current player without logging anything (sits quietly)
- At 1 life: enters lockdown mode — challenges only at >80% confidence, never bluffs

**Tell:** Monk's log entries are proverbs. *"Monk accepts 43. Still water runs deep."* At 1 life: *"Monk considers. Says nothing."*

---

### 9 — 💀 XERXES
**Archetype:** The Machine  
**Difficulty:** ★★★★★

> *"Probability is not a suggestion."*

XERXES runs full expected-value calculation each turn. He tracks every claim, every challenge result, every life count, and factors opponent elimination order into his decisions. He bluffs rarely and precisely. He challenges when the math says so. He does not tilt, he does not guess, he does not forgive.

**Behaviour:**
- Bluffs ~18% — only when EV of bluffing exceeds EV of challenging, given current claim rank and player life states
- Challenges ~78% — threshold calculated dynamically: `challenge if P(bluff) > 0.52 + (own_lives * 0.04)`
- Adjusts Tokyo-call threshold based on remaining players (calls it sooner in 2-player endgames)
- Tracks the human player's bluff pattern and updates a running probability model per session

**Tell:** No tell. XERXES has none. This is the tell.

---

### 10 — 🃏 The Dealer
**Archetype:** The Unknown  
**Difficulty:** ★★★★★

> *"You don't know my name. You don't know my game."*

The Dealer is an unlockable final opponent — available only after winning three consecutive games. His behaviour switches archetype silently every round, cycling through a subset of the other nine personalities without announcement. He might be Clippy for a turn, then XERXES, then Countess. His avatar never changes. His log messages give nothing away.

**Behaviour:**
- Each turn, personality is sampled from the full roster (weighted toward harder archetypes)
- The active personality is never exposed to the player
- Log messages are stripped of personality tells — always third-person neutral: *"The Dealer announces 54."*
- Has a unique **"read"** mechanic: 15% chance each turn to correctly call out a human bluff mid-announcement, before the challenge phase (flavour text only, no gameplay effect)

**Tell:** The Dealer's die animation is 50ms slower than every other player. It means nothing. Or it does.

---

## Implementation Notes

### Personality State Object

```js
const personality = {
  id: 'countess',
  name: 'Countess',
  avatar: '🎭',
  bluffBaseRate: 0.80,
  challengeBaseRate: 0.25,
  difficulty: 4,
  // Modifiers
  bluffRateAtOneLive: 0.40,
  challengeRateAtOneLive: 0.25,
  usesOpponentHistory: false,
  // Cosmetic
  logStyle: 'elegant',         // 'plain' | 'elegant' | 'glitched' | 'terse' | 'proverb' | 'neutral'
  actionDelayMs: 400,
  // Special flags
  canMisruleTokyoCall: false,
  oscillatingRates: false,
  dynamicEV: false,
  shapeshifter: false,
};
```

### Log Style Examples

| Style | Example |
|---|---|
| `plain` | *"Bob announces 43."* |
| `elegant` | *"Vera smiles and announces 43."* |
| `glitched` | *"Gl1tch ann0unces 4█."* |
| `terse` | *"Tanaka: 43."* |
| `proverb` | *"Monk accepts 43. The tallest tree catches the most wind."* |
| `neutral` | *"The Dealer announces 43."* |
| `helpful` | *"Clippy announces 43! Great move!"* |
| `childlike` | *"dot says 43... maybe"* |

### Recommended Default Roster (3 opponents)

For a standard game, select three opponents to balance pacing:

| Mode | Roster |
|---|---|
| Tutorial | 📎 Clippy, 🔵 Dot, 👨‍💼 Bob |
| Standard | 👨‍💼 Bob, 🌹 Vera, 🀄 Tanaka |
| Hard | 🎭 Countess, 🪨 Monk, 💀 XERXES |
| Chaos | 📟 Glitch, 🌹 Vera, 🃏 The Dealer *(unlockable)* |

---

*The Dealer does not appear in the New Game dialog. He appears when he decides to.*

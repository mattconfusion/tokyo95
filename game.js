/**
 * game.js - Core Game Logic for Tokyo Win95
 */

const ALL_VALUES = [
    [2, 1], // Tokyo (21)
    [6, 6], [5, 5], [4, 4], [3, 3], [2, 2], [1, 1], // Pairs
    [6, 5], [6, 4], [6, 3], [6, 2], [6, 1],
    [5, 4], [5, 3], [5, 2], [5, 1],
    [4, 3], [4, 2], [4, 1],
    [3, 2], [3, 1]
];

function getRank(dice) {
    const sorted = [...dice].sort((a, b) => b - a);
    const d1 = sorted[0];
    const d2 = sorted[1];
    
    // Check for Tokyo
    if (d1 === 2 && d2 === 1) return 20; 
    
    // Check ALL_VALUES index
    for (let i = 0; i < ALL_VALUES.length; i++) {
        if (ALL_VALUES[i][0] === d1 && ALL_VALUES[i][1] === d2) {
            return ALL_VALUES.length - 1 - i;
        }
    }
    return -1;
}

function getValueFromRank(rank) {
    return ALL_VALUES[ALL_VALUES.length - 1 - rank];
}

class TokyoGame {
    constructor() {
        this.players = [
            { name: "Player", lives: 3, isHuman: true, avatar: "👤" },
            { name: "Clippy", lives: 3, isHuman: false, avatar: "📎", difficulty: "easy" },
            { name: "Bob", lives: 3, isHuman: false, avatar: "👨‍💼", difficulty: "medium" },
            { name: "XERXES", lives: 3, isHuman: false, avatar: "💀", difficulty: "hard" }
        ];
        this.currentPlayerIndex = 0;
        this.previousClaim = null; // { value: [d1, d2], playerIndex: int }
        this.currentRoll = null; // [d1, d2]
        this.phase = 'idle'; // idle, ai_thinking, rolling, announcing, reveal
        this.gameOver = false;
        this.winner = null;
        this.onStateChange = null;
        this.turnCounter = 1;
        this.lastChallengeResult = null;

        // Persistence
        this.stats = JSON.parse(localStorage.getItem('tokyo_stats')) || {
            wins: 0,
            gamesPlayed: 0
        };
    }

    saveStats() {
        localStorage.setItem('tokyo_stats', JSON.stringify(this.stats));
    }

    reset() {
        this.players.forEach(p => p.lives = 3);
        this.currentPlayerIndex = Math.floor(Math.random() * this.players.length);
        this.previousClaim = null;
        this.currentRoll = null;
        this.phase = 'idle';
        this.gameOver = false;
        this.winner = null;
        this.turnCounter = 1;
        this.stats.gamesPlayed++;
        this.saveStats();
        this.notify();
    }

    notify() {
        if (this.onStateChange) this.onStateChange(this);
    }

    startTurn() {
        if (this.gameOver) return;
        
        const currentPlayer = this.players[this.currentPlayerIndex];
        
        // Safety: ensure we skip dead players
        if (currentPlayer.lives <= 0) {
            this.nextPlayer();
            this.startTurn();
            return;
        }

        if (!currentPlayer.isHuman) {
            this.phase = 'ai_thinking';
            this.notify();
            this.aiDecision();
        } else {
            this.phase = 'rolling';
            this.notify();
        }
    }

    rollDice() {
        if (this.phase !== 'rolling' && this.phase !== 'ai_thinking') return;

        this.currentRoll = [
            Math.floor(Math.random() * 6) + 1,
            Math.floor(Math.random() * 6) + 1
        ].sort((a, b) => b - a);
        
        this.phase = 'announcing';
        this.notify();
    }

    announce(claimValue) {
        if (this.phase !== 'announcing') return;

        const claimRank = getRank(claimValue);
        const prevRank = this.previousClaim ? getRank(this.previousClaim.value) : -1;

        if (claimRank <= prevRank) {
            console.error("Invalid claim: must be higher than previous");
            return;
        }

        this.previousClaim = {
            value: claimValue,
            playerIndex: this.currentPlayerIndex
        };
        
        this.phase = 'idle';
        this.notify();

        // Small delay before next turn to let UI catch up
        // Speed up if human is out
        const delay = this.players[0].lives <= 0 ? 200 : 800;
        setTimeout(() => {
            if (!this.gameOver) {
                this.nextPlayer();
                this.startTurn();
            }
        }, delay);
    }

    challenge() {
        if (this.phase !== 'rolling' && this.phase !== 'ai_thinking') return;
        if (!this.previousClaim) return;

        this.phase = 'reveal';
        this.notify();

        const actualRank = getRank(this.currentRoll);
        const claimedRank = getRank(this.previousClaim.value);
        
        const blufferIndex = this.previousClaim.playerIndex;
        const challengerIndex = this.currentPlayerIndex;
        
        let loserIndex;
        if (actualRank >= claimedRank) {
            loserIndex = challengerIndex;
        } else {
            loserIndex = blufferIndex;
        }

        this.players[loserIndex].lives--;
        
        this.lastChallengeResult = {
            loserIndex: loserIndex,
            blufferIndex: blufferIndex,
            challengerIndex: challengerIndex
        };
        
        if (this.players[loserIndex].lives <= 0) {
            const alivePlayers = this.players.filter(p => p.lives > 0);
            if (alivePlayers.length === 1) {
                this.gameOver = true;
                this.winner = alivePlayers[0];
                if (this.winner.isHuman) {
                    this.stats.wins++;
                    this.saveStats();
                }
            }
        }

        // Reset for next round
        this.previousClaim = null;
        this.currentRoll = null;
        
        // The loser starts the next round if alive, otherwise next alive player
        this.currentPlayerIndex = loserIndex;
        if (this.players[this.currentPlayerIndex].lives <= 0) {
            this.nextPlayer();
        }
        
        // Wait for reveal animation before starting new turn
        // Speed up if human is out
        const delay = this.players[0].lives <= 0 ? 500 : 2000;
        setTimeout(() => {
            this.notify();
            if (!this.gameOver) {
                this.startTurn();
            }
        }, delay);
    }

    nextPlayer() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        // Skip eliminated players
        while (this.players[this.currentPlayerIndex].lives <= 0) {
            this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        }
        
        // A turn (round) is complete when it comes back to the human player (index 0)
        // or if player 0 is out, when it cycles back to the first alive player.
        // For simplicity: increment when current player is 0.
        if (this.currentPlayerIndex === 0) {
            this.turnCounter++;
        }
    }

    aiDecision() {
        const bot = this.players[this.currentPlayerIndex];
        const prevRank = this.previousClaim ? getRank(this.previousClaim.value) : -1;
        const isHumanOut = this.players[0].lives <= 0;

        // Decision Time
        const decisionDelay = isHumanOut ? 200 : 1000;
        setTimeout(() => {
            if (this.gameOver) return;

            // 1. Consider Challenge
            // If someone claimed Tokyo (20), we MUST challenge if we can't tie it (and ties aren't allowed in claims)
            if (this.previousClaim) {
                let challengeProb = 0;
                if (prevRank >= 20) {
                    challengeProb = 1.0; // Must challenge Tokyo
                } else if (bot.difficulty === 'easy') {
                    challengeProb = 0.2;
                } else if (bot.difficulty === 'medium') {
                    challengeProb = (prevRank / 20) * 0.5;
                } else if (bot.difficulty === 'hard') {
                    challengeProb = (prevRank / 20) * 0.7;
                }

                if (Math.random() < challengeProb) {
                    this.challenge();
                    return;
                }
            }

            // 2. Roll
            this.rollDice();
            
            // 3. Announce
            const announceDelay = isHumanOut ? 200 : 1000;
            setTimeout(() => {
                if (this.gameOver) return;
                
                const ownRank = getRank(this.currentRoll);
                let claim;
                
                // AI must ALWAYS announce something > prevRank
                if (ownRank > prevRank) {
                    // Tell truth
                    claim = this.currentRoll;
                } else {
                    // Bluff: next logical rank
                    let targetRank = prevRank + 1;
                    
                    // Easy bots might bluff higher than necessary
                    if (bot.difficulty === 'easy' && Math.random() < 0.3) {
                        targetRank += Math.floor(Math.random() * 2);
                    }
                    
                    // Cap at Tokyo (20)
                    if (targetRank > 20) targetRank = 20;
                    
                    claim = getValueFromRank(targetRank);
                }

                // Final safety check: if for some reason we still didn't get a higher rank, 
                // fallback to a challenge if possible, or just force Tokyo
                const finalRank = getRank(claim);
                if (finalRank <= prevRank) {
                    if (prevRank < 20) {
                        claim = getValueFromRank(prevRank + 1);
                    } else {
                        // This should have been caught by the "challenge Tokyo" logic above
                        this.challenge();
                        return;
                    }
                }

                this.announce(claim);
            }, announceDelay);

        }, decisionDelay);
    }
}

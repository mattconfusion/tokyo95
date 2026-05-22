/**
 * ui.js - UI Rendering and Interactions for Tokyo Win95
 */

document.addEventListener('DOMContentLoaded', () => {
    const game = new TokyoGame();
    
    // DOM Elements
    const diceEls = [
        document.getElementById('die-1'),
        document.getElementById('die-2')
    ];
    const playerPanels = [
        document.getElementById('player-1'), // Clippy
        document.getElementById('player-2'), // Bob
        document.getElementById('player-3'), // XERXES
        document.querySelector('.user-panel') // YOU
    ];
    // Map game player index to DOM panels
    // Players: 0=YOU, 1=Clippy, 2=Bob, 3=XERXES
    const playerMap = [3, 0, 1, 2]; 

    const btnRoll = document.getElementById('btn-roll');
    const btnAnnounce = document.getElementById('btn-announce');
    const btnChallenge = document.getElementById('btn-challenge');
    const claimInput = document.getElementById('claim-input');
    const btnStepperUp = document.querySelector('.stepper-up');
    const btnStepperDown = document.querySelector('.stepper-down');
    const gameLog = document.getElementById('game-log');
    const statusText = document.getElementById('status-text');
    const userLivesEl = document.getElementById('user-lives');
    
    const menuNewGame = document.getElementById('menu-new-game');
    const menuRules = document.getElementById('menu-rules');
    const rulesDialog = document.getElementById('rules-dialog');
    const menuAbout = document.getElementById('menu-about');
    const modalOverlay = document.getElementById('modal-overlay');
    const aboutDialog = document.getElementById('about-dialog');
    const closeModalBtns = document.querySelectorAll('.close-modal');

    const desktopIcon = document.querySelector('.desktop-icon');
    desktopIcon.addEventListener('click', () => {
        desktopIcon.classList.toggle('selected');
    });

    const windowTitle = document.getElementById('window-title');
    const gameOverDialog = document.getElementById('game-over-dialog');
    const gameOverMessage = document.getElementById('game-over-message');
    const winDialog = document.getElementById('win-dialog');

    // Modal Helpers
    const allDialogs = [rulesDialog, aboutDialog, gameOverDialog, winDialog];
    
    function hideAllDialogs() {
        modalOverlay.classList.add('hidden');
        allDialogs.forEach(d => {
            if (d) d.classList.add('hidden');
        });
    }

    function showDialog(dialog) {
        hideAllDialogs();
        modalOverlay.classList.remove('hidden');
        if (dialog) dialog.classList.remove('hidden');
    }

    // Sounds
    const sounds = {
        roll: new Audio('assets/roll.wav'),
        wrong: new Audio('assets/wrong.wav'),
        right: new Audio('assets/right.wav')
    };

    function playSound(name) {
        if (sounds[name]) {
            sounds[name].currentTime = 0;
            sounds[name].play().catch(e => console.log("Sound play failed", e));
        }
    }

    // Keep track of the last claims and rolls for display persistence
    let lastHumanRoll = null;
    let lastHumanClaim = null;
    let lastAIClaims = [null, null, null, null]; // Index matches game.players

    // Initialize UI
    function updateUI(state) {
        // Update Title Bar
        windowTitle.textContent = `🎲 Tokyo95 - Turn ${state.turnCounter}`;

        // Update Players
        state.players.forEach((p, i) => {
            const panel = playerPanels[playerMap[i]];
            if (panel) {
                const livesEl = panel.querySelector('.lives');
                if (livesEl) {
                    livesEl.textContent = '♥'.repeat(Math.max(0, p.lives)) + '○'.repeat(Math.max(0, 3 - p.lives));
                }
                
                if (state.currentPlayerIndex === i && !state.gameOver) {
                    panel.classList.add('active');
                } else {
                    panel.classList.remove('active');
                }

                if (p.lives <= 0) {
                    panel.style.opacity = '0.5';
                } else {
                    panel.style.opacity = '1';
                }

                // Update Mini Dice for AI
                if (!p.isHuman) {
                    const miniDice = panel.querySelectorAll('.mini-die');
                    
                    // Update the cached claim if this AI just announced
                    if (state.previousClaim && state.previousClaim.playerIndex === i) {
                        lastAIClaims[i] = state.previousClaim.value;
                    }

                    // Show the cached claim, but hide it when it's currently their turn again (new round for them)
                    if (lastAIClaims[i] && state.currentPlayerIndex !== i) {
                        lastAIClaims[i].forEach((val, idx) => {
                            miniDice[idx].className = `die mini-die die-${val}`;
                        });
                    } else {
                        // Clear cache when their turn starts
                        if (state.currentPlayerIndex === i) lastAIClaims[i] = null;
                        miniDice.forEach(die => die.className = 'die mini-die invisible');
                    }
                }
            }
        });

        // Update User Lives specially
        userLivesEl.textContent = '♥'.repeat(Math.max(0, state.players[0].lives)) + '○'.repeat(Math.max(0, 3 - state.players[0].lives));

        // Update Dice (Big dice used only for human player)
        const isHumanTurn = state.players[state.currentPlayerIndex].isHuman;
        
        // When human announces, update the table with the claim
        if (isHumanTurn && state.previousClaim && state.previousClaim.playerIndex === 0) {
            lastHumanClaim = state.previousClaim.value;
        }

        // Display logic for human dice:
        // 1. If human just announced, show the claim.
        // 2. If it's a reveal phase, show the actual roll (ONLY if human is involved in the challenge).
        // 3. Otherwise show cached human roll, until new turn.
        
        let diceToDisplay = null;

        if (state.phase === 'reveal' && state.currentRoll) {
            // Only show big dice reveal if the human is the bluffer or the challenger
            const isHumanInvolved = state.previousClaim && (state.previousClaim.playerIndex === 0 || state.currentPlayerIndex === 0);
            if (isHumanInvolved) {
                diceToDisplay = state.currentRoll;
            }
        } else if (lastHumanClaim && !isHumanTurn) {
             // If AI is playing, show what human announced
            diceToDisplay = lastHumanClaim;
        } else if (state.phase === 'announcing' && isHumanTurn && state.currentRoll) {
            // While announcing, show your secret roll
            diceToDisplay = state.currentRoll;
        } else if (lastHumanRoll && (isHumanTurn ? (state.phase !== 'rolling' && state.phase !== 'ai_thinking') : true)) {
            // Catch-all for persistence of human's own actions
            diceToDisplay = lastHumanRoll;
        }

        if (diceToDisplay) {
            diceToDisplay.forEach((val, i) => {
                diceEls[i].className = `die die-${val}`;
            });
        } else {
            // Clear cache when their turn starts (rolling phase)
            if (isHumanTurn && state.phase === 'rolling') {
                lastHumanRoll = null;
                lastHumanClaim = null;
            }
            diceEls.forEach(el => {
                el.className = 'die hidden';
            });
        }

        // Cache human roll when they roll
        if (isHumanTurn && state.currentRoll && state.phase === 'announcing') {
            lastHumanRoll = state.currentRoll;
        }

        // Update Buttons
        const canRoll = isHumanTurn && state.phase === 'rolling' && !state.gameOver;
        const canChallenge = isHumanTurn && state.phase === 'rolling' && state.previousClaim && !state.gameOver;
        const canAnnounce = isHumanTurn && state.phase === 'announcing' && !state.gameOver;

        btnRoll.disabled = !canRoll;
        btnChallenge.disabled = !canChallenge;
        btnAnnounce.disabled = !canAnnounce;

        // Update Stepper
        if (state.phase === 'announcing' && isHumanTurn) {
            const prevRank = state.previousClaim ? getRank(state.previousClaim.value) : -1;
            const ownRank = getRank(state.currentRoll);
            
            // Auto-select: if own roll is valid, pick it. Otherwise pick minimum valid claim.
            if (ownRank > prevRank) {
                currentClaimRank = ownRank;
            } else {
                currentClaimRank = prevRank + 1;
            }
            
            if (currentClaimRank > 20) currentClaimRank = 20;
            updateClaimInput();
        }

        // Update Status
        if (state.gameOver) {
            statusText.textContent = `Game Over! ${state.winner.name} wins!`;
            // Trigger Modals
            if (state.winner.isHuman) {
                showDialog(winDialog);
            } else {
                if (state.players[0].lives <= 0) {
                    gameOverMessage.textContent = `You have lost all your lives. ${state.winner.name} has won the match.`;
                } else {
                    gameOverMessage.textContent = `${state.winner.name} has won the match. Better luck next time!`;
                }
                showDialog(gameOverDialog);
            }
        } else {
            const currentP = state.players[state.currentPlayerIndex];
            const prevClaimStr = state.previousClaim ? 
                `${state.previousClaim.value[0]}${state.previousClaim.value[1]}` : "None";
            
            if (state.phase === 'ai_thinking') {
                statusText.textContent = `${currentP.name} is thinking...`;
            } else {
                statusText.textContent = `${currentP.name}'s turn — Previous claim: ${prevClaimStr}`;
            }
        }
    }

    function log(msg) {
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.textContent = `> ${msg}`;
        gameLog.appendChild(entry);
        gameLog.scrollTop = gameLog.scrollHeight;
    }

    function updateClaimInput() {
        const val = getValueFromRank(currentClaimRank);
        claimInput.value = `${val[0]}${val[1]}`;
    }

    // Event Listeners
    btnRoll.addEventListener('click', () => {
        if (game.phase !== 'rolling') return;
        playSound('roll');
        log("You roll the dice...");
        animateDice(() => {
            game.rollDice();
        });
    });

    btnAnnounce.addEventListener('click', () => {
        if (game.phase !== 'announcing') return;
        const val = getValueFromRank(currentClaimRank);
        log(`You announce: ${val[0]}${val[1]}`);
        game.announce(val);
    });

    btnChallenge.addEventListener('click', () => {
        if (game.phase !== 'rolling') return;
        log("You CHALLENGE!");
        game.challenge();
    });

    btnStepperUp.addEventListener('click', () => {
        if (currentClaimRank < 20) {
            currentClaimRank++;
            updateClaimInput();
        }
    });

    btnStepperDown.addEventListener('click', () => {
        const prevRank = game.previousClaim ? getRank(game.previousClaim.value) : -1;
        if (currentClaimRank > prevRank + 1) {
            currentClaimRank--;
            updateClaimInput();
        }
    });

    menuNewGame.addEventListener('click', () => {
        gameLog.innerHTML = '';
        log("Starting new game...");
        game.reset();
        game.startTurn();
    });

    const menuExit = document.getElementById('menu-exit');

    menuExit.addEventListener('click', () => {
        log("Closing application...");
        statusText.textContent = "Redirecting to GitHub in 3 seconds...";
        document.querySelector('.window-content').style.opacity = '0.3';
        document.querySelector('.window-content').style.pointerEvents = 'none';
        
        setTimeout(() => {
            window.location.href = 'https://github.com/mattconfusion';
        }, 3000);
    });

    menuRules.addEventListener('click', () => {
        showDialog(rulesDialog);
    });

    menuAbout.addEventListener('click', () => {
        showDialog(aboutDialog);
    });

    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            hideAllDialogs();
        });
    });

    function animateDice(callback) {
        let count = 0;
        const interval = setInterval(() => {
            diceEls.forEach(el => {
                const randomVal = Math.floor(Math.random() * 6) + 1;
                el.className = `die die-${randomVal}`;
            });
            count++;
            if (count > 8) {
                clearInterval(interval);
                callback();
            }
        }, 80);
    }

    // Game Logic Hooks
    game.onStateChange = (state) => {
        updateUI(state);
    };

    // Explicitly handle logging for AI events via method wrapping
    const originalAnnounce = game.announce.bind(game);
    game.announce = (val) => {
        if (!game.players[game.currentPlayerIndex].isHuman) {
            log(`${game.players[game.currentPlayerIndex].name} announces: ${val[0]}${val[1]}`);
        }
        originalAnnounce(val);
    };

    const originalChallenge = game.challenge.bind(game);
    game.challenge = () => {
        if (!game.players[game.currentPlayerIndex].isHuman) {
            log(`${game.players[game.currentPlayerIndex].name} CHALLENGES!`);
        }
        originalChallenge();

        // Sound logic for challenge
        if (!game.gameOver) { // If game over, priority goes to game over sound
            const res = game.lastChallengeResult;
            if (res) {
                const isHumanInvolved = res.blufferIndex === 0 || res.challengerIndex === 0;
                if (isHumanInvolved) {
                    if (res.loserIndex === 0) playSound('wrong');
                    else playSound('right');
                }
            }
        }
    };

    const originalRollDice = game.rollDice.bind(game);
    game.rollDice = () => {
        if (!game.players[game.currentPlayerIndex].isHuman) {
            log(`${game.players[game.currentPlayerIndex].name} rolls...`);
        }
        originalRollDice();
    };

    const originalGameOver = Object.getOwnPropertyDescriptor(game, 'gameOver');
    // We can't easily wrap the property, so we'll just check it in updateUI
    
    // Check for game over specifically to log winner
    const oldNotify = game.notify.bind(game);
    game.notify = () => {
        if (game.gameOver && game.winner) {
            log(`*** ${game.winner.name} wins the game! ***`);
            if (game.winner.isHuman) playSound('right');
            else playSound('wrong');
        }
        oldNotify();
    };

    // Initialize
    updateUI(game);
    game.startTurn();

    // Register Service Worker with update logic
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js').then(registration => {
                console.log('SW Registered');

                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            log("A new version is available. Please refresh the page.");
                            statusText.textContent = "New version available! Refresh to update.";
                        }
                    });
                });
            }).catch(err => {
                console.error('SW Registration Failed', err);
            });
        });

        // Handle controller change (reload on new SW)
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!refreshing) {
                refreshing = true;
                // Optional: window.location.reload(); 
                // We'll let the user decide or just log it for now to avoid interrupting a game
            }
        });
    }
});

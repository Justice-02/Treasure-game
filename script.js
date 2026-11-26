“use strict”;
/* ==========================================
DIGITAL TREASURE HUNT
MAIN JAVASCRIPT GAME ENGINE
========================================== */
// GET HTML ELEMENTS
const welcomeScreen = document.getElementById(“welcome-screen”);
const gameScreen = document.getElementById(“game-screen”);
const finalScreen = document.getElementById(“final-screen”);
const startButton = document.getElementById(“start-button”);
const nextButton = document.getElementById(“next-button”);
const restartButton = document.getElementById(“restart-button”);
const gameContent = document.getElementById(“game-content”);
const levelTitle = document.getElementById(“level-title”);
const challengeDescription = document.getElementById(“challenge-description”);
const instructions = document.getElementById(“instructions”);
const scoreDisplay = document.getElementById(“score”);
const progressBar = document.getElementById(“progress-bar”);
const feedback = document.getElementById(“feedback”);
const finalScore = document.getElementById(“final-score”);
// GAME VARIABLES
let currentLevel = 0;
let score = 0;
let challengeCompleted = false;
let soundEnabled = true;
// SOUND EFFECTS
let audioContext;
function playSound(frequency = 600, duration = 0.15) {
if (!soundEnabled) return;

try {

    audioContext = audioContext ||
        new (window.AudioContext || window.webkitAudioContext)();

    if (audioContext.state === "suspended") {
        audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();
    const volume = audioContext.createGain();

    oscillator.connect(volume);
    volume.connect(audioContext.destination);

    oscillator.frequency.value = frequency;

    volume.gain.setValueAtTime(
        0.12,
        audioContext.currentTime
    );

    volume.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + duration
    );

    oscillator.start();

    oscillator.stop(
        audioContext.currentTime + duration
    );

} catch (error) {

    console.log("Sound is unavailable.");

}
}
// SIX TREASURE HUNT CHALLENGES
const challenges = [
// ======================================
// LEVEL 1: MOUSE MOVEMENT
// ======================================

{
    title: "LEVEL 1: FIND THE HIDDEN TREASURE",

    description:
        "A treasure chest is hidden on the mysterious island.",

    instruction:
        "Move your mouse pointer onto the treasure chest. Do not click it.",

    render() {

        gameContent.innerHTML = `

            <h2>🏝️ Explore the Island</h2>

            <p>Find the hidden treasure chest!</p>

            <div style="
                display:flex;
                justify-content:space-around;
                align-items:center;
                width:100%;
                min-height:150px;
                flex-wrap:wrap;
            ">

                <span class="treasure-object">🌴</span>

                <span class="treasure-object">🌊</span>

                <button
                    class="treasure-object"
                    id="movement-target"
                    aria-label="Hidden treasure chest"
                    style="border:0;background:transparent;"
                >
                    🧰
                </button>

                <span class="treasure-object">🪨</span>

            </div>

        `;

        const target = document.getElementById("movement-target");

        target.addEventListener("mouseenter", () => {

            completeChallenge(
                "Excellent! You successfully moved the mouse pointer onto the treasure chest."
            );

        });

    }
},


// ======================================
// LEVEL 2: SINGLE CLICK
// ======================================

{
    title: "LEVEL 2: COLLECT THE GOLD COINS",

    description:
        "Gold coins are scattered across the island.",

    instruction:
        "Click the gold coin ONCE using the left mouse button.",

    render() {

        gameContent.innerHTML = `

            <h2>🪙 Collect Your Treasure</h2>

            <p>Click the gold coin to collect it.</p><button
                id="single-click-target"
                class="treasure-object"
                style="border:0;background:transparent;"
                aria-label="Gold coin"
            >
                🪙
            </button>

        `;

        const target = document.getElementById("single-click-target");

        target.addEventListener("click", () => {

            completeChallenge(
                "Wonderful! You collected the coin using a single-click."
            );

        });

    }
},


// ======================================
// LEVEL 3: DOUBLE CLICK
// ======================================

{
    title: "LEVEL 3: UNLOCK THE TREASURE CHEST",

    description:
        "A locked treasure chest contains a valuable diamond.",

    instruction:
        "Double-click the lock quickly using the left mouse button.",

    render() {

        gameContent.innerHTML = `

            <h2>🔐 Unlock the Chest</h2>

            <p>Double-click the lock to open the treasure.</p>

            <button
                id="double-click-target"
                class="treasure-object"
                style="border:0;background:transparent;"
                aria-label="Locked treasure chest"
            >
                🔒
            </button>

        `;

        const target = document.getElementById("double-click-target");

        target.addEventListener("dblclick", () => {

            target.textContent = "🎁";

            completeChallenge(
                "Amazing! You unlocked the chest using a double-click."
            );

        });

    }
},


// ======================================
// LEVEL 4: RIGHT CLICK
// ======================================

{
    title: "LEVEL 4: DISCOVER THE SECRET MAP",

    description:
        "A secret message is hidden inside an ancient map.",

    instruction:
        "Right-click the map using the right mouse button.",

    render() {

        gameContent.innerHTML = `

            <h2>🗺️ Discover the Secret</h2>

            <p>Right-click the ancient map.</p>

            <button
                id="right-click-target"
                class="treasure-object"
                style="border:0;background:transparent;"
                aria-label="Secret map"
            >
                🗺️
            </button>

            <p id="secret-message"></p>

        `;

        const target = document.getElementById("right-click-target");

        target.addEventListener("contextmenu", event => {

            event.preventDefault();

            document.getElementById("secret-message").textContent =
                "🎉 Secret clue discovered!";

            completeChallenge(
                "Excellent! You discovered the clue using a right-click."
            );

        });

    }
},


// ======================================
// LEVEL 5: DRAG AND DROP
// ======================================

{
    title: "LEVEL 5: MOVE THE DIAMOND",

    description:
        "A precious diamond must be moved into the treasure box.",

    instruction:
        "Press and hold the diamond, move it into the green treasure box and release the mouse button.",

    render() {

        gameContent.innerHTML = `

            <h2>💎 Move the Precious Diamond</h2>

            <p>Drag the diamond into the green box.</p>

            <div style="
                display:flex;
                justify-content:space-around;
                align-items:center;
                gap:20px;
                flex-wrap:wrap;
                width:100%;
                padding:20px;
            ">

                <div
                    id="diamond"
                    class="treasure-object"
                    draggable="true"
                    aria-label="Diamond to drag"
                >
                    💎
                </div>

                <div
                    id="treasure-box"
                    class="drop-zone"
                >
                    Drop Diamond Here
                </div>

            </div>

        `;

        const diamond = document.getElementById("diamond");
        const treasureBox = document.getElementById("treasure-box");

        diamond.addEventListener("dragstart", event => {

            event.dataTransfer.setData("text/plain", "diamond");

            event.dataTransfer.effectAllowed = "move";

        });

        treasureBox.addEventListener("dragover", event => {

            event.preventDefault();

            treasureBox.style.background = "#bbf7d0";

        });

        treasureBox.addEventListener("dragleave", () => {

            treasureBox.style.background = "#dcfce7";

        });

        treasureBox.addEventListener("drop", event => {

            event.preventDefault();

            const item = event.dataTransfer.getData("text/plain");

            if (item === "diamond") {

                diamond.remove();

                treasureBox.innerHTML = "💎 Diamond Secured!";

                completeChallenge(
                    "Fantastic! You successfully dragged and dropped the diamond."
                );

            }

        });

    }
},


// ======================================
// LEVEL 6: SCROLLING
// ======================================

{
    title: "LEVEL 6: FIND THE FINAL TREASURE",

    description:
        "The final treasure is hidden at the bottom of a long list.",

    instruction:
        "Scroll down inside the treasure list until you discover the final treasure.",

    render() {

        let clues = "";

        const clueNames = [
            "A palm tree",
            "A blue shell",
            "A wooden bridge",
            "A red flag",
            "A small island",
            "A silver key",
            "A fishing boat",
            "A mysterious cave",
            "An ancient treasure map",
            "The final treasure"
        ];

        clueNames.forEach((clue, index) => {

            clues += `

                <div class="scroll-item">

                    <h3>Clue ${index + 1}</h3>

                    <p>${clue} 🔎</p>

                </div>

            `;

        });

        gameContent.innerHTML = `

            <h2>🔎 Search for the Final Treasure</h2>

            <p>Keep scrolling to discover the final clue.</p>

            <div
                id="treasure-scroll-area"
                class="scroll-area"
                tabindex="0"
            >

                ${clues}

                <div style="
                    padding:25px;
                    text-align:center;
                    background:#fef3c7;
                    color:#92400e;
                ">

                    <h2>🏆 FINAL TREASURE FOUND!</h2>

                </div>

            </div>

        `;

        const scrollArea =
            document.getElementById("treasure-scroll-area");

        scrollArea.addEventListener("scroll", () => {

            const reachedBottom =
                scrollArea.scrollTop + scrollArea.clientHeight >=
                scrollArea.scrollHeight - 5;

            if (reachedBottom) {

                completeChallenge(
                    "Congratulations! You found the final treasure by scrolling."
                );

            }

        });

    }
}
];
// ==========================================
// COMPLETE A CHALLENGE
// ==========================================
function completeChallenge(message) {
if (challengeCompleted) return;

challengeCompleted = true;

score += 10;

scoreDisplay.textContent = score;

progressBar.style.width =
    ((currentLevel + 1) / challenges.length * 100) + "%";

feedback.textContent = "✅ " + message;

feedback.style.color = "#facc15";

nextButton.classList.remove("hidden");

playSound(750, 0.25);
}
// ==========================================
// LOAD A LEVEL
// ==========================================
function loadLevel() {
challengeCompleted = false;

const challenge = challenges[currentLevel];

levelTitle.textContent = challenge.title;

challengeDescription.textContent =
    challenge.description;

instructions.textContent =
    challenge.instruction;

feedback.textContent = "";

nextButton.classList.add("hidden");gameContent.innerHTML = "";

challenge.render();
}
// ==========================================
// START THE GAME
// ==========================================
startButton.addEventListener(“click”, () => {
welcomeScreen.classList.add("hidden");

finalScreen.classList.add("hidden");

gameScreen.classList.remove("hidden");

currentLevel = 0;

score = 0;

scoreDisplay.textContent = score;

progressBar.style.width = "0%";

playSound(500, 0.2);

loadLevel();
});
// ==========================================
// MOVE TO THE NEXT LEVEL
// ==========================================
nextButton.addEventListener(“click”, () => {
if (!challengeCompleted) return;

currentLevel++;

if (currentLevel < challenges.length) {

    loadLevel();

} else {

    finishGame();

}
});
// ==========================================
// FINISH THE GAME
// ==========================================
function finishGame() {
gameScreen.classList.add("hidden");

finalScreen.classList.remove("hidden");

finalScore.textContent =
    `Your Score: ${score}/60`;

playSound(900, 0.5);
}
// ==========================================
// RESTART THE GAME
// ==========================================
restartButton.addEventListener(“click”, () => {
currentLevel = 0;

score = 0;

scoreDisplay.textContent = "0";

progressBar.style.width = "0%";

finalScreen.classList.add("hidden");

gameScreen.classList.remove("hidden");

loadLevel();
});
// ==========================================
// GAME INITIALIZATION
// ==========================================
console.log(“Digital Treasure Hunt is ready!”);
console.log(“Six mouse-operation challenges loaded.”);

const diceArr = [];

let currentPlayer = 1;
let players = {
    1: {
        currentScore: 0,
        totalScore: 0
    },
    2: {
        currentScore: 0,
        totalScore: 0
    }
};

const switchPlayer = () => {
    currentPlayer = (currentPlayer === 1) ? 2 : 1;
    resetDiceSelection();
    alert("Player " + currentPlayer + "'s turn!");
    updateScoreDisplays();
};

const updateScoreDisplays = () => {
    document.querySelector('.score').textContent = players[currentPlayer].currentScore;
    document.getElementById('total-score-' + currentPlayer).textContent = players[currentPlayer].totalScore;
    document.getElementById('current-player').textContent = "Player " + currentPlayer;
};

const initializeDice = () => {
	for (let i = 0; i < 6; i++) {
		diceArr[i] = {};
		diceArr[i].id = "die" + (i + 1);
		diceArr[i].value = i + 1;
		diceArr[i].clicked = 0;
	};
};

const canRoll = () => {
    const selectedDice = diceArr.filter(die => die.clicked === 1).map(die => die.value);

    if (!selectedDice.length || computeScore(selectedDice) === 0) {
        alert('You need to select some scoring dice before rerolling!');
        return false;
    };

    return true;
};

const checkFarkle = (diceValues) => computeScore(diceValues) === 0;

/*Rolling dice values*/
const rollDice = () => {
    if (players[currentPlayer].currentScore > 0 && !canRoll()) return;

	for (let i = 0; i < 6; i++) {
		if (diceArr[i].clicked === 0) {
			diceArr[i].value = Math.floor((Math.random() * 6) + 1);
		};
	};

	updateDiceImg();

    let diceValues = diceArr.filter(die => die.clicked === 0).map(die => die.value);
    if (checkFarkle(diceValues)) {
        players[currentPlayer].currentScore = 0;
        switchPlayer();

        alert('Farkle! You rolled: ' + diceValues.join(', ') + '. You scored no points this turn.');

        resetDiceSelection();
    } else {
        players[currentPlayer].currentScore += computeScore(diceValues);
        updateScoreDisplays();
    };
};

/*Updating images of dice given values of rollDice*/
const updateDiceImg = () => {
	let diceImage;
	for (let i = 0; i < 6; i++) {
        diceImage = "images/" + diceArr[i].value + ".png";
		document.getElementById(diceArr[i].id).setAttribute("src", diceImage);
	};
};

const resetDiceSelection = () => {
    diceArr.forEach(die => die.clicked = 0);
    let diceImages = document.querySelectorAll(".dice img");
    diceImages.forEach(img => img.classList.remove("transparent"));

    players[currentPlayer].currentScore = 0;
    updateScoreDisplays();
};

const resetGame = () => {
    players[1].currentScore = 0;
    players[1].totalScore = 0;
    players[2].currentScore = 0;
    players[2].totalScore = 0;

    currentPlayer = 1;
    updateScoreDisplays();
};

const diceClick = (img) => {
    if (players[currentPlayer].currentScore === 0) return;
    
	let i = img.getAttribute("data-number");
	img.classList.toggle("transparent");

	if (diceArr[i].clicked === 0) {
	    diceArr[i].clicked = 1;
	} else {
		diceArr[i].clicked = 0;
	};
};

const computeScore = (diceValues) => {
    let score = 0;
    let counts = [0, 0, 0, 0, 0, 0];

    diceValues.forEach(value => {
        counts[value - 1]++;
    });

    // Handle triples first
    for (let i = 0; i < 6; i++) {
        if (counts[i] >= 3) {
            score += (i === 0) ? 1000 : (i + 1) * 100;
            counts[i] -= 3;  // Deduct the counted dice
        };
    };

    // Handle individual 1's and 5's
    score += counts[0] * 100;  // For 1's
    score += counts[4] * 50;   // For 5's

    return score;
};

const bankScore = () => {
    const selectedDice = diceArr.filter(die => die.clicked === 1).map(die => die.value);

    if (!selectedDice.length || players[currentPlayer].currentScore === 0) {
        alert('You need to select some scoring dice before banking!');
        return;
    };

    players[currentPlayer].totalScore += players[currentPlayer].currentScore;
    players[currentPlayer].currentScore = 0;

    updateScoreDisplays();
    resetDiceSelection();

    if (players[currentPlayer].totalScore >= 10000) {
        alert('Player ' + currentPlayer + ' wins with a total score of: ' + players[currentPlayer].totalScore);
        resetGame();
    } else {
        switchPlayer();
    };
};
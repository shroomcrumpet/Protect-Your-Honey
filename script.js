
var body = document.body;
var playingField = document.querySelector('.playing-field');
var scoreboard = document.querySelector('.scoreboard');
var startCounter = document.getElementById('countdown-to-start');
// var gameCounter = document.querySelector('.button-container');
var gameCounter = document.querySelector('.ingame-countdown');

var dimensions = 4;
var gameDuration = 15;
var score = 0;

function createBoxes () {

    for (i = 0; i < dimensions; i++) {
    var newRow = document.createElement('div');
    newRow.className = 'row';
    newRow.id = `row ${i}`;
    playingField.appendChild(newRow);

    var newBox = document.createElement('div');
    newBox.className = 'box';

        for (j = 0; j < dimensions; j++) {
            var newBox = document.createElement('div');
            newBox.className = 'box';
            newBox.id = `${i}${j}`;
            newRow.appendChild(newBox);

            var honeypot = document.createElement('img');
            honeypot.src = './images/honeypot3.png';
            honeypot.id = `honeypot-${i}${j}`;
            honeypot.className = 'honeypot'
            newBox.appendChild(honeypot);

            var bear = document.createElement('img');
            bear.src = './images/bear2.png';
            bear.className = 'bear';
            bear.id = `honeypot-${i}${j}`
            newBox.appendChild(bear);
        };
    };
};

createBoxes();


var gameOver = false;
var rows = document.querySelectorAll('.row');
var boxes = document.querySelectorAll('.box');
var bears = document.querySelectorAll('.bear');
var pots = document.querySelectorAll('.honeypot');
var startButton = document.querySelector('#start-game-button');
var lastBox;


function randomTime(min, max) {
    return Math.round(Math.random() * (max - min) + min);
};


function randomBox(boxes) {
    var num = Math.floor(Math.random() * boxes.length);
    var box = boxes[num];

    if (box === lastBox) {
        return randomBox(boxes);
    }

    lastBox = box;
    return box;
};


function popOut() {
    var time = randomTime (500, 2000);
    var box = randomBox(boxes);

    box.classList.add('poppedUp');

    function popDown() {
        box.classList.remove('poppedUp');
    };

    setTimeout (function() {
        popDown();
        if (gameOver !== true) {
            popOut();
        };
    }, time);
};


function bonk(event) {
    this.parentElement.classList.remove('poppedUp');
    score++;
    scoreboard.textContent = score;
};


for (i = 0; i < bears.length; i++) {
    bears[i].addEventListener('click', bonk);
};


var countStart = 3
function countdownStart() {
    startCounter.textContent = countStart;

    setTimeout(function() {
        countStart--;

        if(countStart === 0) {
            startCounter.textContent = 'Go!';
            return;
        };
        countdownStart();

    }, 1000);
};


var countGame = gameDuration;
function countdownGame() {
    gameCounter.textContent = `${countGame} seconds remaining`;

    setTimeout(function() {
        countGame--;

        if(countGame === 0) {
            gameCounter.textContent = "Time's Up!";
            setTimeout( function() {
                gameCounter.textContent = '';
                startButton.style.visibility = 'visible';
                }, 2000);
            return;
        };
        countdownGame();

    }, 1000);
};


function init() {
    score = 0;
    scoreboard.textContent = score;

    countdownStart();
    setTimeout( function() {
        startCounter.textContent = '';
        startCounter.style.visibility = 'hidden';
        startButton.style.visibility = 'hidden';
        popOut();
        countdownGame();
    }, 4000);

    setTimeout (function() {gameOver = true;}, (gameDuration + 4) * 1000);
};


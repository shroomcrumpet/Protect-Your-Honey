
var body = document.body;
var h1 = document.querySelector('h1');
var scoreboard = document.querySelector('.scoreboard');
var startButton = document.querySelector('#start-game-button');
var gameCounter = document.querySelector('.ingame-countdown');
var playingField = document.querySelector('.playing-field');
var startCounter = document.getElementById('countdown-to-start');

var interactibles = [h1, scoreboard, startButton, gameCounter, playingField];

var sound_Bonk = new Audio('./audio/frypan.mp3');

var dimensions = 3;
var gameDuration = 15;
var score = 0;


function preventZoom(event) { // prevents double-tap zooming and selecting
  var t2 = event.timeStamp;
  var t1 = event.currentTarget.dataset.lastTouch || t2;
  var dt = t2 - t1;
  var fingers = event.touches.length;

  event.currentTarget.dataset.lastTouch = t2;

  if (!dt || dt > 500 || fingers > 1) return; // not double-tap

  event.preventDefault();
  event.target.click();
}

interactibles.forEach( function(element) {
    element.addEventListener('touchstart', preventZoom);
});



function createBoxes () {

    for (i = 0; i < dimensions; i++) {
    var newRow = document.createElement('div');
    newRow.className = 'row';
    newRow.id = `row ${i}`;
    newRow.style.height = `${100/(dimensions+1)}%`;
    playingField.appendChild(newRow);

    var newBox = document.createElement('div');
    newBox.className = 'box';

        for (j = 0; j < dimensions; j++) {
            var newBox = document.createElement('div');
            newBox.className = 'box';
            newBox.id = `${i}${j}`;
            newBox.style.width = `${100/(dimensions+1)}%`;
            newBox.style.height = '100%';
            newBox.style.margin = `${(100-((100*dimensions)/(dimensions+1)))/(2*dimensions)}%`;
            newRow.appendChild(newBox);

            var honeypot = document.createElement('img');
            honeypot.src = './images/honeypot3.png';
            honeypot.id = `honeypot-${i}${j}`;
            honeypot.className = 'honeypot'
            newBox.appendChild(honeypot);

            var bear = document.createElement('img');
            bear.src = './images/bear3.png';
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
    sound_Bonk.play();
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
                startButton.textContent = '\xa0# Play Again #\xa0';
                startButton.style.visibility = 'visible';
                startButton.addEventListener('click', init);
                }, 3000);
            return;
        };
        countdownGame();

    }, 1000);
};


function init() {
    startButton.removeEventListener('click', init); // prevents multi-clicking leading to multiple function instances
    score = 0;
    gameOver = false;
    countStart = 3;
    countGame = gameDuration;
    startCounter.style.visibility = 'visible';

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


startButton.addEventListener('click', init);

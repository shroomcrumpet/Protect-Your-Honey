
var sound_Click1 = new Audio('./audio/click1.mp3');
var sound_Click2 = new Audio('./audio/click2.mp3');
var sound_Bonk = new Audio('./audio/frypan.mp3');

var body = document.body;
var h1 = document.querySelector('h1');
var scoreboard = document.querySelector('.scoreboard');
var startButton = document.querySelector('#start-game-button');
var gameCounter = document.querySelector('.ingame-countdown');
var playingField = document.querySelector('.playing-field');
var cog = document.getElementById('cog');
var startCounter;
var rows;
var boxes;
var bears;
var pots;
var lastBox;
var configScreen = document.querySelector('.config-screen');
var config1 = document.getElementById('config-1-option');
var config2 = document.getElementById('config-2-option');
var config1increase = document.querySelector('#config-1 .increase');
var config1decrease = document.querySelector('#config-1 .decrease');
var config2increase = document.querySelector('#config-2 .increase');
var config2decrease = document.querySelector('#config-2 .decrease');

var interactibles = [h1, scoreboard, startButton, gameCounter, playingField, cog, configScreen];

var dimensions = 4;
var gameDuration = 15;
var score = 0;
var gameOver = false;
var popTimeMin = 500;
var popTimeMax = 1500;


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


function createField () {

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

    var newDiv = document.createElement('div');
    newDiv.id = 'countdown-to-start';
    playingField.appendChild(newDiv);
    startCounter = document.getElementById('countdown-to-start');

    rows = document.querySelectorAll('.row');
    boxes = document.querySelectorAll('.box');
    bears = document.querySelectorAll('.bear');
    pots = document.querySelectorAll('.honeypot');

    for (i = 0; i < bears.length; i++) {
        bears[i].addEventListener('click', bonk);
    };
};


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
    var time = randomTime (popTimeMin, popTimeMax);
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


function playBonkSound(volume) {
  var clonedAudio = sound_Bonk.cloneNode();
  clonedAudio.volume = volume;
  clonedAudio.play();
}


function bonk(event) {
    this.parentElement.classList.remove('poppedUp');
    playBonkSound(0.6);
    score++;
    scoreboard.textContent = score;
};


var countStart = 3;

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


function configCog() {
    sound_Click2.play();

    if (configScreen.style.visibility === 'visible') {
        configScreen.style.visibility = 'hidden';
    } else {configScreen.style.visibility = 'visible'};
};


function increaseDimensions() {
    sound_Click1.play();

    if (dimensions < 5) {
        dimensions++
        config1.textContent = dimensions;
    };
    if (dimensions === 5) {
        config1increase.style.visibility = 'hidden';
    };
    if (dimensions > 3) {
        config1decrease.style.visibility = 'inherit';
    };

    while (playingField.firstChild) {
    playingField.removeChild(playingField.firstChild);
    };

    createField();
};


function decreaseDimensions() {
    sound_Click1.play();

    if (dimensions > 3) {
        dimensions--
        config1.textContent = dimensions;
    };
    if (dimensions === 3) {
        config1decrease.style.visibility = 'hidden';
    };
    if (dimensions < 5) {
        config1increase.style.visibility = 'inherit';
    };

    while (playingField.firstChild) {
    playingField.removeChild(playingField.firstChild);
    };

    createField();
};


function increaseDuration() {
    sound_Click1.play();

    if (gameDuration < 30) {
        gameDuration = gameDuration + 5;
    } else if (gameDuration < 60) {
        gameDuration = gameDuration + 10;
    } config2.textContent = `${gameDuration}s`;

    if (gameDuration === 60) {
        config2increase.style.visibility = 'hidden';
    };
    if (gameDuration > 5) {
        config2decrease.style.visibility = 'inherit';
    };
};


function decreaseDuration() {
    sound_Click1.play();

    if (gameDuration > 30) {
        gameDuration = gameDuration - 10;
    } else if (gameDuration > 5) {
        gameDuration = gameDuration - 5;
    } config2.textContent = `${gameDuration}s`;

    if (gameDuration === 5) {
        config2decrease.style.visibility = 'hidden';
    };
    if (gameDuration < 60) {
        config2increase.style.visibility = 'inherit';
    };
};


createField();

startButton.addEventListener('click', init);
startButton.addEventListener('click', function(){
    document.getElementById('marimba').play();
    sound_Click2.play();
});
cog.addEventListener('click', configCog);
config1increase.addEventListener('click', increaseDimensions);
config1decrease.addEventListener('click', decreaseDimensions);
config2increase.addEventListener('click', increaseDuration);
config2decrease.addEventListener('click', decreaseDuration);








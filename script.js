
var body = document.body;
var playingField = document.querySelector('.playing-field');

var dimensions = 4;
var gameDuration = 10;
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
            // newBox.textContent = 'BOX';
            newRow.appendChild(newBox);

            var honeypot = document.createElement('img');
            honeypot.src = './images/honeypot.png';
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
var startButton = document.querySelector('button');
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
    var time = randomTime (1500, 3500);
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
    console.log(this.classList);
    // this.classList.remove('poppedUp');
    score++;
}


for (i = 0; i < bears.length; i++) {
    bears[i].addEventListener('click', bonk);
}


function init() {
    score = 0;
    popOut();

    setTimeout (function() {gameOver = true;}, gameDuration * 1000);
}




// startButton.addEventListener('click', init(10000));

// bears.addEventListener('click', function(){
//     asd
// });



// function createMoles () {

//     boxes.forEach (function (mole, index) {
//         var newMole = document.createElement('div');
//         newMole.className = 'mole';
//         newMole.id = `mole-${boxes[index].id}`;
//         newMole.textContent = 'BEAR';
//         boxes[index].appendChild(newMole);
//     });

//     moles = document.querySelectorAll('.mole');
// };

// createMoles();
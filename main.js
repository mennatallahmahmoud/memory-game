let startBtn = document.querySelector('.control span');
let username = document.querySelector('.info .name span');
let timer = document.querySelector('.info .timer span');
let resultDiv = document.querySelector('.final');
let leaderboard = document.querySelector('.leaderboard');
let arrForLs = [];

if (window.localStorage.getItem('Gamers')) {
    arrForLs = JSON.parse(window.localStorage.getItem('Gamers'));
}

startBtn.onclick = function () {
    let yourName = window.prompt("What's Your Name ?");
    if (yourName == null || yourName == "") {
        username.innerHTML = "Unknown";
    } else {
        username.innerHTML = `${yourName[0].toUpperCase()}${yourName.slice(1)}`;
    }
    startBtn.parentElement.style.display = 'none';
    startBtn.parentElement.style.zIndex = '-100';
    setTimeout(() => {
        timerCount();
    }, 1000);
    document.getElementById('start').play();
}

let duration = 300;
let gameContainer = document.querySelector('.game-container');
let gameBlocks = Array.from(gameContainer.children);
let blocksArr = Array.from(Array(gameBlocks.length).keys());
let wrongTries = document.querySelector('.info .tries span');
timer.innerHTML = gameBlocks.length + 10;

getFromLs();

shuffleBlocks(gameBlocks);

gameBlocks.forEach((block, index) => {
    block.style.order = blocksArr[index];

    block.addEventListener("click", () => {
        flipBlock(block)
    })
})

function flipBlock(block) {
    block.classList.add("flip");
    let flippedBlocks = gameBlocks.filter((block) => block.classList.contains('flip'));
    if (flippedBlocks.length == 2) {
        stopClicking();
        chckBlocks(flippedBlocks[0], flippedBlocks[1]);
    }
}

function chckBlocks(firstB, secondB) {
    if (firstB.dataset.tech === secondB.dataset.tech) {
        firstB.classList.remove('flip');
        secondB.classList.remove('flip');

        firstB.classList.add('match')
        secondB.classList.add('match')
        document.getElementById('win').play();
    } else {
        wrongTries.innerHTML = +wrongTries.innerHTML + 1;
        setTimeout(() => {
            firstB.classList.remove('flip');
            secondB.classList.remove('flip');
        }, duration)
    }
}

function stopClicking() {
    gameContainer.classList.add("no-clicking")
    setTimeout(() => {
        gameContainer.classList.remove("no-clicking")
    }, duration)
}

function shuffleBlocks(arr) {
    let current = arr.length,
    stash,
    random;

    while (current > 0) {
        random = Math.floor(Math.random() * current);
        current--;
        stash = arr[current];
        arr[current] = arr[random];
        arr[random] = stash;
    }
    return arr;
}

function timerCount() {
    let countDown = setInterval(() => {
        timer.innerHTML--;
        if (timer.innerHTML == '0') {
            clearInterval(countDown);
            gameBlocks.forEach((block) => block.classList.remove('flip'));
            let finalFlipped = gameBlocks.filter((block) => block.classList.contains('match'));
            if (finalFlipped.length == gameBlocks.length) {
                resultDiv.style.display = 'block';
                let div = document.createElement('div');
                div.className = 'win';
                div.appendChild(document.createTextNode('CONGRATULATIONS'))
                resultDiv.appendChild(div);
                document.getElementById('congrats').play();
            } else {
                resultDiv.style.display = 'block';
                let div = document.createElement('div');
                div.className = 'lose';
                div.appendChild(document.createTextNode('GAME OVER'))
                resultDiv.appendChild(div);
                document.getElementById('gameover').play();
            }
            setTimeout(() => {
                window.location.reload();
            }, 3000);
            gamersScore(finalFlipped.length);
        }
    }, 1000);
}


function gamersScore(score) {
    const gamer = {
        name: username.innerHTML,
        score: score / 2,
    }
    arrForLs.push(gamer);
    addToLs(arrForLs);
}

function addToLs(arr) {
    window.localStorage.setItem("Gamers", JSON.stringify(arr));
}

function getFromLs() {
    let data = window.localStorage.getItem('Gamers');
    if (data) {
        let gamersScore = JSON.parse(data);
        addToLB(gamersScore)
    }
}

function addToLB(gamersScore) {
    gamersScore.forEach((gamerS) => {
        let leaderP = document.createElement('p');
        let nameSpan = document.createElement('span');
        let scoreSpan = document.createElement('span');
        nameSpan.innerHTML = `${gamerS.name}: `;
        scoreSpan.innerHTML = gamerS.score;
        leaderP.appendChild(nameSpan);
        leaderP.appendChild(scoreSpan);
        leaderboard.appendChild(leaderP);
    })
}
// window.localStorage.clear()

document.querySelector('.copyright span').innerHTML = new Date().getFullYear();
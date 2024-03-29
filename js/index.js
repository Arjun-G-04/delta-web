// Declaring all variables
let gridSize = 20 ;
let direction = {x: 0, y: 0} ;
let speed = 5 ; // fps
let score = 0 ;
let lastPaintTime = 0 ;
let snake = [{x: 13, y: 15}, {x:14, y:15}, {x:15, y:15}] ;
let hiScore = 0 ;
let powers = null ;
let time = 30 ;
let intervalId = null ;
let pointAudio = new Audio('https://arjun-g-04.github.io/delta-web/assets/ateFood.mp3') ;
let seqAudio = new Audio('https://arjun-g-04.github.io/delta-web/assets/ateSeq.mp3') ;
let gameOver = new Audio('https://arjun-g-04.github.io/delta-web/assets/gameOver.wav') ;
let wrongFood = new Audio('https://arjun-g-04.github.io/delta-web/assets/wrongFood.mp3') ;
let alarm = new Audio('https://arjun-g-04.github.io/delta-web/assets/alarm.wav') ;
let lives = 3 ;
let startTime = null ;
let endTime = null ;
let timePassed = 0 ;
let pauseButton = document.getElementById('pause') ;
pauseButton.style.display = "none" ;
savedDirection = direction ;
let gridSelection = document.getElementById('gridSelection') ;
gridSelection.style.display = "none" ;
let validKeys = ["ArrowUp", "ArrowDown", "ArrowRight", "ArrowLeft"] ;
let words = [
    'fur',
    'war',
    'pay',
    'tax',
    'fog',
    'buy',
    'bet',
    'log',
    'cat',
    'bad',
    'firm',
    'team',
    'delta',
    'pole',
    'bang',
    'time',
    'cope',
    'meat',
    'lift',
    'taste',
    'unity',
    'touch',
    'NIT',
    'fraud',
    'tribe',
    'swear',
    'Trichy',
    'crash',
    'siege',
    'pathway'
] ;
let word = "" ;
let foods = genFood() ;
let popUp = document.getElementById("popUp") ;

// Game sequence (regulate frame rate)
function main(ctime) {
    window.requestAnimationFrame(main);
    if (((ctime - lastPaintTime)/1000) < (1/speed)) {
        return ;
    }
    lastPaintTime = ctime ;
    gameEngine() ;
}

// Game functions
function isCollide(snakeArr) {

    // If collide with itself
    for (let i = 1 ; i < snake.length ; i++) {
        if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
            return true ;
        }
    }

    // If moves past walls
    if (snake[0].x < 1 || snake[0].x > gridSize) {
        return true ;
    }
    if (snake[0].y < 1 || snake[0].y > gridSize) {
        return true ;
    }

    return false ;
}

function doesItContain(list, dict) {
    let cond = false ;
    for (i = 0 ; i < list.length ; i++) {
        listDict = list[i] ;
        if (listDict.x === dict.x && listDict.y === dict.y) {
            cond = true ;
        }
    }
    if (cond === false) {
        return false ;
    } else {
        return true ;
    }
}

function genFood() {
    normFoods = [] ;
    let a = 1 ;
    let b = gridSize ;
    let i = 0 ;
    let c = 0 ;
    let d = words.length - 1 ;
    word = words[Math.round(c + ((d-c)*Math.random()))] ;
    while (true) {
        loc = {x: Math.round(a+(b-a)*Math.random()), y: Math.round(a+(b-a)*Math.random())} ;
        if (doesItContain(normFoods, loc) || doesItContain(snake, loc)) {
            // Do nothing
        } else {
            if (powers === null) {
                normFoods.push(loc) ;
                i++ ;
            } else if (!doesItContain(powers, loc)) {
                normFoods.push(loc) ;
                i++ ;
            }
        }
        if (i === word.length) {
            break ;
        }
    }
    for (let i = 0 ; i < word.length ; i++) {
        normFoods[i]['letter'] = word[i] ;
    }
    return normFoods ;
}

function genPower() {
    let genPowers = [] ;
    let a = 1 ;
    let b = gridSize ;
    let types = ["shrink", "slow"] ;
    let numOfPowers = Math.floor(1 + 3*Math.random()) ;
    for (let i = 0 ; i < numOfPowers ; i++) {
        while (true) {
            loc = {x: Math.round(a+(b-a)*Math.random()), y: Math.round(a+(b-a)*Math.random())} ;
            if (doesItContain(normFoods, loc) || doesItContain(snake, loc) || doesItContain(genPowers, loc)) {
                // Do nothing
            } else {
                loc["type"] = types[Math.floor(2*Math.random())] ;
                genPowers.push(loc) ;
                break ;
            }
        }
    }
    return genPowers ;
}

function updateTimer() {
    time-- ;
    timer.innerHTML="Time Left: " + time ;

    if (time === 10) {
        alarm.play() ;
    }

    if (time > 10 || time === 0) {
        alarm.pause() ; 
        alarm.currentTime = 0 ;
    }

    // Increase speed
    if (startTime != null) {
        endTime =  new Date() ;
        timePassed = Math.floor((endTime - startTime)/1000) ;
        if (timePassed % 20 === 0 && timePassed != 0) {
            speed += 1 ;
        }
    }

    // Generate power ups
    if (Math.random() > 0.75 && powers === null) {
        powers = genPower() ;
    }

} 

// Game Engine: Renders after taking input and evaluating under game rules
function gameEngine() {

    // Game over conditions
    if (isCollide(snake) || time === 0) {
        lives-- ;
        if (lives > 0) {
            alarm.pause() ; 
            alarm.currentTime = 0 ;
            alert("You have " + lives + " lives left!") ;
            direction = {x: 0, y: 0} ;
            snake = [{x: 13, y: 15}, {x:14, y:15}, {x:15, y:15}] ;
            clearInterval(intervalId) ;
            intervalId = null ;
            time = 30 ;
            startTime = null ;
            powers = null ;
            speed = 5 ;
            foods = genFood() ;
            timer.innerHTML="Time Left: " + time ;
            pauseButton.style.display = "none" ;
        } else {
            alarm.pause() ; 
            alarm.currentTime = 0 ;
            gameOver.play() ;
            direction = {x: 0, y: 0} ;
            snake = [{x: 13, y: 15}, {x:14, y:15}, {x:15, y:15}] ;
            score = 0 ;
            clearInterval(intervalId) ;
            intervalId = null ;
            startTime = null ;
            speed = 5 ;
            time = 30 ;
            foods = genFood() ;
            powers = null ;
            scoreBox.innerHTML="Score: " + score ;
            timer.innerHTML="Time Left: " + time ;
            lives = 3 ;
            pauseButton.style.display = "none" ;
            alert("Game Over!") ;
        }
    }

    // Process power up
    if (powers != null) {
        if (powers.length === 0) {
            powers = null ;
        } else {
            for (let i = 0 ; i < powers.length ; i++) {
                power = powers[i] ;
                if (power.x === snake[0].x && power.y === snake[0].y) {
                    if (power['type'] === 'shrink') {
                        if ((snake.length - 1) >= 3) {
                            snake.splice((snake.length - 1), 1) ;
                        }
                    } else {
                        if (speed - 2 >= 5) {
                            speed -= 2 ;
                        }
                    }
                    powers.splice(i, 1) ;
                }
            }
        }
    }
    
    // If ate all food, add extra score, add time, generate new food
    if (foods.length === 0) {
        foods = genFood() ;
        score += 5 ;
        scoreBox.innerHTML="Score: " + score ;
        time += 15 ;
        seqAudio.pause() ;
        seqAudio.currentTime = 0 ;
        seqAudio.play() ;
        if (score > hiScore) {
            localStorage.setItem("hiScore", JSON.stringify(score)) ;
        }
        snake.unshift({x: snake[0].x + direction.x, y: snake[0].y + direction.y}) ;
    }


    // If ate correct food, increase score and size, else decrease score and regenerate food
    for (let i = 0 ; i < foods.length ; i++) {
        food = foods[i] ;
        if (food.x === snake[0].x && food.y === snake[0].y) {
            if (i == 0) {
                pointAudio.pause() ;
                pointAudio.currentTime = 0 ;
                pointAudio.play() ;
                foods.splice(0, 1) ;
                score++ ;
            } else {
                wrongFood.pause() ;
                wrongFood.currentTime = 0 ;
                wrongFood.play() ;
                foods = genFood() ;
                score-- ;
            }
        }
        if (score > hiScore) {
            localStorage.setItem("hiScore", JSON.stringify(score)) ;
        }
        scoreBox.innerHTML="Score: " + score ;
    }

    // Move snake if input started
    if (direction.x != 0 || direction.y != 0) {
        for (let i = snake.length - 1 ; i >= 1 ; i--) {
            snake[i] = {...snake[i-1]} ;
        }
        snake[0] = {x: snake[0].x + direction.x, y: snake[0].y + direction.y} ;
    }

    // Display snake
    board.innerHTML = "" ;
    snake.forEach((e, index) => {
        snakeElement = document.createElement('div') ;
        snakeElement.style.gridRowStart = e.y ;
        snakeElement.style.gridColumnStart = e.x ;
        if (index === 0) {
            snakeElement.classList.add('head') ;    
        } else {
            snakeElement.classList.add('snake') ;
        }
        board.appendChild(snakeElement) ;
    });

    // Display food
    for (let i = 0 ; i < foods.length ; i++) {
        food = foods[i] ;
        foodElement = document.createElement('div') ;
        foodElement.classList.add('food') ;
        size = 0.70*(85/gridSize) ;
        foodElement.style.fontSize = size + "vmin" ;
        foodElement.style.gridRowStart = food.y ;
        foodElement.style.gridColumnStart = food.x ;
        foodElement.textContent= food['letter'] ;
        board.appendChild(foodElement) ;
    }

    // Display powerups
    if (powers != null) {
        for (let i = 0 ; i < powers.length ; i++) {
            power = powers[i] ;
            powerElement = document.createElement('div') ;
            powerElement.classList.add('powerUp') ;
            powerElement.style.gridRowStart = power.y ;
            powerElement.style.gridColumnStart = power.x ;
            powerElement.style.backgroundImage = "url('https:\/\/arjun-g-04.github.io\/delta-web\/assets\/" + power['type'] + ".png')" ; ;
            board.appendChild(powerElement) ;
        }
    }

    // Display sequence
    sequence.innerHTML = "<div class=\"seqText\">Sequence: </div>" ;
    blockElement = document.createElement('div') ;
    blockElement.classList.add("word") ;
    blockElement.textContent = word ;
    sequence.appendChild(blockElement) ;

    // Display Lives
    livesElement = document.createElement('div') ;
    livesElement.textContent = "Lives: " ;
    livesElement.classList.add("seqText") ;
    livesElement.style.marginLeft = "auto" ;
    sequence.appendChild(livesElement) ;
    for (let i = 0 ; i < lives ; i++) {
        heartElement = document.createElement("div") ;
        heartElement.classList.add("heart") ;
        sequence.appendChild(heartElement) ;
    }

    // Update High Score
    let hiScoreData = localStorage.getItem("hiScore") ;
    if (hiScoreData === null) {
        localStorage.setItem("hiScore", JSON.stringify(hiScore)) ;
    }
    else {
        hiScore = JSON.parse(hiScoreData) ;
        highScore.innerHTML = "HiScore: " + hiScore ;
    }

    // Set grid size
    if (lives === 3 && intervalId === null && pauseButton.innerHTML != "Play") {
        gridSelection.style.display = "flex" ;
        board = document.getElementById("board") ;
        input = document.getElementById("gridSize") ;
        newGridSize = parseInt(input.value) ;
        board.style.gridTemplateRows = "repeat(" + newGridSize + ", 1fr)" ;
        board.style.gridTemplateColumns = "repeat(" + newGridSize + ", 1fr)" ;
        if (gridSize != newGridSize) {
            gridSize = newGridSize ;
            foods = genFood() ;
        }

    } else {
        gridSelection.style.display = "none" ;
    }
}

// Process the input
let popUpShown = localStorage.getItem("popUpShown") ;
if (popUpShown === null) {
    localStorage.setItem("popUpShown", "false") ;
    popUpShown = localStorage.getItem("popUpShown") ;
} else if (popUpShown === 'true') {
    popUp.style.display = "none" ;
}
window.requestAnimationFrame(main) ;
window.addEventListener('click', e => {
    popUp.style.display = "none" ;
    localStorage.setItem("popUpShown", "true") ;
    popUpShown = localStorage.getItem("popUpShown") ;
}) ;
pauseButton.addEventListener('click', e => {
    if (intervalId === null) {
        direction = savedDirection ;
        intervalId = setInterval(updateTimer, 1000) ;
        pauseButton.innerHTML = "Pause" ;
    } else {
        savedDirection = direction ; 
        direction = {x:0, y:0} ;
        clearInterval(intervalId) ;
        intervalId = null ;
        pauseButton.innerHTML = "Play" ;
    }
}) ;
window.addEventListener('keydown', e => {
    // Starting the game
    
    if (intervalId === null && validKeys.includes(e.key) && popUpShown === "true") {
        intervalId = setInterval(updateTimer, 1000) ;
        startTime = new Date() ;
        pauseButton.style.display = "block" ;
        pauseButton.innerHTML = "Pause" ;
    }

    console.log(popUpShown) ;
    if (popUpShown === "true") {
        // Processing inputs
        switch (e.key) {
            case "ArrowUp":
                if (direction.x === 0 && direction.y === 1) {
                    direction = {x:0, y:1} ; 
                    break ;
                } else {
                    direction = {x:0, y:-1} ; 
                    break ;
                }

            case "ArrowDown":
                if (direction.x === 0 && direction.y === -1) {
                    direction = {x:0, y:-1} ; 
                    break ;
                } else {
                    direction = {x:0, y:1} ; 
                    break ;
                }

            case "ArrowLeft":
                if (direction.x === 1 && direction.y === 0) {
                    direction = {x:1, y:0} ; 
                    break ;
                } else {
                    direction = {x:-1, y:0} ; 
                    break ;
                }

            case "ArrowRight":
                if (direction.x === -1 && direction.y === 0) {
                    direction = {x:-1, y:0} ; 
                    break ;
                } else {
                    direction = {x:1, y:0} ; 
                    break ;
                }
        }
    }
}) ;

// Variables to track touch movement
let touchStartX = 0 ;
let touchStartY = 0 ;
let touchEndX = 0 ;
let touchEndY = 0 ;

element = document.getElementById("board") ;

// Adding event listeners for touch events
element.addEventListener('touchstart', handleTouchStart) ;
element.addEventListener('touchmove', handleTouchMove) ;
element.addEventListener('touchend', handleTouchEnd) ;

// Function to handle touch start event
function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX ;
    touchStartY = event.touches[0].clientY ;
}

// Function to handle touch move event
function handleTouchMove(event) {
    touchEndX = event.touches[0].clientX ;
    touchEndY = event.touches[0].clientY ;
    event.preventDefault(); // Very important :_( this prevents scrolling
}

// Function to handle touch end event
function handleTouchEnd(event) {
    const diffX = touchStartX - touchEndX ;
    const diffY = touchStartY - touchEndY ;
    if (intervalId === null) {
        intervalId = setInterval(updateTimer, 1000) ;
        startTime = new Date() ;
    }
    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) { // Swipe left
            if (direction.x === 1 && direction.y === 0) {
                direction = {x:1, y:0} ; 
            } else {
                direction = {x:-1, y:0} ; 
            }
        } else { // Swipe right
            if (direction.x === -1 && direction.y === 0) {
                direction = {x:-1, y:0} ; 
            } else {
                direction = {x:1, y:0} ; 
            }
        }
    } else { 
        if (diffY > 0) { // Swipe up
            if (direction.x === 0 && direction.y === 1) {
                direction = {x:0, y:1} ; 
            } else {
                direction = {x:0, y:-1} ; 
            }
        } else { // Swipe down
            if (direction.x === 0 && direction.y === -1) {
                direction = {x:0, y:-1} ; 
            } else {
                direction = {x:0, y:1} ; 
            }
        }
    }
    event.preventDefault();
}

// Declaring all variables
let direction = {x: 0, y: 0} ;
let speed = 5 ; // fps
let score = 0 ;
let lastPaintTime = 0 ;
let snake = [{x: 13, y: 15}, {x:14, y:15}, {x:15, y:15}] ;
let food = {x: 5, y: 10} ;
let hiScore = 0 ;
let foods = genFood() ;
let time = 30 ;
let intervalId = null ;
let pointAudio = new Audio('https://arjun-g-04.github.io/delta-web/assets/ateFood.mp3') ;
let seqAudio = new Audio('https://arjun-g-04.github.io/delta-web/assets/ateSeq.mp3') ;
let gameOver = new Audio('https://arjun-g-04.github.io/delta-web/assets/gameOver.mp3') ;
let wrongFood = new Audio('https://arjun-g-04.github.io/delta-web/assets/wrongFood.mp3') ;

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
    if (snake[0].x < 1 || snake[0].x > 20) {
        return true ;
    }
    if (snake[0].y < 1 || snake[0].y > 20) {
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
    colours = ["grey", "yellow", "pink", "blue", "cyan"] ;
    let a = 1 ;
    let b = 20 ;
    let i = 0 ;
    while (true) {
        loc = {x: Math.round(a+(b-a)*Math.random()), y: Math.round(a+(b-a)*Math.random())} ;
        console.log(normFoods.includes(loc), snake.includes(loc)) ;
        if (doesItContain(normFoods, loc) || doesItContain(snake, loc)) {
            // Do nothing
        } else {
            normFoods.push(loc) ;
            i++ ;
        }
        if (i === 5) {
            break ;
        }
    }
    for (let i = 0 ; i < 5 ; i++) {
        normFoods[i]['colour'] = colours[i] ;
    }
    genFoods = normFoods.sort(() => Math.random() - 0.5) ;
    return genFoods ;
}

function updateTimer() {
    time-- ;
    timer.innerHTML="Time Left: " + time ;
} 

// Game Engine: Renders after taking input and evaluating under game rules
function gameEngine() {

    // Game over conditions
    if (isCollide(snake) || time == 0) {
        gameOver.play() ;
        alert("Game Over!") ;
        direction = {x: 0, y: 0} ;
        snake = [{x: 13, y: 15}, {x:14, y:15}, {x:15, y:15}] ;
        score = 0 ;
        clearInterval(intervalId) ;
        intervalId = null ;
        time = 30 ;
        foods = genFood() ;
        scoreBox.innerHTML="Score: " + score ;
        timer.innerHTML="Time Left: " + time ;
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
    }


    // If ate correct food, increase score, else decrease score and regenerate food
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
        foodElement.style.backgroundColor = food["colour"] ;
        foodElement.style.gridRowStart = food.y ;
        foodElement.style.gridColumnStart = food.x ;
        board.appendChild(foodElement) ;
    }

    // Display sequence
    sequence.innerHTML = "<div id=\"seqText\">Sequence: </div>" ;
    for (let i = 0 ; i < foods.length ; i++) {
        food = foods[i] ;
        blockElement = document.createElement('div') ;
        blockElement.classList.add("block") ;
        blockElement.style.backgroundColor = food["colour"] ;
        sequence.appendChild(blockElement) ;
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
}

// Process the input
window.requestAnimationFrame(main) ;
window.addEventListener('keydown', e => {
    // Starting the game
    if (intervalId === null) {
        intervalId = setInterval(updateTimer, 1000) ;
    }

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
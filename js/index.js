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

function genFood() {
    normFoods = [] ;
    colours = ["grey", "yellow", "pink", "blue", "cyan"] ;
    let a = 1 ;
    let b = 20 ;
    let i = 0 ;
    while (true) {
        loc = {x: Math.round(a+(b-a)*Math.random()), y: Math.round(a+(b-a)*Math.random())} ;
        if (normFoods.includes(loc) || snake.includes(loc)) {
            // Do nothing
        } else {
            loc['colour'] = colours[i] ;
            normFoods.push(loc) ;
            i++ ;
        }
        if (i === 5) {
            break ;
        }
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
        if (score > hiScore) {
            localStorage.setItem("hiScore", JSON.stringify(score)) ;
        }
    }


    // If ate correct food, increase score, else decrease score and regenerate food
    for (let i = 0 ; i < foods.length ; i++) {
        food = foods[i] ;
        if (food.x === snake[0].x && food.y === snake[0].y) {
            if (i == 0) {
                foods.splice(0, 1) ;
                score++ ;
            } else {
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
    direction = {x:0, y:1} ; 
    if (intervalId === null) {
        intervalId = setInterval(updateTimer, 1000) ;
    }

    // Processing inputs
    switch (e.key) {
        case "ArrowUp":
            direction = {x:0, y:-1} ; 
            break ;

        case "ArrowDown":
            direction = {x:0, y:1} ;
            break ;

        case "ArrowLeft":
            direction = {x:-1, y:0} ;
            break ;

        case "ArrowRight":
            direction = {x:1, y:0} ;
            break ;
    }
}) ;

// Variables to track touch movement
let touchStartX = 0 ;
let touchStartY = 0 ;
let touchEndX = 0 ;
let touchEndY = 0 ;

// Adding event listeners for touch events
window.addEventListener('touchstart', handleTouchStart) ;
window.addEventListener('touchmove', handleTouchMove) ;
window.addEventListener('touchend', handleTouchEnd) ;

// Function to handle touch start event
function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX ;
    touchStartY = event.touches[0].clientY ;
}

// Function to handle touch move event
function handleTouchMove(event) {
    touchEndX = event.touches[0].clientX ;
    touchEndY = event.touches[0].clientY ;
}

// Function to handle touch end event
function handleTouchEnd(event) {
    const diffX = touchStartX - touchEndX ;
    const diffY = touchStartY - touchEndY ;
    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) { // Swipe left
            direction = {x:-1, y:0} ;
        } else { // Swipe right
            direction = {x:1, y:0} ;
        }
    } else { 
        if (diffY > 0) { // Swipe up
            direction = {x:0, y:-1} ;
        } else { // Swipe down
            direction = {x:0, y:1} ;
        }
    }
    event.preventDefault();
}

// Prevent scrolling
window.addEventListener('scroll', e => {
    e.preventDefault();
}, { passive: false });
// Declaring all variables
let direction = {x: 0, y: 0} ;
let speed = 5 ; // fps
let score = 0 ;
let lastPaintTime = 0 ;
let snake = [{x: 13, y: 15}, {x:14, y:15}, {x:15, y:15}] ;
let food = {x: 5, y: 10} ;
let hiScore = 0 ;
let foods = genFood() ;

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
    genFoods = [] ;
    colours = ["red", "yellow", "green", "blue", "cyan"] ;
    let a = 1 ;
    let b = 20 ;
    let i = 0 ;
    while (true) {
        loc = {x: Math.round(a+(b-a)*Math.random()), y: Math.round(a+(b-a)*Math.random())} ;
        if (!genFoods.includes(loc) && !snake.includes(loc)) {
            loc['colour'] = colours[i] ;
            genFoods.push(loc) ;
            i++ ;
        }
        if (i === 5) {
            break ;
        }
    }
    return genFoods ;
}

function randomOrder() {
    let normOrder = [0, 1, 2, 3, 4] ;
    randOrder = normOrder.sort(() => Math.random() - 0.5) ;
    return randOrder ;
}

// Game Engine: Renders after taking input and evaluating under game rules
function gameEngine() {

    // Game over condition
    if (isCollide(snake)) {
        alert("Game Over!") ;
        direction = {x: 0, y: 0} ;
        snake = [{x: 13, y: 15}, {x:14, y:15}, {x:15, y:15}] ;
        score = 0 ;
        scoreBox.innerHTML="Score: " + score ;
    }

    // If ate food, increase score, regenerate food
    if (food.x === snake[0].x && food.y === snake[0].y) {
        let a = 1 ;
        let b = 18 ;
        food = {x: Math.round(a+(b-a)*Math.random()), y: Math.round(a+(b-a)*Math.random())} ;
        score++ ;
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
    direction = {x:0, y:1} ; // Starting the game

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
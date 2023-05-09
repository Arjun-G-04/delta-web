// Declaring all variables
let direction = {x: 0, y: 0} ;
let speed = 5 ; // fps
let score = 0 ;
let lastPaintTime = 0 ;
let snake = [{x: 13, y: 15}, {x:14, y:15}, {x:15, y:15}] ;
let food = {x: 5, y: 10} ;

// Game sequence (regulate fram rate)
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
    if (snake[0].x < 1 || snake[0].x > 18) {
        return true ;
    }
    if (snake[0].y < 1 || snake[0].y > 18) {
        return true ;
    }

    return false ;
}

// Game Engine: Renders after taking input and evaluating under game rules
function gameEngine() {

    // Game over condition
    if (isCollide(snake)) {
        alert("Game Over!") ;
        direction = {x: 0, y: 0} ;
        snake = [{x: 13, y: 15}, {x:14, y:15}, {x:15, y:15}] ;
        score = 0 ;
    }

    // If ate food, increase score, regenerate food

    if (food.x === snake[0].x && food.y === snake[0].y) {
        let a = 1 ;
        let b = 18 ;
        food = {x: Math.round(a+(b-a)*Math.random()), y: Math.round(a+(b-a)*Math.random())} ;
        score++ ;
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
    foodElement = document.createElement('div') ;
    foodElement.style.gridRowStart = food.y ;
    foodElement.style.gridColumnStart = food.x ;
    foodElement.classList.add('food') ;
    board.appendChild(foodElement) ;
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
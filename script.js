class Game {
    constructor(startButton, gameArea, panel) {
        this.startButton = startButton;
        this.gameArea = gameArea;
        this.mainMenu = panel;        
    }       

    /* 
    Start
    =====
    */
    
    start() {               

        // Start button is clicked:

        // Yellow upper bar with results slides down.
        document.querySelector('#upper-bar').style = "top: 0px;";
        
        // Getting the access to the picture counter - ten circles in row in the upper bar.
        this.upperBarCounterCircles = document.getElementById('ball-counter');

        // Finding out the chosen difficulty from the list
        this.difficulty = Number(document.getElementById('difficulty').value);
        
        // New variable that will store the converted value of difficulty for another calculation
        this.difficultyScore = 0;
        
        // Converts the difficulty value. Default values are used for the calculation
        // of the time for which the target will be displayed (the easier the game is,
        // the longer time for a player to hitting every target). It's necessary to set new
        // separate values for total score calculating - the more difficult the game is,
        // the more points a player will get.
        switch(this.difficulty) {
            case 1:
                this.difficultyScore = 0.6;
                break;
            case 0.8:
                this.difficultyScore = 1;
                break;
            case 0.6:
                this.difficultyScore = 1.8;
                break;
        }       

        // Saving information about difficulty for subsequent showing in the result list
        this.difficultyResult = this.difficulty; 

        // Footer with big bubbles slides down and disappears
        this.moveFooterBubbles('down');

        // Getting the access to the number counter.
        this.upperBarCounterNumbers = document.getElementById('cont-results');
        
        // Setting the default text content of the number counter
        this.upperBarCounterNumbers.innerText = '0/10';

        // Main menu with difficulty options, start button etc. will be not displayed during the game
        this.mainMenu.style = "display: none;";


        // Game and game area:        
        // Setting the height of the game area, that will be smaller (80%) that total screen size.
        this.gameArea.style.height = (window.innerHeight * 0.8) + "px";

        this.i = 0;        
        this.x = 0;
        this.y = 0;

        this.ball = undefined;

        // Setting the game counter to zero. (Increases with every target shown.)
        this.counter = 0;

        // Finding out the resolution of the game area.
        this.areaWidth = this.gameArea.scrollWidth;
        this.areaHeight = this.gameArea.scrollHeight;  

        // The coefficient will be used for calculation of the total number of points.
        // The bigger the game area, the more points a player will get.
        this.coeff = (this.areaWidth * this.areaHeight) / 100;

        // Saving information about game area width and height for subsequent showing in the result list.
        this.resolutionResult = this.areaWidth.toString() + "x" + this.areaHeight.toString();        

        // Abort the game, when player changes the resolution    
        // window.addEventListener('resize', () => { alert("konec"); clearInterval(interval);});

        // Show targets every two seconds. (The targets method is invoked every two seconds.)
        this.interval = setInterval( () => { this.targets(); }, 2000); 
    }
    
    /*
    Bubble footer Up/Down
    =====================
    */

    // The method "moveFooterBubbles" moves the footer with styled bubbles up or down.
    // It takes one argument: string 'up'/'down'.
    moveFooterBubbles(direction) {

        if(direction === 'down') {
            const b = document.getElementById('bubble-footer');
            b.style = "bottom: -300px;";
        } 
        
        if(direction === 'up'){
            const b = document.getElementById('bubble-footer');
            b.style = "bottom: 0px;";
        } 

    }   

    /*
    Displaying and counting targets
    ===============================
    */
    
    targets() {        
        
        // Is the number of targets shown so far less than ten? If so, continue (10 targets in one round).
        if(this.counter < 10) {
               
                let wasTargetHit = false;  

                // Creating element that will be shown as a target
                this.ball = document.createElement('div');

                // Adding the .target-style class (style-targets.css) to the element.                
                this.ball.classList.add('target-style');

                // Calculation of the random coordinates where the target will appear.
                this.x = Math.floor(Math.random() * this.gameArea.scrollWidth-25).toString() + "px";
                this.y = Math.floor(Math.random() * this.gameArea.scrollHeight-25).toString() + "px";
                
                // Adding the coordinates to the target.
                this.ball.style.left = this.x;
                this.ball.style.top = this.y;            

                // Showing the target somewhere in the game area.
                this.gameArea.appendChild(this.ball);
                        
                // If the target is hit, add class ".shot" (style-targets.css) to the target.
                // The number of hit targets (i) increases - the counter is updated.
                // The variable wasTargetHit is set to true. Based on this, the circle in the upper bar will turn green.
                this.ball.addEventListener('click', () => {
                    this.ball.classList.add('shot');
                    this.i++;                    
                    
                    wasTargetHit = true;                   

                    this.upperBarCounterNumbers.innerText = this.i.toString() + "/10";                         
                });

                // The total number of targets displayed so far increases.
                this.counter++;               

                // Each of the ten targets is displayed only for a short period of time (based on chosen difficulty).
                // When the time is out, the target is removed and the method clickedTargetColor is being invoked.
                setTimeout(() => { this.ball.remove(); this.clickedTargetColor(wasTargetHit, this.counter); }, 1000 * this.difficulty);
     
        // If the number of targets shown so far is more than ten, clear interval and save the round results.
        } else {
                clearInterval(this.interval);
                this.results();
        }
    }

    /* 
    Coloring the circles in the picture counter 
    ===========================================
    */

    // If the target is hit, the circle in the upper bar turns green. If not, the circle turns red
    clickedTargetColor(p, c) {
        
        if(p) {
            this.upperBarCounterCircles.children[c-1].style = "background-color: #0ebb25;";            
        } else {
            this.upperBarCounterCircles.children[c-1].style = "background-color: #bb263a;";
        }
    }
  

    /*
    The round is over - show the results
    ====================================
    */

    results() {

        // After the round is finished:
        // Footer with big bubbles slides up.
        this.moveFooterBubbles('up');
        // Upper bar slides up.
        document.querySelector('#upper-bar').style = "top: -100px;";
        
        // Main menu is shown again.
        this.mainMenu.style = "display: flex;";
        
        // Circle counter - background color of the circles (green/red)
        // is cleared and background is set to transparent again.
        Array.from(this.upperBarCounterCircles.children).forEach((c) => {c.style = "background-color: transparent;"});
        
        // Saving information about score and points for subsequent showing in the result list.
        this.hitNumberResult = Math.floor(this.i * this.difficultyScore * this.coeff); //zde menim
        this.scoreResult = this.i.toString() + "/10";

        let novyObjekt = new Results(this.resolutionResult, this.hitNumberResult, this.difficultyResult, this.scoreResult);        
 
        // Displaying the round results in the main menu.
        this.mainMenu.children[1].innerHTML = `Targets shot<br> ${this.i.toString()}/10`; 
        this.mainMenu.children[2].innerHTML = `Total points<br> ${(Math.floor(this.i * this.difficultyScore * this.coeff)).toString()}`;  //zde menim
    }
  

    verifyAndWrite() {
        if((localStorage.gameResults === undefined) || (localStorage.gameResults === "[null]")) {            
        }
        else {
    
        let tL = JSON.parse(localStorage.gameResults);     

        let resultListTable = document.createElement('table');

        tL.forEach((p) => {
            let row = document.createElement('tr');
            
            for(let inObject in p) {
                let cell = document.createElement('td');
                cell.innerText = p[inObject];                
                row.appendChild(cell);            
            }        
            resultListTable.appendChild(row);                    
        });

        resultListTable.classList.add('table-style');
        
        let fs = document.querySelector('.results-fulscreen');
        
        fs.appendChild(resultListTable);
        
        fs.classList.toggle('show-result-list');
        }  
    }  


    closeFullscreen() {
        let fs = document.querySelector('.results-fulscreen');
        fs.classList.toggle('show-result-list');        
        fs.childNodes[5].remove();        
    }
}  


/* Initialization */
// accessing main panel, game area and start button
const settingsPanel = document.querySelector('#main-box');
const area = document.querySelector('#area');

const newGameButton = document.querySelector('.new-game-button');

const showResultListButton = document.querySelector('.show-results-button');
const resultListFulscreen = document.querySelector('.results-fulscreen');

const newGame = new Game(newGameButton, area, settingsPanel);

// new game button click event
newGameButton.addEventListener('click', () => { newGame.start(); });

showResultListButton.addEventListener('click', newGame.verifyAndWrite);
resultListFulscreen.addEventListener('click', newGame.closeFullscreen);

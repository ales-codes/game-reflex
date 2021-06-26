class Results {

    constructor(resolution, hitNumber, difficulty, score) {
        this.res = resolution;
        this.hN = hitNumber;
        this.d = difficulty;
        this.s = score;

        // invoke the writeIntoMemory method
        this.writeIntoMemory();
    }

    /*
    Write into memory 
    =================
    */

    writeIntoMemory() {
      
        // Creates object, that contains iformation about the just finished round.
        let objectToWrite = {
            roundDate: this.modifyDate(),
            rozliseni: this.res,
            bod: this.hN,
            obtiznost: this.diffTransfer(),
            skore: this.s
        };                

        /*
        No previous results yet:
        */
        if((localStorage.gameResults === undefined) || (localStorage.gameResults === "[null]")) {
            
            let nA = [];

            // Add object into array.
            nA.push(objectToWrite);

            // Save Array into local storage.
            localStorage.gameResults = JSON.stringify(nA);   
        
        /*
        Previous results exist:
        */
        } else {
            
            // Get the saved array with objects from the local storage.
            let arrayO = JSON.parse(localStorage.gameResults);
            
            // Add new object into array.
            arrayO.push(objectToWrite); 
                        
            // Sort the array from the hightest number of points to the lowest.
            let sorted = this.sort(arrayO);

            // And save it to the local storage again.
            if(sorted.length <= 10) {           
                localStorage.gameResults = JSON.stringify(sorted);  
            } else {
                // if the array's length is more than ten, remove the last value.                
                sorted.pop();                
                localStorage.gameResults = JSON.stringify(sorted);  
            }
        }
    }

    /*
    Sorting 
    =======
    */

    sort(pol) {
        
        let i = 0;
        let h = 0;   

        while(i < pol.length-1) {
            if(pol[i].bod < (pol[i+1].bod)) {
                h = pol[i];
                pol[i] = pol[i+1];
                pol[i+1] = h;
                i = 0;            
            } 
            else {
                i++;            
            } 
        }

        return pol;
    }
    
    /* 
    Modifying date method
    =====================
    */

    // Adjusts the date to the required format
    modifyDate() {

        let currentDate = new Date();
        let dateToShow = "";

        dateToShow += currentDate.getDate().toString() + "/";
        dateToShow += (currentDate.getMonth() + 1).toString() + "/";
        dateToShow += currentDate.getFullYear() + " ";
        dateToShow += currentDate.getHours().toString() + ":";
        if(currentDate.getMinutes() < 10) {
            dateToShow += "0" + currentDate.getMinutes().toString();
        } else dateToShow += currentDate.getMinutes().toString();
        
        return dateToShow;
    }

    /*
    Difficulty - number to text
    ===========================
    */

    // "Translates" the difficulty value into a text
    diffTransfer() {

        const dT = {
            "1": "easy",
            "0.8": "moderate",
            "0.6": "hard"
        };

        return dT[this.d];
    }
}
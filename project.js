// 1. Deposit some money
// 2. Determine number of lines to bet on
// 3. Collect a bet amount
// 4. Spin the slot machine
// 5. Check if the user won
// 6. Give the user their winnings
// 7. Play again


//  npm init
//  -> This utility will walk you through creating a package.json file

// npm i prompt-sync  -> Used to be able to take user inputs in JavaScript
// -> added 3 packages, and audited 3 packages in 3s


// const PromptSync = require("prompt-sync");
// import PromptSync from "prompt-sync";   // -> Same as the above line


const prompt = require("prompt-sync")(); // -> import variable

// Global variables:
const ROWS = 3;
const COLUMNS = 3;

    // Symbols in the slot machine:
    // The machine has 2 'A' symbols, 4 'B' symbols, etc.
const SYMBOLS_COUNT = {
    A: 10,
    B: 20,
    C: 30
    // D: 40
};

    // Symbol values implies the multiplier
    // If the symbol on the machine is 'A', multpily the bet by 5 => betAmount * 5
const SYMBOL_VALUES = {
    A: 5,     
    B: 4,
    C: 3,
    D: 2
}



// 1. Function to deposit some money.
const deposit = () => {
    while (true) {
        const depositAmount = prompt("Enter deposit amount: ");
        const integerDepositAmount = parseInt(depositAmount);
        // console.log("\n");

        if (isNaN(integerDepositAmount) || integerDepositAmount <= 0) {
            console.log("Invalid deposit amount, try again.");
            // console.log("\n");
        } else {
            return integerDepositAmount;
        }
    }
}

// 2. Determine number of lines to bet on
const getNumberOfLines = () => {
    while (true) {
        const linesBetOn = prompt("Enter the number of lines to bet on (1-3): ");
        const integerLinesBetOn = parseInt(linesBetOn);
        // console.log("\n");

        if (isNaN(integerLinesBetOn) || integerLinesBetOn<1 || integerLinesBetOn >3) {
            console.log("Number of lines bet on should be between 1 and 3.");
            console.log("Try again.");
            // console.log("\n")
        } else {
            return integerLinesBetOn;
        }
    }
}

// 3. Collect a bet amount
const getBet = (balanceAmount, lines) => {
    while (true) {
        const bet = parseInt(prompt("Enter the bet amount per line: "));
        // console.log("\n");

        if (isNaN(bet) || bet<=0 || bet > (balanceAmount/lines)) {
            console.log("Invalid bet amount.");
            console.log("Try again.");
            // console.log("\n");
        } else {
            return bet;
        }
    }
}

// 4. Spin the slot machine
// -> Randomly selecting symbols based on the counts, which symbols we have in each reel(column) of the slot machine

const spinMachine = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }

    const reels = []; // Represents the columns of the machine.
    for (let i = 0; i < COLUMNS; i++) {
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j = 0; j<ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol); // Adds tha randomly chosen symbol to the reel(column) of the machine
            reelSymbols.splice(randomIndex, 1); // Removes the selected symbol from the reelSymbols array so that it is not selected again
        }
    }
    return reels;
}

// [[A B C], [D D A], [B A A]]  --> This is how the slot machine symbols are currently stored.
//                              --> The machine is stored column wise
//                              --> We need it to be stored row wise
// --> This is how we want it to be stored inorder to be able to find the winnings more easily,
// --> Hence, we need to transpose the array to:  [A D B]
//                                                [B D A]
//                                                [C A A]

const transposeReels = (reels) => {
    const rows = [];

    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for(let j =0; j<COLUMNS; j++) {
            rows[i].push(reels[j][i]);
        }
    }

    return rows;
}

//Print in a machine style:

const printMachine = (rows) => {
    for (const row of rows) {
        let rowString = "";
        for (const[i, symbol] of row.entries()) {
            rowString += symbol;
            if (i != row.length - 1) {
                rowString += " | ";
            }
        }
        console.log(rowString);
    }
}

// Check if the user won
const getWinnigs = (rows, betAmount, numberOfLines) => {
    let winnings = 0;
    for(let row = 0; row < numberOfLines; row++) {
        const symbols = rows[row];
        let allSame = true;

        for(const symbol of symbols) {
            if (symbol != symbols[0]) {
                allSame = false;
                break;
            }
        }

        if(allSame) {
            winnings += betAmount*parseInt(SYMBOL_VALUES[symbols[0]]);
        }
    }
    return winnings;
}


const game = () => {
    let balanceAmount = deposit();
    console.log("Your balance is: Rs. " + balanceAmount);
    while (true) {
        const numberOfLines = getNumberOfLines();
        const betAmount = getBet(balanceAmount, numberOfLines)

        balanceAmount -= betAmount * numberOfLines;

        const reels = spinMachine();
        const rows = transposeReels(reels);
        printMachine(rows);
        const winnings = getWinnigs(rows, betAmount, numberOfLines);
        balanceAmount += winnings;
        
        console.log(" \nYou won, Rs. " + winnings.toString());    

        if (balanceAmount <= 0) {
            console.log("You ran out of money!");
            console.log("Better Luck Next Time.\n");
            console.log("Game Exited...\n");
            break;
        }

        console.log("Your balance is: Rs. " + balanceAmount);
        const playAgain = prompt("Do you want to play again? (y/n) ");
        if (playAgain == "y") {
            console.log("\n");
            continue;
        } else {
            console.log("Thank You for playing!\n");
            console.log("Game exited!\n");
            break;
        }        
    }
};

game();


